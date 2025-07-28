import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { X, Target, Calendar, Clock } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeContent';

interface CreateGoalModalProps {
  visible: boolean;
  goal?: any;
  subjects: any[];
  onClose: () => void;
  onSave: (data: any) => void;
}

export function CreateGoalModal({ visible, goal, subjects, onClose, onSave }: CreateGoalModalProps) {
  const { theme } = useTheme();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [weeklyHours, setWeeklyHours] = useState('');
  const [distributionType, setDistributionType] = useState<'equal' | 'custom'>('equal');
  const [selectedDays, setSelectedDays] = useState<string[]>(['monday', 'tuesday', 'wednesday', 'thursday', 'friday']);
  const [dailyDistribution, setDailyDistribution] = useState<{ [key: string]: number }>({});

  const days = [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
  ];

  useEffect(() => {
    if (visible) {
      if (goal) {
        // Editing existing goal
        setSelectedSubject(goal.subject);
        setWeeklyHours(goal.weeklyHours.toString());
        setDailyDistribution(goal.dailyDistribution || {});
        
        // Determine distribution type and selected days
        const activeDays = Object.keys(goal.dailyDistribution || {}).filter(
          day => goal.dailyDistribution[day] > 0
        );
        setSelectedDays(activeDays);
        
        // Check if it's equal distribution
        const uniqueHours = new Set(Object.values(goal.dailyDistribution || {}));
        setDistributionType(uniqueHours.size <= 1 ? 'equal' : 'custom');
      } else {
        // Creating new goal
        resetForm();
      }
    }
  }, [visible, goal]);

  const resetForm = () => {
    setSelectedSubject('');
    setWeeklyHours('');
    setDistributionType('equal');
    setSelectedDays(['monday', 'tuesday', 'wednesday', 'thursday', 'friday']);
    setDailyDistribution({});
  };

  const toggleDay = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const updateDailyHours = (day: string, hours: string) => {
    const hoursValue = parseFloat(hours) || 0;
    setDailyDistribution(prev => ({
      ...prev,
      [day]: hoursValue
    }));
  };

  const calculateDistribution = () => {
    const totalHours = parseFloat(weeklyHours) || 0;
    
    if (distributionType === 'equal') {
      const hoursPerDay = selectedDays.length > 0 ? totalHours / selectedDays.length : 0;
      const distribution: { [key: string]: number } = {};
      
      days.forEach(day => {
        distribution[day] = selectedDays.includes(day) ? hoursPerDay : 0;
      });
      
      return distribution;
    } else {
      // Custom distribution
      const distribution: { [key: string]: number } = {};
      days.forEach(day => {
        distribution[day] = selectedDays.includes(day) ? (dailyDistribution[day] || 0) : 0;
      });
      return distribution;
    }
  };

  const getWeekStart = () => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    return weekStart.toISOString();
  };

  const handleSave = () => {
    if (!selectedSubject) {
      Alert.alert('Error', 'Please select a subject');
      return;
    }

    const totalHours = parseFloat(weeklyHours);
    if (!totalHours || totalHours <= 0) {
      Alert.alert('Error', 'Please enter valid weekly hours');
      return;
    }

    if (selectedDays.length === 0) {
      Alert.alert('Error', 'Please select at least one study day');
      return;
    }

    const distribution = calculateDistribution();
    
    if (distributionType === 'custom') {
      const totalCustomHours = Object.values(distribution).reduce((sum, hours) => sum + hours, 0);
      if (Math.abs(totalCustomHours - totalHours) > 0.1) {
        Alert.alert('Error', `Custom distribution hours (${totalCustomHours.toFixed(1)}) don't match weekly target (${totalHours})`);
        return;
      }
    }

    onSave({
      subject: selectedSubject,
      weeklyHours: totalHours,
      weekStart: getWeekStart(),
      dailyDistribution: distribution,
    });
  };

  const currentDistribution = calculateDistribution();
  const totalDistributedHours = Object.values(currentDistribution).reduce((sum, hours) => sum + hours, 0);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <BlurView intensity={20} style={styles.backdrop} />
        
        <View style={styles.container}>
          <BlurView intensity={30} style={styles.modal}>
            <LinearGradient
              colors={theme.gradient}
              style={styles.gradient}
            />
            
            <View style={styles.header}>
              <Text style={styles.title}>
                {goal ? 'Edital meta' : 'Criar meta semanal'}
              </Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <X size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Target size={20} color={theme.primary} />
                  <Text style={styles.sectionTitle}>Disciplina</Text>
                </View>
                <View style={styles.subjectGrid}>
                  {subjects.map(subject => (
                    <TouchableOpacity
                      key={subject.id}
                      style={[
                        styles.subjectButton,
                        selectedSubject === subject.name && styles.subjectButtonActive
                      ]}
                      onPress={() => setSelectedSubject(subject.name)}
                    >
                      <Text style={[
                        styles.subjectButtonText,
                        selectedSubject === subject.name && styles.subjectButtonTextActive
                      ]}>
                        {subject.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Clock size={20} color={theme.primary} />
                  <Text style={styles.sectionTitle}>Horas</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="10"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={weeklyHours}
                  onChangeText={setWeeklyHours}
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Calendar size={20} color={theme.primary} />
                  <Text style={styles.sectionTitle}>Dias</Text>
                </View>
                <View style={styles.daysGrid}>
                  {days.map(day => (
                    <TouchableOpacity
                      key={day}
                      style={[
                        styles.dayButton,
                        selectedDays.includes(day) && styles.dayButtonActive
                      ]}
                      onPress={() => toggleDay(day)}
                    >
                      <Text style={[
                        styles.dayButtonText,
                        selectedDays.includes(day) && styles.dayButtonTextActive
                      ]}>
                        {day.slice(0, 3).toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Método de distribuição</Text>
                <View style={styles.distributionButtons}>
                  <TouchableOpacity
                    style={[
                      styles.distributionButton,
                      distributionType === 'equal' && styles.distributionButtonActive
                    ]}
                    onPress={() => setDistributionType('equal')}
                  >
                    <Text style={[
                      styles.distributionButtonText,
                      distributionType === 'equal' && styles.distributionButtonTextActive
                    ]}>
                      Igual
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.distributionButton,
                      distributionType === 'custom' && styles.distributionButtonActive
                    ]}
                    onPress={() => setDistributionType('custom')}
                  >
                    <Text style={[
                      styles.distributionButtonText,
                      distributionType === 'custom' && styles.distributionButtonTextActive
                    ]}>
                      Customizável
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {distributionType === 'custom' && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Horas diárias</Text>
                  {selectedDays.map(day => (
                    <View key={day} style={styles.customDayRow}>
                      <Text style={styles.customDayLabel}>
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </Text>
                      <TextInput
                        style={styles.customDayInput}
                        placeholder="0"
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        value={dailyDistribution[day]?.toString() || ''}
                        onChangeText={(value) => updateDailyHours(day, value)}
                        keyboardType="decimal-pad"
                      />
                    </View>
                  ))}
                  <Text style={styles.distributionSummary}>
                    Total: {totalDistributedHours.toFixed(1)}h / {weeklyHours || 0}h
                  </Text>
                </View>
              )}

              {distributionType === 'equal' && selectedDays.length > 0 && weeklyHours && (
                <View style={styles.distributionPreview}>
                  <Text style={styles.previewTitle}>Ficará:</Text>
                  <Text style={styles.previewText}>
                    {(parseFloat(weeklyHours) / selectedDays.length).toFixed(1)} horas por dia
                    ({selectedDays.length} dias selecionados)
                  </Text>
                </View>
              )}
            </ScrollView>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>
                  {goal ? 'Modificar' : 'Criar'} Meta
                </Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    width: '90%',
    maxWidth: 400,
    maxHeight: '90%',
  },
  modal: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
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
    alignItems: 'center',
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 24,
    maxHeight: 500,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  subjectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
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
      color: '#323335',  
    // Removed - now applied inline with theme.primary
  },
  subjectButtonText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '600',
  },
  subjectButtonTextActive: {
    color: '#323335',
    // Removed - now applied inline with theme.primary
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#fff',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayButtonActive: {
        color: '#323335',
    // Removed - now applied inline with theme.primary
  },
  dayButtonText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '600',
  },
  dayButtonTextActive: {
        color: '#323335',
    // Removed - now applied inline with theme.primary
  },
  distributionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  distributionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  distributionButtonActive: {
    // Removed - now applied inline with theme.primary
  },
  distributionButtonText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '600',
  },
  distributionButtonTextActive: {
    // Removed - now applied inline with theme.primary
  },
  customDayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  customDayLabel: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
  },
  customDayInput: {
    width: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  distributionSummary: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginTop: 12,
  },
  distributionPreview: {
    backgroundColor: 'rgba(139, 95, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  previewText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  actions: {
    flexDirection: 'row',
    padding: 24,
    paddingTop: 16,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});