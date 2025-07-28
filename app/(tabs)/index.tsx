import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Plus, Play, Pause, Timer, Settings, Minimize2, Maximize2 } from 'lucide-react-native';
import { useDataStore } from '@/hooks/useDataStore';
import { useTheme } from '@/components/ThemeContent';
import { LiquidBubble } from '@/components/LiquidBubble';
import { QuickAddModal } from '@/components/QuickAddModal';
import { TimerSettings } from '@/components/TimerSettings';
import { PerformanceModal } from '@/components/PerformanceModal';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { goals, subjects, updatePerformance } = useDataStore();
  const { theme } = useTheme();
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const [activeTimers, setActiveTimers] = useState<{ [key: string]: boolean }>({});
  
  // Pomodoro Timer State
  const [pomodoroVisible, setPomodoroVisible] = useState(false);
  const [pomodoroMinimized, setPomodoroMinimized] = useState(false);
  const [pomodoroRunning, setPomodoroRunning] = useState(false);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60); // 25 minutes
  const [isBreak, setIsBreak] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [showTimerSettings, setShowTimerSettings] = useState(false);
  const [timerSettings, setTimerSettings] = useState({
    workDuration: 25,
    shortBreak: 5,
    longBreak: 15,
    sessionsUntilLongBreak: 4,
  });
  
  // Pomodoro Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (pomodoroRunning && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime(prev => prev - 1);
      }, 1000);
    } else if (pomodoroTime === 0 && pomodoroRunning) {
      handlePomodoroComplete();
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [pomodoroRunning, pomodoroTime]);
  
  const handlePomodoroComplete = () => {
    if (!isBreak) {
      // Work session completed
      setSessionCount(prev => prev + 1);
      setIsBreak(true);
      
      const isLongBreak = (sessionCount + 1) % timerSettings.sessionsUntilLongBreak === 0;
      const breakDuration = isLongBreak ? timerSettings.longBreak : timerSettings.shortBreak;
      setPomodoroTime(breakDuration * 60);
      
      Alert.alert(
        'Sessão completa',
        `Hora de ${isLongBreak ? 'longa' : 'curta'} pausa (${breakDuration} minutos)`,
        [
          { text: 'Começar pausa', onPress: () => setPomodoroRunning(true) },
          { text: 'Pular pausa', onPress: startNewPomodoroSession }
        ]
      );
    } else {
      // Break completed
      Alert.alert(
        'Pausa completa',
        'Pronto para começar uma nova sessão?',
        [
          { text: 'Começar', onPress: startNewPomodoroSession },
          { text: 'Parar', onPress: stopPomodoro }
        ]
      );
    }
  };
  
  const startNewPomodoroSession = () => {
    setIsBreak(false);
    setPomodoroTime(timerSettings.workDuration * 60);
    setPomodoroRunning(true);
  };
  
  const startPomodoro = () => {
    setPomodoroRunning(true);
  };
  
  const pausePomodoro = () => {
    setPomodoroRunning(false);
  };
  
  const stopPomodoro = () => {
    setPomodoroRunning(false);
    setIsBreak(false);
    setPomodoroTime(timerSettings.workDuration * 60);
    setSessionCount(0);
  };
  
  const formatPomodoroTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleTimerSettingsUpdate = (newSettings: any) => {
    setTimerSettings(newSettings);
    if (!pomodoroRunning) {
      setPomodoroTime(newSettings.workDuration * 60);
    }
    setShowTimerSettings(false);
  };

  const handleQuickAdd = (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    setSelectedGoal(goal);
    setShowQuickAdd(true);
  };

  const handleSavePerformance = (data: any) => {
    if (selectedGoal) {
      updatePerformance(selectedGoal.subject, {
        topicName: data.topic,
        hoursStudied: data.hoursStudied,
        questionsAttempted: data.questionsAttempted,
        questionsCorrect: data.questionsCorrect,
      });
    }
    setShowQuickAdd(false);
    setSelectedGoal(null);
  };

  const handleSaveGeneralPerformance = (data: any) => {
    updatePerformance(data.subject, {
      topicName: data.topic,
      hoursStudied: data.hoursStudied || 0,
      questionsAttempted: data.questionsAttempted || 0,
      questionsCorrect: data.questionsCorrect || 0,
    });
    setShowPerformanceModal(false);
  };

  const toggleTimer = (goalId: string) => {
    setActiveTimers(prev => ({
      ...prev,
      [goalId]: !prev[goalId]
    }));
  };

  const renderBubble = (goal: any, index: number) => {
    const subject = subjects.find(s => s.name === goal.subject);
    const totalStudied = subject ? subject.hoursStudied : 0;
    
    // Get current day of week (0 = Sunday, 1 = Monday, etc.)
    const today = new Date();
    const dayOfWeek = today.getDay();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDayName = dayNames[dayOfWeek];
    
    // Get today's target hours from daily distribution
    const todayTargetHours = goal.dailyDistribution?.[currentDayName] || 0;
    
    // If no hours scheduled for today, don't show the bubble
    if (todayTargetHours === 0) {
      return null;
    }
    
    // Calculate remaining hours for today only
    const remaining = Math.max(0, todayTargetHours - totalStudied);
    const progress = todayTargetHours > 0 ? (totalStudied / todayTargetHours) * 100 : 0;
    
    // If goal is completed for today (progress >= 100%), don't show the bubble
    if (progress >= 100) {
      return null;
    }

    return (
      <LiquidBubble
        key={goal.id}
        goal={goal}
        remaining={remaining}
        progress={progress}
        todayTargetHours={todayTargetHours}
        isActive={activeTimers[goal.id]}
        onQuickAdd={() => handleQuickAdd(goal.id)}
        onToggleTimer={() => toggleTimer(goal.id)}
      />
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000000', '#111111', '#000000']}
        style={styles.background}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <BlurView intensity={20} style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.title}>StudyHighway</Text>
            </View>
            <View style={styles.headerButtons}>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => setShowPerformanceModal(true)}
              >
                <Plus size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.pomodoroButton}
                onPress={() => setPomodoroVisible(true)}
              >
                <Timer size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>

        <View style={styles.bubblesContainer}>
          {goals.length === 0 ? (
            <BlurView intensity={15} style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Sem metas definidas</Text>
              <Text style={styles.emptySubtitle}>
                Crie uma nova meta para iniciar.
              </Text>
            </BlurView>
          ) : (
            goals.map((goal, index) => renderBubble(goal, index))
          )}
        </View>
      </ScrollView>

      {/* Pomodoro Timer Overlay */}
      {pomodoroVisible && (
        <View style={[styles.pomodoroOverlay, pomodoroMinimized && styles.pomodoroMinimized]}>
          <BlurView intensity={30} style={styles.pomodoroContainer}>
            <LinearGradient
              colors={theme.gradient}
              style={styles.pomodoroGradient}
            />
            
            {!pomodoroMinimized ? (
              <>
                <View style={styles.pomodoroHeader}>
                  <Text style={styles.pomodoroTitle}>
                    {isBreak ? 'Pausa' : 'Sessão'}
                  </Text>
                  <View style={styles.pomodoroControls}>
                    <TouchableOpacity
                      style={styles.pomodoroControlButton}
                      onPress={() => setShowTimerSettings(true)}
                    >
                      <Settings size={20} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.pomodoroControlButton}
                      onPress={() => setPomodoroMinimized(true)}
                    >
                      <Minimize2 size={20} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.pomodoroControlButton}
                      onPress={() => setPomodoroVisible(false)}
                    >
                      <Text style={styles.closeText}>×</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.pomodoroContent}>
                  <Text style={styles.pomodoroTime}>{formatPomodoroTime(pomodoroTime)}</Text>
                  <Text style={styles.pomodoroSession}>Sessão {sessionCount + 1}</Text>
                  
                  <View style={styles.pomodoroButtons}>
                    <TouchableOpacity
                      style={[styles.pomodoroActionButton, styles.stopButton]}
                      onPress={stopPomodoro}
                    >
                      <Text style={styles.pomodoroButtonText}>Parar</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[styles.pomodoroActionButton, styles.playButton]}
                      onPress={pomodoroRunning ? pausePomodoro : startPomodoro}
                    >
                      {pomodoroRunning ? (
                        <Pause size={24} color="#fff" />
                      ) : (
                        <Play size={24} color="#fff" />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            ) : (
              <TouchableOpacity
                style={styles.minimizedContent}
                onPress={() => setPomodoroMinimized(false)}
              >
                <Timer size={16} color="#fff" />
                <Text style={styles.minimizedTime}>{formatPomodoroTime(pomodoroTime)}</Text>
                <Maximize2 size={16} color="#fff" />
              </TouchableOpacity>
            )}
          </BlurView>
        </View>
      )}

      <QuickAddModal
        visible={showQuickAdd}
        goal={selectedGoal}
        subjects={subjects}
        onClose={() => setShowQuickAdd(false)}
        onSave={handleSavePerformance}
      />
      
      <TimerSettings
        visible={showTimerSettings}
        settings={timerSettings}
        onClose={() => setShowTimerSettings(false)}
        onSave={handleTimerSettingsUpdate}
      />
      
      <PerformanceModal
        visible={showPerformanceModal}
        subjects={subjects}
        onClose={() => setShowPerformanceModal(false)}
        onSave={handleSaveGeneralPerformance}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    padding: 24,
    paddingTop: 60,
    borderRadius: 20,
    margin: 16,
    marginTop: 40,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  pomodoroButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubblesContainer: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emptyState: {
    width: width - 32,
    padding: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: 20,
  },
  pomodoroOverlay: {
    position: 'absolute',
    top: 120,
    right: 16,
    width: width - 32,
    zIndex: 1000,
  },
  pomodoroMinimized: {
    width: 140,
    top: 120,
    right: 16,
  },
  pomodoroContainer: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    overflow: 'hidden',
  },
  pomodoroGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  pomodoroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  pomodoroTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  pomodoroControls: {
    flexDirection: 'row',
    gap: 8,
  },
  pomodoroControlButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  pomodoroContent: {
    padding: 16,
    paddingTop: 8,
    alignItems: 'center',
  },
  pomodoroTime: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  pomodoroSession: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 24,
  },
  pomodoroButtons: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  pomodoroActionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  stopButton: {
    backgroundColor: '#FF4757',
  },
  pomodoroButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  minimizedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  minimizedTime: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
});