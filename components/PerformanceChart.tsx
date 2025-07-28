import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

interface PerformanceChartProps {
  data: any[];
  period: string;
  theme?: any;
}

export function PerformanceChart({ data: subjects, period, theme }: PerformanceChartProps) {
  
  if (subjects.length === 0) {
    return (
      <View style={styles.emptyChart}>
        <Text style={styles.emptyText}>Nenhum dado ainda</Text>
      </View>
    );
  }

  const maxHours = Math.max(
    ...subjects.map(subject => subject.hoursStudied)
  );

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chartContainer}>
      <View style={styles.chart}>
        {subjects.map(subject => {
          const totalHours = subject.hoursStudied;
          const avgSuccess = subject.questionsAttempted > 0 
            ? (subject.questionsCorrect / subject.questionsAttempted) * 100 
            : 0;

          const heightPercentage = maxHours > 0 ? (subject.hoursStudied / maxHours) * 100 : 0;
          
          const getColor = () => {
            if (avgSuccess >= 80) return '#66BB6A';
            if (avgSuccess >= 60) return '#FFA726';
            return '#FF4757';
          };

          return (
            <View key={subject.id} style={styles.barContainer}>
              <View style={styles.barWrapper}>
                <View 
                  style={[
                    styles.bar,
                    { 
                      height: `${Math.max(5, heightPercentage)}%`,
                      backgroundColor: getColor()
                    }
                  ]}
                />
              </View>
              <Text style={styles.barLabel} numberOfLines={1}>
                {subject.name.length > 8 ? subject.name.substring(0, 8) + '...' : subject.name}
              </Text>
              <Text style={styles.barValue}>{totalHours.toFixed(1)}h</Text>
              <Text style={styles.barSuccess}>{avgSuccess.toFixed(0)}%</Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  emptyChart: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 16,
  },
  chartContainer: {
    marginHorizontal: -20,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 200,
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  barContainer: {
    alignItems: 'center',
    marginRight: 20,
    width: 60,
  },
  barWrapper: {
    height: 120,
    justifyContent: 'flex-end',
    width: '100%',
  },
  bar: {
    width: '100%',
    borderRadius: 6,
    minHeight: 8,
  },
  barLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
    textAlign: 'center',
  },
  barValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  barSuccess: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 2,
  },
});