import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { CreditCard as Edit3, Trash2, Calendar, Clock, Target } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeContent';

interface GoalCardProps {
  goal: any;
  onEdit: () => void;
  onDelete: () => void;
}

export function GoalCard({ goal, onEdit, onDelete }: GoalCardProps) {
  const { theme } = useTheme();

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getWeekEndDate = (weekStart: string) => {
    if (!weekStart) return new Date();
    const start = new Date(weekStart);
    if (isNaN(start.getTime())) return new Date();
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return end;
  };

  const activeDays = Object.entries(goal.dailyDistribution || {}).filter(
    ([_, hours]) => (hours as number) > 0
  );

  return (
    <BlurView intensity={15} style={styles.card}>
      <LinearGradient
        colors={theme.gradient}
        style={styles.gradient}
      />
      
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.subjectContainer}>
            <Target size={20} color={theme.primary} />
            <Text style={styles.subjectName}>{goal.subject}</Text>
          </View>
          <View style={styles.dateContainer}>
            <Calendar size={16} color="rgba(255, 255, 255, 0.6)" />
            <Text style={styles.dateText}>
              {formatDate(goal.weekStart)} - {formatDate(getWeekEndDate(goal.weekStart).toISOString())}
            </Text>
          </View>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
            <Edit3 size={18} color="rgba(255, 255, 255, 0.7)" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
            <Trash2 size={18} color="#FF4757" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Clock size={16} color="#66BB6A" />
            <Text style={styles.statLabel}>Meta Semanal</Text>
            <Text style={styles.statValue}>{goal.weeklyHours}h</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Calendar size={16} color="#42A5F5" />
            <Text style={styles.statLabel}>Dias Ativos</Text>
            <Text style={styles.statValue}>{activeDays.length}</Text>
          </View>
        </View>

        {activeDays.length > 0 && (
          <View style={styles.scheduleContainer}>
            <Text style={styles.scheduleTitle}>Horário Diário</Text>
            <View style={styles.scheduleGrid}>
              {activeDays.map(([day, hours]) => (
                <View key={day} style={styles.scheduleItem}>
                  <Text style={styles.scheduleDayText}>{day.slice(0, 3)}</Text>
                  <Text style={styles.scheduleHoursText}>{hours}h</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 16,
    overflow: 'hidden',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    paddingBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  subjectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  subjectName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginLeft: 6,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  statsRow: {
    flexDirection: 'row',
    paddingTop: 16,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 8,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 20,
  },
  scheduleContainer: {
    marginTop: 8,
  },
  scheduleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 12,
  },
  scheduleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  scheduleItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    minWidth: 60,
  },
  scheduleDayText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 2,
  },
  scheduleHoursText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});