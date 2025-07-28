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
import { X, BookOpen, Info } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeContent';

interface AddSubjectModalProps {
  visible: boolean;
  subject?: any;
  onClose: () => void;
  onSave: (data: any) => void;
}

export function AddSubjectModal({ visible, subject, onClose, onSave }: AddSubjectModalProps) {
  const { theme } = useTheme();
  const [inputText, setInputText] = useState('');
  const [priority, setPriority] = useState<'alta' | 'média' | 'baixa'>('média');

  useEffect(() => {
    if (visible) {
      if (subject) {
        // Editing existing subject
        const subjectText = `${subject.name}:${subject.topics.map((t: any) => t.name).join(',')}`;
        setInputText(subjectText);
        setPriority(subject.priority);
      } else {
        // Creating new subject
        setInputText('');
        setPriority('média');
      }
    }
  }, [visible, subject]);

  const parseSubjects = (text: string) => {
    const subjects: Array<{ name: string; topics: Array<{ id: string; name: string }> }> = [];
    
    // Split by semicolon to get each subject
    const subjectParts = text.split(';').filter(part => part.trim());
    
    subjectParts.forEach(part => {
      const [subjectName, topicsStr] = part.split(':');
      if (subjectName && subjectName.trim()) {
        const topics = topicsStr 
          ? topicsStr.split(',').filter(t => t.trim()).map(topicName => ({
              id: Date.now().toString() + Math.random().toString(),
              name: topicName.trim()
            }))
          : [];
        
        subjects.push({
          name: subjectName.trim(),
          topics
        });
      }
    });
    
    return subjects;
  };

  const handleSave = () => {
    if (!inputText.trim()) {
      Alert.alert('Error', 'Please enter subject(s) and topic(s)');
      return;
    }

    const parsedSubjects = parseSubjects(inputText);
    
    if (parsedSubjects.length === 0) {
      Alert.alert('Error', 'Please enter at least one subject with topics');
      return;
    }

    // If editing, save single subject, if creating new, save all parsed subjects
    if (subject) {
      if (parsedSubjects.length > 1) {
        Alert.alert('Error', 'When editing, please enter only one subject');
        return;
      }
      onSave({
        ...parsedSubjects[0],
        priority,
      });
    } else {
      // Save multiple subjects
      parsedSubjects.forEach(subjectData => {
        onSave({
          ...subjectData,
          priority,
        });
      });
    }
  };

  const priorities = [
    { key: 'alta', label: 'Alta', color: '#FF4757' },
    { key: 'média', label: 'Média', color: '#FFA726' },
    { key: 'baixa', label: 'Baixa', color: '#66BB6A' },
  ];

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
                {subject ? 'Editar disciplina' : 'Adicionar disciplina'}
              </Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <X size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Disciplinas e Tópicos</Text>
                  <TouchableOpacity style={styles.infoButton}>
                    <Info size={16} color="rgba(255, 255, 255, 0.6)" />
                  </TouchableOpacity>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Cole aqui"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={inputText}
                  onChangeText={setInputText}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
                <Text style={styles.formatHint}>
                  Formato: Disciplina:tópico,tópico;;
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Nível de prioridade</Text>
                <View style={styles.priorityGrid}>
                  {priorities.map(priorityOption => (
                    <TouchableOpacity
                      key={priorityOption.key}
                      style={[
                        styles.priorityButton,
                        priority === priorityOption.key && {
                          backgroundColor: priorityOption.color,
                          borderColor: priorityOption.color,
                        }
                      ]}
                      onPress={() => setPriority(priorityOption.key as any)}
                    >
                      <Text style={[
                        styles.priorityButtonText,
                        priority === priorityOption.key && { color: '#fff' }
                      ]}>
                        {priorityOption.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>
                  {subject ? 'Update' : 'Create'} Subject
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
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  infoButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
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
  formatHint: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 8,
    fontStyle: 'italic',
  },
  priorityGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  priorityButtonText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '600',
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