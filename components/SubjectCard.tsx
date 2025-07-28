import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { CreditCard as Edit3, Trash2, ChevronDown, ChevronUp } from 'lucide-react-native';

interface SubjectCardProps {
  subject: any;
  onEdit: () => void;
  onDelete: () => void;
}

export function SubjectCard({ subject, onEdit, onDelete }: SubjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const priorityColors = {
    alta: '#FF4757',
    média: '#FFA726',
    baixa: '#66BB6A',
  };

  const priorityColor = priorityColors[subject.priority];

  return (
    <BlurView intensity={15} style={styles.card}>
      <LinearGradient
        colors={[`${priorityColor}20`, `${priorityColor}05`]}
        style={styles.gradient}
      />
      
      <TouchableOpacity 
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <View style={[styles.priorityDot, { backgroundColor: priorityColor }]} />
          <View>
            <Text style={styles.subjectName}>{subject.name}</Text>
            <Text style={styles.subjectMeta}>
              {subject.topics.length} tópicos • prioridade {subject.priority}
            </Text>
          </View>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
            <Edit3 size={18} color="rgba(255, 255, 255, 0.7)" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
            <Trash2 size={18} color="#FF4757" />
          </TouchableOpacity>
          {isExpanded ? (
            <ChevronUp size={20} color="rgba(255, 255, 255, 0.6)" />
          ) : (
            <ChevronDown size={20} color="rgba(255, 255, 255, 0.6)" />
          )}
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.content}>
          <Text style={styles.topicsTitle}>Tópicos:</Text>
          <View style={styles.topicsGrid}>
            {subject.topics.map((topic: any) => (
              <View key={topic.id} style={styles.topicChip}>
                <Text style={styles.topicText}>{topic.name}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 16,
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
    padding: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 16,
  },
  subjectName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subjectMeta: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  topicsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 12,
    marginTop: 16,
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  topicChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  topicText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
});