import CalllogsAndroid from '../index';
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
  // Mock the NativeModules
  jest.mock('react-native', () => {
    const actualReactNative = jest.requireActual('react-native');
    return {
      ...actualReactNative,
      NativeModules: {
        CalllogsAndroid: {
          getAllLogs: jest.fn(),
          getOutgoingLogs: jest.fn(),
          getIncomingLogs: jest.fn(),
          getMissedLogs: jest.fn(),
          getRejectedLogs: jest.fn(),
          getBlockedLogs: jest.fn(),
          getExternallyAnsweredLogs: jest.fn(),
          getByNumber: jest.fn(),
          getNotConnectedLogs: jest.fn(),
        },
      },
      PermissionsAndroid: {
        request: jest.fn(),
        RESULTS: {
          GRANTED: 'granted',
          DENIED: 'denied',
          NEVER_ASK_AGAIN: 'never_ask_again',
        },
        PERMISSIONS: {
          READ_CALL_LOG: 'android.permission.READ_CALL_LOG',
        },
      },
    };
  });
  
  describe('CalllogsAndroid', () => {
    const mockLogData: LogData = {
      number: '+1234567890',
      date: '1640995200000', // Jan 1, 2022
      duration: '120',
      country: 'US',
      type: 'INCOMING',
    };
  
    const mockFilter: CommonFilter = {
      fromEpoch: 1640995200000,
      toEpoch: 1641081600000,
      limit: 10,
      skip: 0,
    };
  
    const mockNumberFilter: NumberFilter = {
      phoneNumber: '+1234567890',
      type: 'INCOMING',
      limit: 5,
    };
  
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    describe('getAllLogs', () => {
      it('should call native method with correct parameters', async () => {
        const mockResponse = [mockLogData];
        (CalllogsAndroid.getAllLogs as jest.Mock).mockResolvedValue(mockResponse);
  
        const result = await CalllogsAndroid.getAllLogs(mockFilter);
  
        expect(CalllogsAndroid.getAllLogs).toHaveBeenCalledWith(mockFilter);
        expect(result).toEqual(mockResponse);
      });
  
      it('should handle empty filter', async () => {
        const mockResponse = [mockLogData];
        (CalllogsAndroid.getAllLogs as jest.Mock).mockResolvedValue(mockResponse);
  
        const result = await CalllogsAndroid.getAllLogs();
  
        expect(CalllogsAndroid.getAllLogs).toHaveBeenCalledWith(undefined);
        expect(result).toEqual(mockResponse);
      });
    });
  
    describe('getOutgoingLogs', () => {
      it('should call native method', async () => {
        const mockResponse = [mockLogData];
        (CalllogsAndroid.getOutgoingLogs as jest.Mock).mockResolvedValue(mockResponse);
  
        const result = await CalllogsAndroid.getOutgoingLogs(mockFilter);
  
        expect(CalllogsAndroid.getOutgoingLogs).toHaveBeenCalledWith(mockFilter);
        expect(result).toEqual(mockResponse);
      });
    });
  
    describe('getIncomingLogs', () => {
      it('should call native method', async () => {
        const mockResponse = [mockLogData];
        (CalllogsAndroid.getIncomingLogs as jest.Mock).mockResolvedValue(mockResponse);
  
        const result = await CalllogsAndroid.getIncomingLogs(mockFilter);
  
        expect(CalllogsAndroid.getIncomingLogs).toHaveBeenCalledWith(mockFilter);
        expect(result).toEqual(mockResponse);
      });
    });
  
    describe('getMissedLogs', () => {
      it('should call native method', async () => {
        const mockResponse = [mockLogData];
        (CalllogsAndroid.getMissedLogs as jest.Mock).mockResolvedValue(mockResponse);
  
        const result = await CalllogsAndroid.getMissedLogs(mockFilter);
  
        expect(CalllogsAndroid.getMissedLogs).toHaveBeenCalledWith(mockFilter);
        expect(result).toEqual(mockResponse);
      });
    });
  
    describe('getRejectedLogs', () => {
      it('should call native method', async () => {
        const mockResponse = [mockLogData];
        (CalllogsAndroid.getRejectedLogs as jest.Mock).mockResolvedValue(mockResponse);
  
        const result = await CalllogsAndroid.getRejectedLogs(mockFilter);
  
        expect(CalllogsAndroid.getRejectedLogs).toHaveBeenCalledWith(mockFilter);
        expect(result).toEqual(mockResponse);
      });
    });
  
    describe('getBlockedLogs', () => {
      it('should call native method', async () => {
        const mockResponse = [mockLogData];
        (CalllogsAndroid.getBlockedLogs as jest.Mock).mockResolvedValue(mockResponse);
  
        const result = await CalllogsAndroid.getBlockedLogs(mockFilter);
  
        expect(CalllogsAndroid.getBlockedLogs).toHaveBeenCalledWith(mockFilter);
        expect(result).toEqual(mockResponse);
      });
    });
  
    describe('getExternallyAnsweredLogs', () => {
      it('should call native method', async () => {
        const mockResponse = [mockLogData];
        (CalllogsAndroid.getExternallyAnsweredLogs as jest.Mock).mockResolvedValue(mockResponse);
  
        const result = await CalllogsAndroid.getExternallyAnsweredLogs(mockFilter);
  
        expect(CalllogsAndroid.getExternallyAnsweredLogs).toHaveBeenCalledWith(mockFilter);
        expect(result).toEqual(mockResponse);
      });
    });
  
    describe('getNotConnectedLogs', () => {
      it('should call native method', async () => {
        const mockResponse = [mockLogData];
        (CalllogsAndroid.getNotConnectedLogs as jest.Mock).mockResolvedValue(mockResponse);
  
        const result = await CalllogsAndroid.getNotConnectedLogs(mockFilter);
  
        expect(CalllogsAndroid.getNotConnectedLogs).toHaveBeenCalledWith(mockFilter);
        expect(result).toEqual(mockResponse);
      });
    });
  
    describe('getByNumber', () => {
      it('should call native method with correct parameters', async () => {
        const mockResponse = [mockLogData];
        (CalllogsAndroid.getByNumber as jest.Mock).mockResolvedValue(mockResponse);
  
        const result = await CalllogsAndroid.getByNumber(mockNumberFilter);
  
        expect(CalllogsAndroid.getByNumber).toHaveBeenCalledWith(mockNumberFilter);
        expect(result).toEqual(mockResponse);
      });
  
      it('should handle number filter without type', async () => {
        const mockResponse = [mockLogData];
        (CalllogsAndroid.getByNumber as jest.Mock).mockResolvedValue(mockResponse);
  
        const filterWithoutType: NumberFilter = {
          phoneNumber: '+1234567890',
          limit: 5,
        };
  
        const result = await CalllogsAndroid.getByNumber(filterWithoutType);
  
        expect(CalllogsAndroid.getByNumber).toHaveBeenCalledWith(filterWithoutType);
        expect(result).toEqual(mockResponse);
      });
    });
  
    describe('error handling', () => {
      it('should handle native method errors', async () => {
        const errorMessage = 'Permission denied';
        (CalllogsAndroid.getAllLogs as jest.Mock).mockRejectedValue(new Error(errorMessage));
  
        await expect(CalllogsAndroid.getAllLogs(mockFilter)).rejects.toThrow(errorMessage);
      });
  
      it('should handle empty responses', async () => {
        (CalllogsAndroid.getAllLogs as jest.Mock).mockResolvedValue([]);
  
        const result = await CalllogsAndroid.getAllLogs(mockFilter);
  
        expect(result).toEqual([]);
        expect(Array.isArray(result)).toBe(true);
      });
    });
  
    describe('LogData interface', () => {
      it('should have correct structure', () => {
        const log: LogData = {
          number: '+1234567890',
          date: '1640995200000',
          duration: '120',
          country: 'US',
          type: 'INCOMING',
        };
  
        expect(log).toHaveProperty('number');
        expect(log).toHaveProperty('date');
        expect(log).toHaveProperty('duration');
        expect(log).toHaveProperty('country');
        expect(log).toHaveProperty('type');
        expect(typeof log.number).toBe('string');
        expect(typeof log.date).toBe('string');
        expect(typeof log.duration).toBe('string');
        expect(typeof log.country).toBe('string');
        expect(typeof log.type).toBe('string');
      });
    });
  
    describe('CommonFilter interface', () => {
      it('should have correct structure', () => {
        const filter: CommonFilter = {
          fromEpoch: 1640995200000,
          toEpoch: 1641081600000,
          limit: 10,
          skip: 5,
        };
  
        expect(filter).toHaveProperty('fromEpoch');
        expect(filter).toHaveProperty('toEpoch');
        expect(filter).toHaveProperty('limit');
        expect(filter).toHaveProperty('skip');
        expect(typeof filter.fromEpoch).toBe('number');
        expect(typeof filter.toEpoch).toBe('number');
        expect(typeof filter.limit).toBe('number');
        expect(typeof filter.skip).toBe('number');
      });
    });
  
    describe('NumberFilter interface', () => {
      it('should have correct structure', () => {
        const filter: NumberFilter = {
          phoneNumber: '+1234567890',
          type: 'INCOMING',
          limit: 5,
          skip: 0,
        };
  
        expect(filter).toHaveProperty('phoneNumber');
        expect(filter).toHaveProperty('type');
        expect(filter).toHaveProperty('limit');
        expect(filter).toHaveProperty('skip');
        expect(typeof filter.phoneNumber).toBe('string');
        expect(typeof filter.type).toBe('string');
        expect(typeof filter.limit).toBe('number');
        expect(typeof filter.skip).toBe('number');
      });
    });
  });