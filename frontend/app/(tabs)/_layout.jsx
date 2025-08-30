import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          backgroundColor: '#191F40',
          borderTopWidth: 2,
          borderTopColor: 'rgba(255,255,255,0.15)',
          shadowColor: '#ffffff',
          shadowOpacity: 0.08,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: -2 },
          elevation: 3
        },
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} color={color} size={size} />
          ),
          tabBarItemStyle: {
            borderLeftWidth: 0,
          },
        }}
      />
      <Tabs.Screen
        name="Recommended"
        options={{
          title: 'Recommended',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'star' : 'star-outline'} color={color} size={size} />
          ),
          tabBarItemStyle: {
            borderLeftWidth: 1,
            borderLeftColor: 'rgba(255,255,255,0.15)',
          },
        }}
      />
      <Tabs.Screen
        name="Popular"
        options={{
          title: 'Popular',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'flame' : 'flame-outline'} color={color} size={size} />
          ),
          tabBarItemStyle: {
            borderLeftWidth: 1,
            borderLeftColor: 'rgba(255,255,255,0.15)',
          },
        }}
      />
    </Tabs>
  );
}
