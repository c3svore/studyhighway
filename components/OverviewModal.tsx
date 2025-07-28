import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { X, Settings, Grid2x2 as Grid, ChartBar as BarChart3 } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeContent';

interface OverviewModalProps {
  visible: boolean;
  subjects: any[];
  onClose: () => void;
}

export function OverviewModal({ visible, subjects, onClose }: OverviewModalProps) {
  const { theme } = useTheme();
  const [showSettings, setShowSettings] = useState(false);
  const [redThreshold, setRedThreshold] = useState('40');
  const [yellowThreshold, setYellowThreshold] = useState('70');

  const getPerformanceColor = (successRate: number) => {
    const red = parseInt(redThreshold) || 40;
    const yellow = parseInt(yellowThreshold) || 70;
    
    if (successRate < red) return '#FF4757';
    if (successRate < yellow) return '#FFA726';
    return '#66BB6A';
  };

  const getPerformanceLabel = (successRate: number) => {
    const red = parseInt(redThreshold) || 40;
    const yellow = parseInt(yellowThreshold) || 70;
    
    if (successRate < red) return 'Baixo';
    if (successRate < yellow) return 'Médio';
    return 'Alto';
  };

  const handleSaveSettings = () => {
    const red = parseInt(redThreshold);
    const yellow = parseInt(yellowThreshold);
    
    if (red >= yellow) {
      Alert.alert('Erro', 'O limite vermelho deve ser menor que o amarelo');
      return;
    }
    
    if (red < 0 || red > 100 || yellow < 0 || yellow > 100) {
      Alert.alert('Erro', 'Os valores devem estar entre 0 e 100');
      return;
    }
    
    setShowSettings(false);
  };

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
              <Text style={styles.title}>Visão Geral</Text>
              <View style={styles.headerButtons}>
                <TouchableOpacity
                  style={styles.settingsButton}
                  onPress={() => setShowSettings(!showSettings)}
                >
                  <Settings size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <X size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            {showSettings && (
              <View style={styles.settingsPanel}>
                <Text style={styles.settingsTitle}>Configurar Cores de Performance</Text>
                <View style={styles.settingsRow}>
                  <View style={styles.colorIndicator}>
                    <View style={[styles.colorDot, { backgroundColor: '#FF4757' }]} />
                    <Text style={styles.colorLabel}>Vermelho (0 - </Text>
                    <TextInput
                      style={styles.thresholdInput}
                      value={redThreshold}
                      onChangeText={setRedThreshold}
                      keyboardType="number-pad"
                      maxLength={3}
                    />
                    <Text style={styles.colorLabel}>%)</Text>
                  </View>
                </View>
                <View style={styles.settingsRow}>
                  <View style={styles.colorIndicator}>
                    <View style={[styles.colorDot, { backgroundColor: '#FFA726' }]} />
                    <Text style={styles.colorLabel}>Amarelo (</Text>
                    <Text style={styles.colorLabel}>{redThreshold} - </Text>
                    <TextInput
                      style={styles.thresholdInput}
                      value={yellowThreshold}
                      onChangeText={setYellowThreshold}
                      keyboardType="number-pad"
                      maxLength={3}
                    />
                    <Text style={styles.colorLabel}>%)</Text>
                  </View>
                </View>
                <View style={styles.settingsRow}>
                  <View style={styles.colorIndicator}>
                    <View style={[styles.colorDot, { backgroundColor: '#66BB6A' }]} />
                    <Text style={styles.colorLabel}>Verde ({yellowThreshold} - 100%)</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveSettings}>
                  <Text style={styles.saveButtonText}>Salvar Configurações</Text>
                </TouchableOpacity>
              </View>
            )}

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              {subjects.length === 0 ? (
                <View style={styles.emptyState}>
                  <Grid size={48} color="rgba(255, 255, 255, 0.3)" />
                  <Text style={styles.emptyTitle}>Nenhuma disciplina</Text>
                  <Text style={styles.emptySubtitle}>
                    Adicione disciplinas para ver a visão geral
                  </Text>
                </View>
              ) : (
                subjects.map(subject => {
                  const overallSuccessRate = subject.questionsAttempted > 0 
                    ? Math.round((subject.questionsCorrect / subject.questionsAttempted) * 100)
                    : 0;

                  return (
                    <View key={subject.id} style={styles.subjectSection}>
                      <View style={styles.subjectHeader}>
                        <Text style={styles.subjectName}>{subject.name}</Text>
                        <View style={styles.subjectStats}>
                          <View style={[
                            styles.performanceBadge,
                            { backgroundColor: getPerformanceColor(overallSuccessRate) }
                          ]}>
                            <Text style={styles.performanceBadgeText}>
                              {getPerformanceLabel(overallSuccessRate)}
                            </Text>
                          </View>
                          <Text style={styles.subjectPercentage}>{overallSuccessRate}%</Text>
                        </View>
                      </View>
                      
                      <View style={styles.topicsGrid}>
                        {subject.topics.map((topic: any) => {
                          // For now, we'll use the subject's overall performance for each topic
                          // In a real app, you'd track performance per topic
                          const topicSuccessRate = overallSuccessRate;
                          
                          return (
                            <View key={topic.id} style={styles.topicCard}>
                              <View style={[
                                styles.topicColorBar,
                                { backgroundColor: getPerformanceColor(topicSuccessRate) }
                              ]} />
                              <View style={styles.topicContent}>
                                <Text style={styles.topicName} numberOfLines={2}>
                                  {topic.name}
                                </Text>
                                <View style={styles.topicStats}>
                                  <BarChart3 size={12} color="rgba(255, 255, 255, 0.6)" />
                                  <Text style={styles.topicPercentage}>
                                    {topicSuccessRate}%
                                  </Text>
                                </View>
                              </View>
                            </View>
                          );
                        })}
                      </View>
                    </View>
                  );
                })
              )}
            </ScrollView>
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
    width: '95%',
    maxWidth: 500,
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
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsPanel: {
    padding: 20,
    paddingTop: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 16,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  settingsRow: {
    marginBottom: 12,
  },
  colorIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  colorLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  thresholdInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 14,
    color: '#fff',
    width: 40,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 24,
    maxHeight: 500,
  },
  emptyState: {
    padding: 40,
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
  },
  subjectSection: {
    marginBottom: 32,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  subjectName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  subjectStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  performanceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  performanceBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  subjectPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  topicCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  topicColorBar: {
    height: 4,
    width: '100%',
  },
  topicContent: {
    padding: 12,
  },
  topicName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
    minHeight: 32,
  },
  topicStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topicPercentage: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
});