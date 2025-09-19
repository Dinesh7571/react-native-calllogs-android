package com.calllogsandroid

import android.provider.CallLog
import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = CalllogsAndroidModule.NAME)
class CalllogsAndroidModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    companion object {
        const val NAME = "CalllogsAndroid"
    }

    override fun getName(): String = NAME

    private val projection = arrayOf(
        CallLog.Calls._ID,
        CallLog.Calls.NUMBER,
        CallLog.Calls.TYPE,
        CallLog.Calls.DURATION,
        CallLog.Calls.DATE,
        CallLog.Calls.COUNTRY_ISO
    )

    @ReactMethod
    fun getAllLogs(filter: ReadableMap?, promise: Promise) {
        executeQuery(filter, null, null, promise)
    }

    @ReactMethod
    fun getOutgoingLogs(filter: ReadableMap?, promise: Promise) {
        executeQuery(filter, "${CallLog.Calls.TYPE} = ${CallLog.Calls.OUTGOING_TYPE}", null, promise)
    }

    @ReactMethod
    fun getIncomingLogs(filter: ReadableMap?, promise: Promise) {
        executeQuery(filter, "${CallLog.Calls.TYPE} = ${CallLog.Calls.INCOMING_TYPE}", null, promise)
    }

    @ReactMethod
    fun getMissedLogs(filter: ReadableMap?, promise: Promise) {
        executeQuery(filter, "${CallLog.Calls.TYPE} = ${CallLog.Calls.MISSED_TYPE}", null, promise)
    }

    @ReactMethod
    fun getRejectedLogs(filter: ReadableMap?, promise: Promise) {
        executeQuery(filter, "${CallLog.Calls.TYPE} = ${CallLog.Calls.REJECTED_TYPE}", null, promise)
    }

    @ReactMethod
    fun getBlockedLogs(filter: ReadableMap?, promise: Promise) {
        executeQuery(filter, "${CallLog.Calls.TYPE} = ${CallLog.Calls.BLOCKED_TYPE}", null, promise)
    }

    @ReactMethod
    fun getExternallyAnsweredLogs(filter: ReadableMap?, promise: Promise) {
        executeQuery(filter, "${CallLog.Calls.TYPE} = ${CallLog.Calls.ANSWERED_EXTERNALLY_TYPE}", null, promise)
    }

    @ReactMethod
    fun getNotConnectedLogs(filter: ReadableMap?, promise: Promise) {
        val notConnectedCondition = "${CallLog.Calls.DURATION} = 0 AND ${CallLog.Calls.TYPE} = ${CallLog.Calls.OUTGOING_TYPE}"
        executeQuery(filter, notConnectedCondition, null, promise)
    }

    @ReactMethod
    fun getByNumber(filter: ReadableMap?, promise: Promise) {
        if (filter == null || !filter.hasKey("phoneNumber")) {
            promise.reject("INVALID_PARAMETERS", "phoneNumber is required")
            return
        }

        val phoneNumber = filter.getString("phoneNumber") ?: ""
        val baseCondition = "${CallLog.Calls.NUMBER} LIKE ?"
        val phoneNumberArg = "%$phoneNumber%"
        
        val typeCondition = when (filter.getString("type")) {
            "INCOMING" -> " AND ${CallLog.Calls.TYPE} = ${CallLog.Calls.INCOMING_TYPE}"
            "OUTGOING" -> " AND ${CallLog.Calls.TYPE} = ${CallLog.Calls.OUTGOING_TYPE}"
            "MISSED" -> " AND ${CallLog.Calls.TYPE} = ${CallLog.Calls.MISSED_TYPE}"
            "VOICEMAIL" -> " AND ${CallLog.Calls.TYPE} = ${CallLog.Calls.VOICEMAIL_TYPE}"
            "REJECTED" -> " AND ${CallLog.Calls.TYPE} = ${CallLog.Calls.REJECTED_TYPE}"
            "BLOCKED" -> " AND ${CallLog.Calls.TYPE} = ${CallLog.Calls.BLOCKED_TYPE}"
            "EXTERNAL" -> " AND ${CallLog.Calls.TYPE} = ${CallLog.Calls.ANSWERED_EXTERNALLY_TYPE}"
            else -> ""
        }

        val finalCondition = baseCondition + typeCondition
        executeQuery(filter, finalCondition, arrayOf(phoneNumberArg), promise)
    }

    private fun executeQuery(filter: ReadableMap?, selection: String?, selectionArgs: Array<String>?, promise: Promise) {
        try {
            val (finalSelection, limit, offset) = buildQueryParameters(filter, selection)
            val sortOrder = "${CallLog.Calls.DATE} DESC"

            val cursor = reactApplicationContext.contentResolver.query(
                CallLog.Calls.CONTENT_URI,
                projection,
                finalSelection,
                selectionArgs,
                sortOrder
            )

            cursor?.use {
                val result = processCursor(cursor, limit, offset)
                promise.resolve(result)
            } ?: run {
                promise.resolve(Arguments.createArray())
            }

        } catch (e: Exception) {
            promise.reject("FETCH_ERROR", e.message ?: "Unknown error occurred")
        }
    }

    private fun buildQueryParameters(filter: ReadableMap?, baseCondition: String?): Triple<String?, Int, Int> {
        var selection = baseCondition
        var limit = 50
        var offset = 0

        filter?.let {
            val fromEpoch = if (it.hasKey("fromEpoch")) it.getDouble("fromEpoch").toLong() else 0L
            val toEpoch = if (it.hasKey("toEpoch")) it.getDouble("toEpoch").toLong() else 0L

            val dateConditions = mutableListOf<String>()
            
            if (fromEpoch > 0) {
                dateConditions.add("${CallLog.Calls.DATE} >= $fromEpoch")
            }
            if (toEpoch > 0) {
                dateConditions.add("${CallLog.Calls.DATE} <= $toEpoch")
            }

            if (dateConditions.isNotEmpty()) {
                val dateCondition = dateConditions.joinToString(" AND ")
                selection = if (selection.isNullOrEmpty()) {
                    dateCondition
                } else {
                    "$selection AND $dateCondition"
                }
            }

            if (it.hasKey("limit") && it.getInt("limit") > 0) {
                limit = it.getInt("limit")
            }
            if (it.hasKey("skip") && it.getInt("skip") > 0) {
                offset = it.getInt("skip")
            }
        }

        return Triple(selection, limit, offset)
    }

    private fun processCursor(cursor: android.database.Cursor, limit: Int, offset: Int): WritableArray {
        val result = Arguments.createArray()
        
        val numberIndex = cursor.getColumnIndex(CallLog.Calls.NUMBER)
        val typeIndex = cursor.getColumnIndex(CallLog.Calls.TYPE)
        val dateIndex = cursor.getColumnIndex(CallLog.Calls.DATE)
        val durationIndex = cursor.getColumnIndex(CallLog.Calls.DURATION)
        val countryIndex = cursor.getColumnIndex(CallLog.Calls.COUNTRY_ISO)

        var count = 0
        var skipped = 0

        while (cursor.moveToNext() && count < limit) {
            if (skipped < offset) {
                skipped++
                continue
            }

            val logData = Arguments.createMap().apply {
                putString("number", cursor.getString(numberIndex) ?: "")
                putString("date", cursor.getString(dateIndex) ?: "")
                putString("duration", cursor.getString(durationIndex) ?: "")
                putString("country", cursor.getString(countryIndex) ?: "")
                putString("type", callTypeMaker(cursor.getInt(typeIndex)))
            }

            result.pushMap(logData)
            count++
        }

        return result
    }

    private fun callTypeMaker(typeId: Int): String {
        return when (typeId) {
            CallLog.Calls.INCOMING_TYPE -> "INCOMING"
            CallLog.Calls.OUTGOING_TYPE -> "OUTGOING"
            CallLog.Calls.MISSED_TYPE -> "MISSED"
            CallLog.Calls.VOICEMAIL_TYPE -> "VOICEMAIL"
            CallLog.Calls.REJECTED_TYPE -> "REJECTED"
            CallLog.Calls.BLOCKED_TYPE -> "BLOCKED"
            CallLog.Calls.ANSWERED_EXTERNALLY_TYPE -> "EXTERNAL"
            else -> "UNKNOWN"
        }
    }
}