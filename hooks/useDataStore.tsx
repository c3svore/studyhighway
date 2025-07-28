import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Topic {
  id: string;
  name: string;
}

export interface Subject {
  id: string;
  name: string;
  priority: 'alta' | 'média' | 'baixa';
  topics: Topic[];
  hoursStudied: number;
  questionsAttempted: number;
  questionsCorrect: number;
  createdAt: string;
}

export interface Goal {
  id: string;
  subject: string;
  weeklyHours: number;
  weekStart: string;
  dailyDistribution: { [key: string]: number };
  createdAt: string;
}

export interface PerformanceData {
  topicName: string;
  hoursStudied: number;
  questionsAttempted: number;
  questionsCorrect: number;
  successRate?: number;
}

interface DataStoreContextType {
  // Data
  subjects: Subject[];
  goals: Goal[];
  isLoading: boolean;
  
  // Subject operations
  addSubject: (subjectData: Omit<Subject, 'id' | 'hoursStudied' | 'questionsAttempted' | 'questionsCorrect' | 'createdAt'>) => Promise<void>;
  updateSubject: (id: string, updates: Partial<Subject>) => Promise<void>;
  deleteSubject: (id: string) => Promise<void>;
  
  // Goal operations
  addGoal: (goalData: Omit<Goal, 'id' | 'createdAt'>) => Promise<void>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  
  // Performance tracking
  updatePerformance: (subjectName: string, performanceData: PerformanceData) => Promise<void>;
  
  // Utility
  exportData: () => Promise<void>;
  loadData: () => Promise<void>;
}

const STORAGE_KEYS = {
  SUBJECTS: '@studyhighway_subjects',
  GOALS: '@studyhighway_goals',
};

const DataStoreContext = createContext<DataStoreContextType | undefined>(undefined);

export function DataStoreProvider({ children }: { children: ReactNode }) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from AsyncStorage on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Load subjects
      const subjectsData = await AsyncStorage.getItem(STORAGE_KEYS.SUBJECTS);
      if (subjectsData) {
        setSubjects(JSON.parse(subjectsData));
      }

      // Load goals
      const goalsData = await AsyncStorage.getItem(STORAGE_KEYS.GOALS);
      if (goalsData) {
        setGoals(JSON.parse(goalsData));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSubjects = async (newSubjects: Subject[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(newSubjects));
      setSubjects(newSubjects);
    } catch (error) {
      console.error('Error saving subjects:', error);
    }
  };

  const saveGoals = async (newGoals: Goal[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(newGoals));
      setGoals(newGoals);
    } catch (error) {
      console.error('Error saving goals:', error);
    }
  };

  // Subject operations
  const addSubject = async (subjectData: Omit<Subject, 'id' | 'hoursStudied' | 'questionsAttempted' | 'questionsCorrect' | 'createdAt'>) => {
    const newSubject: Subject = {
      ...subjectData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      hoursStudied: 0,
      questionsAttempted: 0,
      questionsCorrect: 0,
      createdAt: new Date().toISOString(),
    };

    const updatedSubjects = [...subjects, newSubject];
    await saveSubjects(updatedSubjects);
  };

  const updateSubject = async (id: string, updates: Partial<Subject>) => {
    const updatedSubjects = subjects.map(subject =>
      subject.id === id ? { ...subject, ...updates } : subject
    );
    await saveSubjects(updatedSubjects);
  };

  const deleteSubject = async (id: string) => {
    const updatedSubjects = subjects.filter(subject => subject.id !== id);
    await saveSubjects(updatedSubjects);
    
    // Also remove any goals for this subject
    const updatedGoals = goals.filter(goal => {
      const subject = subjects.find(s => s.id === id);
      return subject ? goal.subject !== subject.name : true;
    });
    await saveGoals(updatedGoals);
  };

  // Goal operations
  const addGoal = async (goalData: Omit<Goal, 'id' | 'createdAt'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };

    const updatedGoals = [...goals, newGoal];
    await saveGoals(updatedGoals);
  };

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    const updatedGoals = goals.map(goal =>
      goal.id === id ? { ...goal, ...updates } : goal
    );
    await saveGoals(updatedGoals);
  };

  const deleteGoal = async (id: string) => {
    const updatedGoals = goals.filter(goal => goal.id !== id);
    await saveGoals(updatedGoals);
  };

  // Performance tracking
  const updatePerformance = async (subjectName: string, performanceData: PerformanceData) => {
    const subjectIndex = subjects.findIndex(s => s.name === subjectName);
    if (subjectIndex === -1) return;

    const subject = subjects[subjectIndex];
    const updatedSubject = {
      ...subject,
      hoursStudied: subject.hoursStudied + performanceData.hoursStudied,
      questionsAttempted: subject.questionsAttempted + performanceData.questionsAttempted,
      questionsCorrect: subject.questionsCorrect + performanceData.questionsCorrect,
    };

    await updateSubject(subject.id, updatedSubject);
  };

  // Data export
  const exportData = async () => {
    try {
      const exportData = {
        subjects,
        goals,
        exportDate: new Date().toISOString(),
        version: '1.0',
      };

      const jsonString = JSON.stringify(exportData, null, 2);
      
      // For web platform, we'll create a download link
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `studyhighway_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  };

  const contextValue: DataStoreContextType = {
    // Data
    subjects,
    goals,
    isLoading,
    
    // Subject operations
    addSubject,
    updateSubject,
    deleteSubject,
    
    // Goal operations
    addGoal,
    updateGoal,
    deleteGoal,
    
    // Performance tracking
    updatePerformance,
    
    // Utility
    exportData,
    loadData,
  };

  return (
    <DataStoreContext.Provider value={contextValue}>
      {children}
    </DataStoreContext.Provider>
  );
}

export function useDataStore() {
  const context = useContext(DataStoreContext);
  if (!context) {
    throw new Error('useDataStore must be used within a DataStoreProvider');
  }
  return context;
}