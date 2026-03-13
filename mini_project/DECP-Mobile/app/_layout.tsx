import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#0a1628"/>
      <Stack screenOptions={{
        headerStyle: { backgroundColor: '#0a1628' },
        headerTintColor: '#00d4ff',
        headerTitleStyle: { fontWeight: 'bold' },
        contentStyle: { backgroundColor: '#0a1628' }
      }}/>
    </>
  );
}