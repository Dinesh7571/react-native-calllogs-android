# React Native CallLogs Android

A powerful React Native library for accessing Android call logs with TypeScript support and comprehensive filtering options.

##  Features

-  **Full TypeScript Support** - Complete type definitions for better development experience
-  **Android Native Integration** - Direct access to Android's call log database
-  **Advanced Filtering** - Filter by date range, call type, phone number, and more
-  **High Performance** - Optimized native code for fast data retrieval
- **Permission Handling** - Built-in permission request utilities
- **Multiple Call Types** - Support for all call types (incoming, outgoing, missed, etc.)

##  Installation

```bash
npm install react-native-calllogs-android
```

### For React Native 0.60+
The library uses autolinking, so no manual linking is required.

### For React Native < 0.60
```bash
react-native link react-native-calllogs-android
```




## 🔧 API Reference

### Types

#### `LogData`
```typescript
interface LogData {
  number: string;      // Phone number
  date: string;        // Call date (epoch timestamp)
  duration: string;    // Call duration in seconds
  country: string;     // Country code
  type: string;        // Call type
}
```

#### `CommonFilter`
```typescript
interface CommonFilter {
  fromEpoch?: number;  // Start date filter (epoch timestamp)
  toEpoch?: number;    // End date filter (epoch timestamp)
  limit?: number;      // Maximum number of results
  skip?: number;       // Number of records to skip
}
```

#### `NumberFilter`
```typescript
interface NumberFilter extends CommonFilter {
  phoneNumber: string; // Specific phone number to filter
  type?: 'INCOMING' | 'OUTGOING' | 'MISSED' | 'VOICEMAIL' | 'REJECTED' | 'BLOCKED' | 'EXTERNAL';
}
```

### Methods

| Method | Description | Parameters | Returns |
|--------|-------------|------------|---------|
| `getAllLogs()` | Retrieve all call logs | `filter?: CommonFilter` | `Promise<LogData[]>` |
| `getOutgoingLogs()` | Get outgoing calls only | `filter?: CommonFilter` | `Promise<LogData[]>` |
| `getIncomingLogs()` | Get incoming calls only | `filter?: CommonFilter` | `Promise<LogData[]>` |
| `getMissedLogs()` | Get missed calls only | `filter?: CommonFilter` | `Promise<LogData[]>` |
| `getRejectedLogs()` | Get rejected calls only | `filter?: CommonFilter` | `Promise<LogData[]>` |
| `getBlockedLogs()` | Get blocked calls only | `filter?: CommonFilter` | `Promise<LogData[]>` |
| `getExternallyAnsweredLogs()` | Get externally answered calls | `filter?: CommonFilter` | `Promise<LogData[]>` |
| `getByNumber()` | Get calls for specific number | `filter: NumberFilter` | `Promise<LogData[]>` |
| `getNotConnectedLogs()` | Get calls that weren't connected | `filter?: CommonFilter` | `Promise<LogData[]>` |

## Usage Examples

### Basic Usage

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import { PermissionsAndroid } from 'react-native';
import CalllogsAndroid, { LogData } from 'react-native-calllogs-android';

