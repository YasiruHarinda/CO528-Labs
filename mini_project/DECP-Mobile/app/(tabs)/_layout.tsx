import { Tabs } from 'expo-router';



export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: { display: 'none' } // hide tab bar — web handles navigation
    }}>
      <Tabs.Screen name="index" options={{ title: 'DECP' }}/>
    </Tabs>
  );
}