import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Vibration,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Play, Pause, Square, Settings, Clock } from 'lucide-react-native';
import { useDataStore } from '@/hooks/useDataStore';
import { useTheme } from '@/components/ThemeContent';
import { TimerSettings } from '@/components/TimerSettings';

export default function TimerScreen() {
  const { subjects, updatePerformance } = useDataStore();
  const { theme } = useTheme();
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes default
  const [isBreak, setIsBreak] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [showTopics, setShowTopics] = useState(false);
  
  const [settings, setSettings] = useState({
    workDuration: 25,
    shortBreak: 5,
    longBreak: 15,
    sessionsUntilLongBreak: 4,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      if (timeLeft === 0 && isRunning) {
        handleTimerComplete();
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    Vibration.vibrate([0, 500, 200, 500]);
    
    if (!isBreak) {
      // Work session completed
      const sessionHours = settings.workDuration / 60;
      if (selectedSubject && selectedTopic) {
        const subject = subjects.find(s => s.name === selectedSubject);
        if (subject && subject.topics.find(t => t.name === selectedTopic)) {
          updatePerformance(selectedSubject, {
            topicName: selectedTopic,
            hoursStudied: sessionHours,
            questionsAttempted: 0,
            questionsCorrect: 0,
            successRate: 0,
          });
        }
      }
      
      setSessionCount(prev => prev + 1);
      setIsBreak(true);
      
      // Determine break duration
      const isLongBreak = (sessionCount + 1) % settings.sessionsUntilLongBreak === 0;
      const breakDuration = isLongBreak ? settings.longBreak : settings.shortBreak;
      setTimeLeft(breakDuration * 60);
      
      Alert.alert(
        'Work Session Complete!',
        `Time for a ${isLongBreak ? 'long' : 'short'} break (${breakDuration} minutes)`,
        [
          { text: 'Start Break', onPress: () => setIsRunning(true) },
          { text: 'Skip Break', onPress: handleStartNewSession }
        ]
      );
    } else {
      // Break completed
      Alert.alert(
        'Break Complete!',
        'Ready to start your next work session?',
        [
          { text: 'Start Work', onPress: handleStartNewSession },
          { text: 'Stop Timer', onPress: handleStop }
        ]
      );
    }
  };

  const handleStartNewSession = () => {
    setIsBreak(false);
    setTimeLeft(settings.workDuration * 60);
    setIsRunning(true);
  };

  const handleStart = () => {
    if (!isBreak && (!selectedSubject || !selectedTopic)) {
      Alert.alert('Selecionar Disciplina e Tópico', 'Selecione uma disciplina e tópico para acompanhar.');
      return;
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(settings.workDuration * 60);
    setSessionCount(0);
    setSelectedTopic('');
  };

  const handleSettingsUpdate = (newSettings: any) => {
    setSettings(newSettings);
    if (!isRunning) {
      setTimeLeft(newSettings.workDuration * 60);
    }
    setShowSettings(false);
  };

  const handleSubjectSelect = (subjectName: string) => {
    setSelectedSubject(subjectName);
    setSelectedTopic('');
    setShowTopics(true);
  };

  const handleTopicSelect = (topicName: string) => {
    setSelectedTopic(topicName);
    setShowTopics(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = isBreak 
    ? 1 - (timeLeft / ((sessionCount % settings.sessionsUntilLongBreak === 0 ? settings.longBreak : settings.shortBreak) * 60))
    : 1 - (timeLeft / (settings.workDuration * 60));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000000', '#111111', '#000000']}
        style={styles.background}
      />
      
      <View style={styles.header}>
        <BlurView intensity={20} style={styles.headerContent}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Cronômetro</Text>
          </View>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => setShowSettings(true)}
          >
            <Settings size={24} color="#fff" style={{ backgroundColor: theme.primary }} />
          </TouchableOpacity>
        </BlurView>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <BlurView intensity={15} style={styles.timerContainer}>
          <LinearGradient
            colors={theme.gradient}
            style={styles.timerGradient}
          />
          
          <View style={styles.timerHeader}>
            <Clock size={24} color={theme.primary} />
            <Text style={styles.sessionTitle}>
              {isBreak ? 'Pausa' : 'Sessão de Estudo'}
            </Text>
          </View>

          <View style={styles.progressRing}>
            <View style={[styles.progressFill, { 
              transform: [{ rotate: `${progress * 360}deg` }] 
            }]} />
            <View style={styles.timerContent}>
              <Text style={styles.timeText}>{formatTime(timeLeft)}</Text>
              <Text style={styles.sessionText}>
                Sessão {sessionCount + 1}
              </Text>
            </View>
          </View>
        </BlurView>

        {!isBreak && (
          <BlurView intensity={15} style={styles.subjectSelector}>
            {!showTopics ? (
              <>
                <Text style={styles.selectorLabel}>Selecionar Disciplina</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.subjectButtons}>
                    {subjects.length === 0 ? (
                      <Text style={styles.noSubjectsText}>
                        Adicione disciplinas na aba Disciplinas
                      </Text>
                    ) : (
                      subjects.map(subject => (
                        <TouchableOpacity
                          key={subject.id}
                          style={[
                            styles.subjectButton,
                            selectedSubject === subject.name && styles.subjectButtonActive
                          ]}
                          onPress={() => handleSubjectSelect(subject.name)}
                        >
                          <Text style={[
                            styles.subjectButtonText,
                            selectedSubject === subject.name && styles.subjectButtonTextActive
                          ]}>
                            {subject.name}
                          </Text>
                        </TouchableOpacity>
                      ))
                    )}
                  </View>
                </ScrollView>
              </>
            ) : (
              <>
                <View style={styles.topicHeader}>
                  <Text style={styles.selectorLabel}>Selecionar Tópico para {selectedSubject}</Text>
                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => setShowTopics(false)}
                  >
                    <Text style={styles.backButtonText}>Voltar</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.subjectButtons}>
                    {subjects.find(s => s.name === selectedSubject)?.topics.map((topic: any) => (
                      <TouchableOpacity
                        key={topic.id}
                        style={[
                          styles.subjectButton,
                          selectedTopic === topic.name && styles.subjectButtonActive
                        ]}
                        onPress={() => handleTopicSelect(topic.name)}
                      >
                        <Text style={[
                          styles.subjectButtonText,
                          selectedTopic === topic.name && styles.subjectButtonTextActive
                        ]}>
                          {topic.name}
                        </Text>
                      </TouchableOpacity>
                    )) || []}
                  </View>
                </ScrollView>
              </>
            )}
          </BlurView>
        )}

        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, styles.stopButton]}
            onPress={handleStop}
            disabled={!isRunning && timeLeft === settings.workDuration * 60}
          >
            <Square size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.playButton]}
            onPress={isRunning ? handlePause : handleStart}
          >
            {isRunning ? (
              <Pause size={32} color="#fff" />
            ) : (
              <Play size={32} color="#fff" />
            )}
          </TouchableOpacity>

          <View style={styles.placeholder} />
        </View>

        <BlurView intensity={15} style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{sessionCount}</Text>
            <Text style={styles.statLabel}>Concluídas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {Math.floor((sessionCount * settings.workDuration) / 60)}h {(sessionCount * settings.workDuration) % 60}m
            </Text>
            <Text style={styles.statLabel}>Tempo Total</Text>
          </View>
        </BlurView>
      </ScrollView>

      <TimerSettings
        visible={showSettings}
        settings={settings}
        onClose={() => setShowSettings(false)}
        onSave={handleSettingsUpdate}
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
  header: {
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  settingsButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    alignItems: 'center',
    paddingBottom: 100,
  },
  timerContainer: {
    width: '100%',
    padding: 32,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 32,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  timerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  timerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  sessionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  progressRing: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 8,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  progressFill: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 8,
    borderColor: '#ffb6c1',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  timerContent: {
    alignItems: 'center',
  },
  timeText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  sessionText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  subjectSelector: {
    width: '100%',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 32,
  },
  selectorLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  subjectButtons: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 4,
  },
  subjectButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  subjectButtonActive: {
    backgroundColor: '#ffb6c1',
    borderColor: '#ffb6c1',
  },
  subjectButtonText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '600',
  },
  subjectButtonTextActive: {
    color: '#000000',
  },
  noSubjectsText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 40,
    marginBottom: 32,
  },
  controlButton: {
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
  placeholder: {
    width: 60,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    width: '100%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 20,
  },
});