import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Plus, Calendar, Target, CreditCard as Edit3, Trash2 } from 'lucide-react-native';
import { useDataStore } from '@/hooks/useDataStore';
import { useTheme } from '@/components/ThemeContent';
import { GoalCard } from '@/components/GoalCard';
import { CreateGoalModal } from '@/components/CreateGoalModal';

export default function GoalsScreen() {
  const { goals, subjects, addGoal, updateGoal, deleteGoal } = useDataStore();
  const { theme } = useTheme();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any>(null);

  const handleCreateGoal = (goalData: any) => {
    if (editingGoal) {
      updateGoal(editingGoal.id, goalData);
    } else {
      addGoal(goalData);
    }
    setShowCreateModal(false);
    setEditingGoal(null);
  };

  const handleEditGoal = (goal: any) => {
    setEditingGoal(goal);
    setShowCreateModal(true);
  };

  const handleDeleteGoal = (goalId: string) => {
    Alert.alert(
      'Excluir Meta',
      'Tem certeza que deseja excluir esta meta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => deleteGoal(goalId)
        }
      ]
    );
  };

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

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        colors={['#000000', '#111111', '#000000']}
        style={styles.background}
      />
      
      <View style={styles.header}>
        <BlurView intensity={20} style={styles.headerContent}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Metas Mensais</Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowCreateModal(true)}
          >
            <Plus size={24} color="#fff" style={{ backgroundColor: theme.primary }} />
          </TouchableOpacity>
        </BlurView>

        <BlurView intensity={15} style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Calendar size={20} color={theme.primary} />
            <Text style={styles.statLabel}>Esta Semana</Text>
            <Text style={styles.statValue}>{currentWeekGoals.length}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Target size={20} color="#66BB6A" />
            <Text style={styles.statLabel}>Total de Metas</Text>
            <Text style={styles.statValue}>{goals.length}</Text>
          </View>
        </BlurView>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {goals.length === 0 ? (
          <BlurView intensity={15} style={styles.emptyState}>
            <Target size={48} color="rgba(255, 255, 255, 0.3)" />
            <Text style={styles.emptyTitle}>No Goals Set</Text>
            <Text style={styles.emptyTitle}>Nenhuma Meta</Text>
            <Text style={styles.emptySubtitle}>
              Crie sua primeira meta para começar
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => setShowCreateModal(true)}
            >
              <Text style={styles.createButtonText}>Create Goal</Text>
              <Text style={styles.createButtonText}>Criar Meta</Text>
            </TouchableOpacity>
          </BlurView>
        ) : (
          <>
            {currentWeekGoals.length > 0 && (
              <View key="current-week-section" style={styles.section}>
                <Text style={styles.sectionTitle}>Esta Semana</Text>
                {currentWeekGoals.map(goal => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onEdit={() => handleEditGoal(goal)}
                    onDelete={() => handleDeleteGoal(goal.id)}
                  />
                ))}
              </View>
            )}

            {goals.filter(goal => !currentWeekGoals.includes(goal)).length > 0 && (
              <View key="previous-goals-section" style={styles.section}>
                <Text style={styles.sectionTitle}>Metas Anteriores</Text>
                {goals
                  .filter(goal => !currentWeekGoals.includes(goal))
                  .map(goal => (
                    <GoalCard
                      key={goal.id}
                      goal={goal}
                      onEdit={() => handleEditGoal(goal)}
                      onDelete={() => handleDeleteGoal(goal.id)}
                    />
                  ))}
              </View>
            )}
          </>
        )}
      </ScrollView>

      <CreateGoalModal
        visible={showCreateModal}
        goal={editingGoal}
        subjects={subjects}
        onClose={() => {
          setShowCreateModal(false);
          setEditingGoal(null);
        }}
        onSave={handleCreateGoal}
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
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    marginLeft: 4,
  },
  emptyState: {
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
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  createButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});