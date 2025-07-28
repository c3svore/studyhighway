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
import { X, Clock, Coffee, Timer } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeContent';

interface TimerSettingsProps {
  visible: boolean;
  settings: {
    workDuration: number;
    shortBreak: number;
    longBreak: number;
    sessionsUntilLongBreak: number;
  };
  onClose: () => void;
  onSave: (settings: any) => void;
}

export function TimerSettings({ visible, settings, onClose, onSave }: TimerSettingsProps) {
  const { theme } = useTheme();
  const [workDuration, setWorkDuration] = useState('');
  const [shortBreak, setShortBreak] = useState('');
  const [longBreak, setLongBreak] = useState('');
  const [sessionsUntilLongBreak, setSessionsUntilLongBreak] = useState('');

  useEffect(() => {
    if (visible) {
      setWorkDuration(settings.workDuration.toString());
      setShortBreak(settings.shortBreak.toString());
      setLongBreak(settings.longBreak.toString());
      setSessionsUntilLongBreak(settings.sessionsUntilLongBreak.toString());
    }
  }, [visible, settings]);

  const handleSave = () => {
    const work = parseInt(workDuration);
    const short = parseInt(shortBreak);
    const long = parseInt(longBreak);
    const sessions = parseInt(sessionsUntilLongBreak);

    if (!work || work < 1 || work > 120) {
      Alert.alert('Error', 'Work duration must be between 1 and 120 minutes');
      return;
    }

    if (!short || short < 1 || short > 60) {
      Alert.alert('Error', 'Short break must be between 1 and 60 minutes');
      return;
    }

    if (!long || long < 1 || long > 120) {
      Alert.alert('Error', 'Long break must be between 1 and 120 minutes');
      return;
    }

    if (!sessions || sessions < 1 || sessions > 10) {
      Alert.alert('Error', 'Sessions until long break must be between 1 and 10');
      return;
    }

    onSave({
      workDuration: work,
      shortBreak: short,
      longBreak: long,
      sessionsUntilLongBreak: sessions,
    });
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
              <Text style={styles.title}>Configuracões do cronômetro</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <X size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Clock size={20} color={theme.primary} />
                  <Text style={styles.sectionTitle}>Estudo</Text>
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="25"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    value={workDuration}
                    onChangeText={setWorkDuration}
                    keyboardType="number-pad"
                    maxLength={3}
                  />
                  <Text style={styles.inputUnit}>minutos</Text>
                </View>
                <Text style={styles.inputHint}>Duração do estudo (1-120 minutos)</Text>
              </View>

              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Coffee size={20} color="#66BB6A" />
                  <Text style={styles.sectionTitle}>Pausa</Text>
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="5"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    value={shortBreak}
                    onChangeText={setShortBreak}
                    keyboardType="number-pad"
                    maxLength={2}
                  />
                  <Text style={styles.inputUnit}>minutos</Text>
                </View>
                <Text style={styles.inputHint}>Duração da pausa (1-60 minutos)</Text>
              </View>

              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Timer size={20} color="#FFA726" />
                  <Text style={styles.sectionTitle}>Descanso</Text>
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="15"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    value={longBreak}
                    onChangeText={setLongBreak}
                    keyboardType="number-pad"
                    maxLength={3}
                  />
                  <Text style={styles.inputUnit}>minutos</Text>
                </View>
                <Text style={styles.inputHint}>Duração do descanso (1-120 minutos)</Text>
              </View>

              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Clock size={20} color="#42A5F5" />
                  <Text style={styles.sectionTitle}>Sessões até o descanso</Text>
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="4"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    value={sessionsUntilLongBreak}
                    onChangeText={setSessionsUntilLongBreak}
                    keyboardType="number-pad"
                    maxLength={2}
                  />
                  <Text style={styles.inputUnit}>sessões</Text>
                </View>
                <Text style={styles.inputHint}>Quantidade de sessões até descanso (1-10)</Text>
              </View>

              <View style={styles.previewContainer}>
                <Text style={styles.previewTitle}>Configurações atuais</Text>
                <View style={[styles.previewGrid, { color: theme.primary }]}>
                  <View style={styles.previewItem}>
                    <Text style={styles.previewLabel}>Estudo</Text>
                    <Text style={styles.previewValue}>{workDuration || '25'}m</Text>
                  </View>
                  <View style={styles.previewItem}>
                    <Text style={styles.previewLabel}>Pausa</Text>
                    <Text style={styles.previewValue}>{shortBreak || '5'}m</Text>
                  </View>
                  <View style={styles.previewItem}>
                    <Text style={styles.previewLabel}>Descanso</Text>
                    <Text style={styles.previewValue}>{longBreak || '15'}m</Text>
                  </View>
                  <View style={styles.previewItem}>
                    <Text style={styles.previewLabel}>Ciclo</Text>
                    <Text style={styles.previewValue}>{sessionsUntilLongBreak || '4'} sessões</Text>
                  </View>
                </View>
              </View>
            </ScrollView>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Salvar configurações</Text>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  inputUnit: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    marginLeft: 8,
  },
  inputHint: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
  },
  previewContainer: {
    backgroundColor: 'rgba(139, 95, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  previewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  previewItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 4,
  },
  previewValue: {
    fontSize: 16,
    fontWeight: 'bold',
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