import { NativeModules } from 'react-native';

const { CalllogsAndroid } = NativeModules;

export interface LogData {
  number: string;
  date: string;
  duration: string;
  country: string;
  type: string;
}

export interface CommonFilter {
  fromEpoch?: number;
  toEpoch?: number;
  limit?: number;
  skip?: number;
}

export interface NumberFilter extends CommonFilter {
  phoneNumber: string;
  type?: 'INCOMING' | 'OUTGOING' | 'MISSED' | 'VOICEMAIL' | 'REJECTED' | 'BLOCKED' | 'EXTERNAL';
}

export default CalllogsAndroid as {
  getAllLogs(filter?: CommonFilter): Promise<LogData[]>;
  getOutgoingLogs(filter?: CommonFilter): Promise<LogData[]>;
  getIncomingLogs(filter?: CommonFilter): Promise<LogData[]>;
  getMissedLogs(filter?: CommonFilter): Promise<LogData[]>;
  getRejectedLogs(filter?: CommonFilter): Promise<LogData[]>;
  getBlockedLogs(filter?: CommonFilter): Promise<LogData[]>;
  getExternallyAnsweredLogs(filter?: CommonFilter): Promise<LogData[]>;
  getByNumber(filter: NumberFilter): Promise<LogData[]>;
  getNotConnectedLogs(filter?: CommonFilter): Promise<LogData[]>;
};