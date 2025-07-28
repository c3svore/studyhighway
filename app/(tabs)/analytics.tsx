import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { ChartBar as BarChart3, TrendingUp, Clock, Target, Calendar } from 'lucide-react-native';
import { useDataStore } from '@/hooks/useDataStore';
import { useTheme } from '@/components/ThemeContent';
import { PerformanceChart } from '@/components/PerformanceChart';
import { AnalyticsCard } from '@/components/AnalyticsCard';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
  const { subjects, goals } = useDataStore();
  const { theme } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const calculateTotalStudyHours = () => {
    return subjects.reduce((total, subject) => total + subject.hoursStudied, 0);
  };

  const calculateAverageSuccessRate = () => {
    const totalQuestions = subjects.reduce((sum, subject) => sum + subject.questionsAttempted, 0);
    const correctAnswers = subjects.reduce((sum, subject) => sum + subject.questionsCorrect, 0);

    return totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  };

  const getTopPerformingSubject = () => {
    let bestSubject = null;
    let bestRate = 0;

    subjects.forEach(subject => {
      const rate = subject.questionsAttempted > 0 
        ? (subject.questionsCorrect / subject.questionsAttempted) * 100 
        : 0;
      if (rate > bestRate) {
        bestRate = rate;
        bestSubject = subject.name;
      }
    });

    return { subject: bestSubject, rate: Math.round(bestRate) };
  };

  const getCurrentWeekProgress = () => {
    const currentWeekGoals = goals.filter(goal => {
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      weekStart.setHours(0, 0, 0, 0);
      
      const goalDate = new Date(goal.weekStart);
      const goalWeekStart = new Date(goalDate);
      goalWeekStart.setDate(goalDate.getDate() - goalDate.getDay());
      goalWeekStart.setHours(0, 0, 0, 0);
      
      return goalWeekStart.getTime() === weekStart.getTime();
    });

    if (currentWeekGoals.length === 0) return 0;

    const totalTargetHours = currentWeekGoals.reduce((sum, goal) => sum + goal.weeklyHours, 0);
    const totalStudiedHours = currentWeekGoals.reduce((sum, goal) => {
      const subject = subjects.find(s => s.name === goal.subject);
      return sum + (subject ? subject.hoursStudied : 0);
    }, 0);

    return totalTargetHours > 0 ? Math.round((totalStudiedHours / totalTargetHours) * 100) : 0;
  };

  const periods = [
    { key: 'week', label: 'Semana' },
    { key: 'month', label: 'Mês' },
    { key: 'all', label: 'Total' },
  ];

  const totalHours = calculateTotalStudyHours();
  const averageSuccess = calculateAverageSuccessRate();
  const topSubject = getTopPerformingSubject();
  const weekProgress = getCurrentWeekProgress();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={theme.gradient}
      />
      
      <View style={styles.header}>
        <BlurView intensity={20} style={styles.headerContent}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Análises</Text>
          </View>
          <BarChart3 size={32} color={theme.primary} />
        </BlurView>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.periodContainer}
        >
          {periods.map(period => (
            <TouchableOpacity
              key={period.key}
              style={[
                styles.periodButton,
                selectedPeriod === period.key && {
                  backgroundColor: theme.primary,
                  borderColor: theme.primary,
                }
              ]}
              onPress={() => setSelectedPeriod(period.key)}
            >
              <Text style={[
                styles.periodText,
                selectedPeriod === period.key && styles.periodTextActive
              ]}>
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsGrid}>
          <AnalyticsCard
            icon={<Clock size={24} color="#ffb6c1" />}
            title="Horas Totais"
            value={`${totalHours.toFixed(1)}h`}
            subtitle="Em todas as disciplinas"
          />
          <AnalyticsCard
            icon={<TrendingUp size={24} color="#66BB6A" />}
            title="Taxa de sucesso"
            value={`${averageSuccess}%`}
            subtitle="Porcentagem de acertos"
          />
          <AnalyticsCard
            icon={<Target size={24} color="#FFA726" />}
            title="Melhor Disciplina"
            value={topSubject.subject || 'None'}
            subtitle={topSubject.subject ? `${topSubject.rate}% sucesso` : 'Sem dados'}
          />
          <AnalyticsCard
            icon={<Calendar size={24} color="#42A5F5" />}
            title="Progresso Semanal"
            value={`${weekProgress}%`}
            subtitle="Das metas semanais"
          />
        </View>

        {subjects.length > 0 && (
          <BlurView intensity={15} style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Visão Geral</Text>
            <PerformanceChart 
              data={subjects} 
              period={selectedPeriod}
              theme={theme}
            />
          </BlurView>
        )}

        {subjects.length > 0 && (
          <BlurView intensity={15} style={styles.subjectStatsContainer}>
            <Text style={styles.sectionTitle}>Por Disciplina</Text>
            {subjects.map(subject => {
              const avgSuccess = subject.questionsAttempted > 0 
                ? Math.round((subject.questionsCorrect / subject.questionsAttempted) * 100)
                : 0;

              const priorityColor = {
                alta: '#FF4757',
                média: '#FFA726',
                baixa: '#66BB6A'
              }[subject.priority] || '#ffb6c1';

              return (
                <View key={subject.id} style={styles.subjectStatItem}>
                  <View style={styles.subjectHeader}>
                    <View style={[styles.priorityDot, { backgroundColor: priorityColor }]} />
                    <Text style={styles.subjectName}>{subject.name}</Text>
                  </View>
                  <View style={styles.subjectStats}>
                    <Text style={styles.subjectStatText}>{subject.hoursStudied.toFixed(1)}h estudadas</Text>
                    <Text style={styles.subjectStatText}>{avgSuccess}% sucesso</Text>
                    <Text style={styles.subjectStatText}>{subject.topics.length} tópicos</Text>
                  </View>
                </View>
              );
            })}
          </BlurView>
        )}
      </ScrollView>
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
    marginBottom: 16,
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
  periodContainer: {
    marginBottom: 8,
  },
  periodButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  periodText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '600',
  },
  periodTextActive: {
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  chartContainer: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  subjectStatsContainer: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  subjectStatItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  subjectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  subjectStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subjectStatText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
});