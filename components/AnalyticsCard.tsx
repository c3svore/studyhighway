import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/components/ThemeContent';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

interface AnalyticsCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
}

export function AnalyticsCard({ icon, title, value, subtitle }: AnalyticsCardProps) {
  const { theme } = useTheme();

  return (
    <BlurView intensity={15} style={styles.card}>
      <View style={styles.header}>
        {icon}
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
      </View>
      <Text style={styles.value} numberOfLines={1}>{value}</Text>
      <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 8,
    flex: 1,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
});