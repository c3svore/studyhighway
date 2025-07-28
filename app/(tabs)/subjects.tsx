import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Plus, Search, ListFilter as Filter, CreditCard as Edit3, Trash2, ChartBar as BarChart3, Grid2x2 as Grid } from 'lucide-react-native';
import { useDataStore } from '@/hooks/useDataStore';
import { useTheme } from '@/components/ThemeContent';
import { SubjectCard } from '@/components/SubjectCard';
import { AddSubjectModal } from '@/components/AddSubjectModal';
import { OverviewModal } from '@/components/OverviewModal';

export default function SubjectsScreen() {
  const { subjects, addSubject, updateSubject, deleteSubject } = useDataStore();
  const { theme } = useTheme();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showOverview, setShowOverview] = useState(false);

  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.topics.some((topic: any) => topic.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = filterPriority === 'todas' || subject.priority === filterPriority;
    
    return matchesSearch && matchesFilter;
  });

  const handleAddSubject = (subjectData: any) => {
    if (editingSubject) {
      updateSubject(editingSubject.id, subjectData);
    } else {
      // Handle multiple subjects from the new format
      if (Array.isArray(subjectData)) {
        subjectData.forEach(subject => addSubject(subject));
      } else {
        addSubject(subjectData);
      }
    }
    setShowAddModal(false);
    setEditingSubject(null);
  };

  const handleEditSubject = (subject: any) => {
    setEditingSubject(subject);
    setShowAddModal(true);
  };

  const handleDeleteSubject = (subjectId: string) => {
    Alert.alert(
      'Excluir Disciplina',
      'Tem certeza que deseja excluir? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => deleteSubject(subjectId)
        }
      ]
    );
  };

  const priorities = [
    { key: 'todas', label: 'Todos', color: theme.primary },
    { key: 'alta', label: 'Alta', color: '#FF4757' },
    { key: 'média', label: 'Média', color: '#FFA726' },
    { key: 'baixa', label: 'Baixa', color: '#66BB6A' },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000000', '#111111', '#000000']}
        style={styles.background}
      />
      
      <View style={styles.header}>
        <BlurView intensity={20} style={styles.headerContent}>
          <Text style={styles.title}>Disciplinas e Tópicos</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => setShowOverview(true)}
            >
              <Grid size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddModal(true)}
            >
              <Plus size={24} color="#fff" style={{ backgroundColor: theme.primary }} />
            </TouchableOpacity>
          </View>
        </BlurView>

        <BlurView intensity={15} style={styles.searchContainer}>
          <Search size={20} color="rgba(255, 255, 255, 0.6)" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar disciplinas ou tópicos..."
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </BlurView>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
        >
          {priorities.map(priority => (
            <TouchableOpacity
              key={priority.key}
              style={[
                styles.filterButton,
                filterPriority === priority.key && { backgroundColor: priority.color }
              ]}
              onPress={() => setFilterPriority(priority.key)}
            >
              <Text style={[
                styles.filterText,
                filterPriority === priority.key && { color: '#fff' }
              ]}>
                {priority.label}
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
        {filteredSubjects.length === 0 ? (
          <BlurView intensity={15} style={styles.emptyState}>
            <Text style={styles.emptyTitle}>
              {searchQuery || filterPriority !== 'todas' ? 'Nenhum resultado' : 'Nenhuma disciplina'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery || filterPriority !== 'todas'
                ? 'Tente ajustar sua busca'
                : 'Adicione sua primeira disciplina'
              }
            </Text>
          </BlurView>
        ) : (
          filteredSubjects.map(subject => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              onEdit={() => handleEditSubject(subject)}
              onDelete={() => handleDeleteSubject(subject.id)}
            />
          ))
        )}
      </ScrollView>

      <AddSubjectModal
        visible={showAddModal}
        subject={editingSubject}
        onClose={() => {
          setShowAddModal(false);
          setEditingSubject(null);
        }}
        onSave={handleAddSubject}
      />

      <OverviewModal
        visible={showOverview}
        subjects={subjects}
        onClose={() => setShowOverview(false)}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  filterContainer: {
    marginBottom: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  filterText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
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
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: 20,
  },
});