import { Tabs } from 'expo-router';
import { BookOpen, Target, ChartBar as BarChart3, Timer, Chrome as Home, Clock, Settings } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeContent';

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#484d50',
          borderTopColor: '#484d50',
          borderTopWidth: 1,
          height: 85,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="subjects"
        options={{
          title: 'Disciplinas',
          tabBarIcon: ({ size, color }) => (
            <BookOpen size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          title: 'Metas',
          tabBarIcon: ({ size, color }) => (
            <Target size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="timer"
        options={{
          title: 'Cronômetro',
          tabBarIcon: ({ size, color }) => (
            <Clock size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Análises',
          tabBarIcon: ({ size, color }) => (
            <BarChart3 size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Configurações',
          tabBarIcon: ({ size, color }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}