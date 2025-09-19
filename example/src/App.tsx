import React, { useState } from 'react';
import { View, Text, Button, FlatList, PermissionsAndroid, Alert } from 'react-native';
import CalllogsAndroid from 'react-native-calllogs-android';
interface LogData {
  number: string;
  date: string;
  duration: string;
  country: string;
  type: string;
}
const App = () => {
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

  const renderItem = ({ item }: { item: LogData }) => (
    <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
      <Text>Number: {item.number}</Text>
      <Text>Type: {item.type}</Text>
      <Text>Duration: {item.duration}s</Text>
      <Text>Date: {new Date(Number(item.date)).toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button title="Fetch Call Logs" onPress={fetchCallLogs} />
      <FlatList
        data={logs}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.date}-${index}`}
      />
    </View>
  );
};

export default App;