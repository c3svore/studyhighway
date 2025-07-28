import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Plus, Play, Pause } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeContent';

const { width } = Dimensions.get('window');
const bubbleWidth = (width - 48) / 2;

interface LiquidBubbleProps {
  goal: any;
  remaining: number;
  progress: number;
  todayTargetHours: number;
  isActive: boolean;
  onQuickAdd: () => void;
  onToggleTimer: () => void;
  style?: any;
}

export function LiquidBubble({ 
  goal, 
  remaining, 
  progress, 
  todayTargetHours,
  isActive, 
  onQuickAdd, 
  onToggleTimer,
  style 
}: LiquidBubbleProps) {
  const { theme } = useTheme();

  const getProgressColor = () => {
    if (progress >= 100) return ['#66BB6A', '#4CAF50'];
    if (progress >= 70) return ['#FFA726', '#FF9800'];
    return ['#FF4757', '#E53E3E'];
  };

  const progressColors = getProgressColor();

  // Get current day name for display
  const today = new Date();
  const dayOfWeek = today.getDay();
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const currentDayShort = dayNames[dayOfWeek];
  return (
    <View style={[styles.container, style]}>
      <BlurView intensity={15} style={styles.bubble}>
        <LinearGradient
          colors={theme.gradient}
          style={styles.gradient}
        />
        
        <View style={styles.header}>
          <Text style={styles.subjectName} numberOfLines={1}>
            {goal.subject}
          </Text>
          <TouchableOpacity style={styles.addButton} onPress={onQuickAdd}>
            <Plus size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.dayIndicator}>
          <Text style={styles.dayText}>Hoje ({currentDayShort})</Text>
        </View>
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <LinearGradient
              colors={progressColors}
              style={[styles.progressFill, { width: `${Math.min(100, progress)}%` }]}
            />
          </View>
          <Text style={styles.progressText}>{Math.round(progress)}%</Text>
        </View>

        <View style={styles.timeContainer}>
          <Text style={styles.timeLabel}>Meta: {todayTargetHours}h | Restante</Text>
          <Text style={styles.timeValue}>
            {remaining.toFixed(1)}h
          </Text>
        </View>

        <TouchableOpacity 
          style={[styles.timerButton, isActive && styles.timerButtonActive]}
          onPress={onToggleTimer}
        >
          {isActive ? (
            <Pause size={20} color="#fff" />
          ) : (
            <Play size={20} color="#fff" />
          )}
          <Text style={styles.timerButtonText}>
            {isActive ? 'Pausar' : 'Iniciar'} Cronômetro
          </Text>
        </TouchableOpacity>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: bubbleWidth,
    marginBottom: 16,
  },
  bubble: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    position: 'relative',
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
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayIndicator: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    alignItems: 'center',
  },
  dayText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  progressBackground: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  timeContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  timerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
  },
  timerButtonActive: {
    backgroundColor: 'rgba(255, 71, 87, 0.8)',
  },
  timerButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});