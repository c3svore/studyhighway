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
import { X, BookOpen, Clock, TrendingUp, Target } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeContent';

interface PerformanceModalProps {
  visible: boolean;
  subjects: any[];
  onClose: () => void;
  onSave: (data: any) => void;
}

export function PerformanceModal({ visible, subjects, onClose, onSave }: PerformanceModalProps) {
  const { theme } = useTheme();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [hoursStudied, setHoursStudied] = useState('');
  const [questionsAttempted, setQuestionsAttempted] = useState('');
  const [questionsCorrect, setQuestionsCorrect] = useState('');
  const [showTopics, setShowTopics] = useState(false);

  useEffect(() => {
    if (visible) {
      // Reset form when modal opens
      setSelectedSubject('');
      setSelectedTopic('');
      setHoursStudied('');
      setQuestionsAttempted('');
      setQuestionsCorrect('');
      setShowTopics(false);
    }
  }, [visible]);

  const handleSubjectSelect = (subjectName: string) => {
    setSelectedSubject(subjectName);
    setSelectedTopic('');
    setShowTopics(true);
  };

  const handleTopicSelect = (topicName: string) => {
    setSelectedTopic(topicName);
    setShowTopics(false);
  };

  const handleSave = () => {
    if (!selectedSubject) {
      Alert.alert('Error', 'Please select a subject');
      return;
    }

    if (!selectedTopic) {
      Alert.alert('Error', 'Please select a topic');
      return;
    }

    const hours = parseFloat(hoursStudied) || 0;
    const attempted = parseInt(questionsAttempted) || 0;
    const correct = parseInt(questionsCorrect) || 0;

    if (hours < 0 || attempted < 0 || correct < 0) {
      Alert.alert('Error', 'Please enter valid positive values');
      return;
    }

    if (correct > attempted) {
      Alert.alert('Error', 'Correct answers cannot exceed attempted questions');
      return;
    }

    onSave({
      subject: selectedSubject,
      topic: selectedTopic,
      hoursStudied: hours,
      questionsAttempted: attempted,
      questionsCorrect: correct,
    });
  };

  const selectedSubjectData = subjects.find(s => s.name === selectedSubject);

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

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <BookOpen size={20} color={theme.primary} />
                  <Text style={styles.sectionTitle}>
                    {!showTopics ? 'Selecione a disciplina' : `Selecione o tópico para ${selectedSubject}`}
                  </Text>
                </View>
                
                {!showTopics ? (
                  <View style={styles.optionsGrid}>
                    {subjects.length === 0 ? (
                      <Text style={styles.noDataText}>
                        Sem tópicos. Adicione-os.
                      </Text>
                    ) : (
                      subjects.map(subject => (
                        <TouchableOpacity
                          key={subject.id}
                          style={[
                            styles.optionButton,
                            selectedSubject === subject.name && styles.optionButtonActive
                          ]}
                          onPress={() => handleSubjectSelect(subject.name)}
                        >
                          <Text style={[
                            styles.optionButtonText,
                            selectedSubject === subject.name && styles.optionButtonTextActive
                          ]}>
                            {subject.name}
                          </Text>
                        </TouchableOpacity>
                      ))
                    )}
                  </View>
                ) : (
                  <>
                    <TouchableOpacity
                      style={styles.backButton}
                      onPress={() => setShowTopics(false)}
                    >
                      <Text style={[styles.backButtonText, { color: theme.primary }]}>← Voltar para as disciplinas</Text>
                    </TouchableOpacity>
                    <View style={styles.optionsGrid}>
                      {selectedSubjectData?.topics.map((topic: any) => (
                        <TouchableOpacity
                          key={topic.id}
                          style={[
                            styles.optionButton,
                            selectedTopic === topic.name && styles.optionButtonActive
                          ]}
                          onPress={() => handleTopicSelect(topic.name)}
                        >
                          <Text style={[
                            styles.optionButtonText,
                            selectedTopic === topic.name && styles.optionButtonTextActive
                          ]}>
                            {topic.name}
                          </Text>
                        </TouchableOpacity>
                      )) || []}
                    </View>
                  </>
                )}
              </View>

              {selectedTopic && (
                <>
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Clock size={20} color={theme.primary} />
                      <Text style={styles.sectionTitle}>Tempo de estudo (horas) - Opcional</Text>
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
                      <Target size={20} color={theme.primary} />
                      <Text style={styles.sectionTitle}>Questões realizadas</Text>
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
                      <TrendingUp size={20} color={theme.primary} />
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
                </>
              )}
            </ScrollView>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.saveButton, !selectedTopic && styles.saveButtonDisabled]} 
                onPress={handleSave}
                disabled={!selectedTopic}
              >
                <Text style={styles.saveButtonText}>Salvar desempenho</Text>
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
    maxHeight: '85%',
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
    maxHeight: 400,
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
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  optionButtonActive: {
  },
  optionButtonText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '600',
  },
  optionButtonTextActive: {
    color: '#000000',
  },
  backButton: {
    paddingVertical: 8,
    marginBottom: 12,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  noDataText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
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
  saveButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});