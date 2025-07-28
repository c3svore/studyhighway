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
import { X, Clock, BookOpen, Target } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeContent';

interface QuickAddModalProps {
  visible: boolean;
  goal: any;
  subjects: any[];
  onClose: () => void;
  onSave: (data: any) => void;
}

export function QuickAddModal({ visible, goal, subjects, onClose, onSave }: QuickAddModalProps) {
  const { theme } = useTheme();
  const [selectedTopic, setSelectedTopic] = useState('');
  const [hoursStudied, setHoursStudied] = useState('');
  const [questionsAttempted, setQuestionsAttempted] = useState('');
  const [questionsCorrect, setQuestionsCorrect] = useState('');

  useEffect(() => {
    if (visible && goal) {
      // Reset form when modal opens
      setSelectedTopic('');
      setHoursStudied('');
      setQuestionsAttempted('');
      setQuestionsCorrect('');
    }
  }, [visible, goal]);

  const handleSave = () => {
    if (!selectedTopic) {
      Alert.alert('Error', 'Please select a topic');
      return;
    }

    const hours = parseFloat(hoursStudied) || 0;
    const questions = parseInt(questionsAttempted) || 0;
    const correct = parseInt(questionsCorrect) || 0;

    if (hours < 0 || questions < 0 || correct < 0) {
      Alert.alert('Error', 'Please enter valid values');
      return;
    }

    if (correct > questions) {
      Alert.alert('Error', 'Correct answers cannot exceed attempted questions');
      return;
    }

    onSave({
      topic: selectedTopic,
      hoursStudied: hours,
      questionsAttempted: questions,
      questionsCorrect: correct,
    });
  };

  if (!goal) return null;

  // Find the subject data to get topics
  const subjectData = subjects.find(s => s.name === goal.subject);
  const topics = subjectData?.topics || [];

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
              <Text style={styles.title}>Registrar desempenho</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <X size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <Text style={styles.subtitle}>{goal.subject}</Text>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <BookOpen size={20} color={theme.primary} />
                  <Text style={styles.sectionTitle}>Tópico</Text>
                </View>
                <View style={styles.topicGrid}>
                  {topics.map((topic: any) => (
                    <TouchableOpacity
                      key={topic.id}
                      style={[
                        styles.topicButton,
                        selectedTopic === topic.name && styles.topicButtonActive
                      ]}
                      onPress={() => setSelectedTopic(topic.name)}
                    >
                      <Text style={[
                        styles.topicButtonText,
                        selectedTopic === topic.name && styles.topicButtonTextActive
                      ]}>
                        {topic.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Clock size={20} color={theme.primary} />
                  <Text style={styles.sectionTitle}>Tempo de estudo (horas)</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="0.5"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={hoursStudied}
                  onChangeText={setHoursStudied}
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <BookOpen size={20} color={theme.primary} />
                  <Text style={styles.sectionTitle}>Questões respondidas</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="10"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={questionsAttempted}
                  onChangeText={setQuestionsAttempted}
                  keyboardType="number-pad"
                />
              </View>

              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Target size={20} color={theme.primary} />
                  <Text style={styles.sectionTitle}>Questões corretas</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="8"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={questionsCorrect}
                  onChangeText={setQuestionsCorrect}
                  keyboardType="number-pad"
                />
              </View>
            </ScrollView>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Salvar registro</Text>
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
    maxHeight: '80%',
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
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  content: {
    paddingHorizontal: 24,
    maxHeight: 300,
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
  topicGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  topicButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  topicButtonActive: {
  },
  topicButtonText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '600',
  },
  topicButtonTextActive: {
    color: '#000000',
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