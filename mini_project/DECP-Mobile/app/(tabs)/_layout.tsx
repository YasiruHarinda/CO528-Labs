import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarStyle: {
        backgroundColor: '#0a1628',
        borderTopColor: '#1a2a4a',
        borderTopWidth: 1,
      },
      tabBarActiveTintColor: '#00d4ff',
      tabBarInactiveTintColor: '#4a6a8a',
      headerStyle: { backgroundColor: '#0a1628' },
      headerTintColor: '#00d4ff',
      headerTitleStyle: { fontWeight: 'bold' },
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Feed',
          tabBarLabel: 'Feed',
          tabBarIcon: ({ color }) => (
            <TabIcon icon="📰" color={color}/>
          ),
        }}
      />
      <Tabs.Screen
        name="jobs"
        options={{
          title: 'Jobs',
          tabBarLabel: 'Jobs',
          tabBarIcon: ({ color }) => (
            <TabIcon icon="💼" color={color}/>
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Events',
          tabBarLabel: 'Events',
          tabBarIcon: ({ color }) => (
            <TabIcon icon="📅" color={color}/>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <TabIcon icon="👤" color={color}/>
          ),
        }}
      />
    </Tabs>
  );
}

// Simple icon component
function TabIcon({ icon, color }: { icon: string, color: string }) {
  return (
    <Text style={{ fontSize: 18, color }}>{icon}</Text>
  );
}

import { Text } from 'react-native';