const CallLogsScreen = () => {
  const [logs, setLogs] = useState<LogData[]>([]);

  const requestPermission = async (): Promise<boolean> => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
        {
          title: 'Call Log Permission',
          message: 'This app needs access to your call logs',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const fetchCallLogs = async () => {
    try {
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        Alert.alert('Permission denied', 'Call log permission is required');
        return;
      }

      const callLogs = await CalllogsAndroid.getAllLogs({ limit: 20 });
      setLogs(callLogs);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch call logs');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCallLogs();
  }, []);

  const renderItem = ({ item }: { item: LogData }) => (
    <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.number}</Text>
      <Text style={{ color: '#666' }}>Type: {item.type}</Text>
      <Text style={{ color: '#666' }}>Duration: {item.duration}s</Text>
      <Text style={{ color: '#666' }}>
        Date: {new Date(Number(item.date)).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={logs}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.date}-${index}`}
      />
    </View>
  );
};

export default CallLogsScreen;
```

### Advanced Filtering

```typescript
// Get missed calls from last 7 days
const getRecentMissedCalls = async () => {
  const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
  
  const missedCalls = await CalllogsAndroid.getMissedLogs({
    fromEpoch: sevenDaysAgo,
    limit: 50
  });
  
  return missedCalls;
};

// Get calls for specific number
const getCallsForNumber = async (phoneNumber: string) => {
  const calls = await CalllogsAndroid.getByNumber({
    phoneNumber: phoneNumber,
    type: 'INCOMING',
    limit: 10
  });
  
  return calls;
};

// Get outgoing calls with pagination
const getOutgoingCallsPaginated = async (page: number = 0, pageSize: number = 20) => {
  const outgoingCalls = await CalllogsAndroid.getOutgoingLogs({
    limit: pageSize,
    skip: page * pageSize
  });
  
  return outgoingCalls;
};
```

### Date Range Filtering

```typescript
const getCallsInDateRange = async (startDate: Date, endDate: Date) => {
  const callLogs = await CalllogsAndroid.getAllLogs({
    fromEpoch: startDate.getTime(),
    toEpoch: endDate.getTime(),
    limit: 100
  });
  
  return callLogs;
};

// Get today's calls
const getTodaysCalls = async () => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));
  
  return await getCallsInDateRange(startOfDay, endOfDay);
};
```

### Call Statistics

```typescript
const getCallStatistics = async () => {
  try {
    const [incoming, outgoing, missed] = await Promise.all([
      CalllogsAndroid.getIncomingLogs({ limit: 1000 }),
      CalllogsAndroid.getOutgoingLogs({ limit: 1000 }),
      CalllogsAndroid.getMissedLogs({ limit: 1000 })
    ]);

    return {
      totalIncoming: incoming.length,
      totalOutgoing: outgoing.length,
      totalMissed: missed.length,
      totalCalls: incoming.length + outgoing.length + missed.length
    };
  } catch (error) {
    console.error('Error getting call statistics:', error);
    return null;
  }
};
```

## 🔒 Permission Best Practices

### Check Permission Before Use

```typescript
import { PermissionsAndroid, Platform } from 'react-native';

const checkCallLogPermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') {
    return false;
  }

  const hasPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.READ_CALL_LOG
  );

  if (hasPermission) {
    return true;
  }

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
    {
      title: 'Call Log Access Required',
      message: 'This feature requires access to your call history to function properly.',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'Grant Access',
    }
  );

  return granted === PermissionsAndroid.RESULTS.GRANTED;
};
```

## 🎨 UI Components Example

### Call Log List Component

```typescript
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LogData } from 'react-native-calllogs-android';

interface CallLogItemProps {
  item: LogData;
  onPress?: (item: LogData) => void;
}

const CallLogItem: React.FC<CallLogItemProps> = ({ item, onPress }) => {
  const getCallTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'incoming': return '#4CAF50';
      case 'outgoing': return '#2196F3';
      case 'missed': return '#F44336';
      default: return '#757575';
    }
  };

  const formatDuration = (duration: string) => {
    const seconds = parseInt(duration);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => onPress?.(item)}
    >
      <View style={styles.header}>
        <Text style={styles.number}>{item.number || 'Unknown'}</Text>
        <Text style={[styles.type, { color: getCallTypeColor(item.type) }]}>
          {item.type}
        </Text>
      </View>
      
      <View style={styles.details}>
        <Text style={styles.date}>
          {new Date(Number(item.date)).toLocaleString()}
        </Text>
        <Text style={styles.duration}>
          Duration: {formatDuration(item.duration)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  number: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
  },
  type: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  date: {
    fontSize: 14,
    color: '#757575',
  },
  duration: {
    fontSize: 14,
    color: '#757575',
  },
});
```

## 🚨 Error Handling

```typescript
const safeGetCallLogs = async () => {
  try {
    // Check permission first
    const hasPermission = await checkCallLogPermission();
    if (!hasPermission) {
      throw new Error('Call log permission denied');
    }

    // Fetch call logs with timeout
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), 10000)
    );

    const callLogsPromise = CalllogsAndroid.getAllLogs({ limit: 100 });
    
    const callLogs = await Promise.race([callLogsPromise, timeoutPromise]) as LogData[];
    
    return { success: true, data: callLogs };
  } catch (error) {
    console.error('Error fetching call logs:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};
```

## 🔧 Troubleshooting

### Common Issues

1. **Permission Denied**
   - Ensure `READ_CALL_LOG` permission is declared in AndroidManifest.xml
   - Request permission at runtime before accessing call logs

2. **Empty Results**
   - Check if the device has any call logs
   - Verify filter parameters are correct
   - Ensure the app has proper permissions

3. **Performance Issues**
   - Use appropriate `limit` values to avoid loading too much data
   - Implement pagination for large datasets
   - Consider caching results for better performance

### Debug Mode

```typescript
const debugCallLogs = async () => {
  console.log('Checking call log access...');
  
  const hasPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.READ_CALL_LOG
  );
  
  console.log('Has permission:', hasPermission);
  
  if (hasPermission) {
    try {
      const logs = await CalllogsAndroid.getAllLogs({ limit: 1 });
      console.log('Sample log:', logs[0]);
    } catch (error) {
      console.error('Error accessing call logs:', error);
    }
  }
};
```

## 📄 License

MIT © DINESH K

##  Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## Support

-  Email: cat505600@gmail.com.com
-  Issues: [GitHub Issues](https://github.com/dinesh7571/react-native-calllogs-android/issues)
-  Discussions: [GitHub Discussions](https://github.com/dinesh7571/react-native-calllogs-android/discussions)

---

Made with ❤️ for the React Native community