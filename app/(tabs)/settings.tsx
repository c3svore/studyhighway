import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Settings, Upload, Palette, Download, Shield } from 'lucide-react-native';
import { useDataStore } from '@/hooks/useDataStore';
import { useTheme } from '@/components/ThemeContent';

export default function SettingsScreen() {
  const { exportData } = useDataStore();
  const { currentTheme, theme, setTheme, autoBackup, setAutoBackup } = useTheme();

  const handleExportData = async () => {
    try {
      await exportData();
      Alert.alert('Success', 'Data exported successfully! Check your downloads or sharing options.');
    } catch (error) {
      Alert.alert('Error', 'Failed to export data. Please try again.');
    }
  };

  const themeOptions = [
    { key: 'default' as ThemeType, name: 'Rosa Padrão', color: '#ffb6c1' },
    { key: 'warm' as ThemeType, name: 'Bege Quente', color: '#d4c3a4' },
    { key: 'blue' as ThemeType, name: 'Azul Oceano', color: '#416598' },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000000', '#111111', '#000000']}
        style={styles.background}
      />
      
      <View style={styles.header}>
        <BlurView intensity={20} style={styles.headerContent}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Configurações</Text>
          </View>
          <Settings size={32} color={theme.primary} />
        </BlurView>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Theme Section */}
        <BlurView intensity={15} style={styles.section}>
          <LinearGradient
            colors={theme.gradient}
            style={styles.sectionGradient}
          />
          <View style={styles.sectionHeader}>
            <Palette size={24} color={theme.primary} />
            <Text style={styles.sectionTitle}>Tema do App</Text>
          </View>
          <View style={styles.themeOptions}>
            {themeOptions.map(option => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.themeOption,
                  currentTheme === option.key && {
                    borderColor: theme.primary,
                    backgroundColor: `${theme.primary}20`,
                  }
                ]}
                onPress={() => setTheme(option.key)}
              >
                <View style={[styles.themeColorPreview, { backgroundColor: option.color }]} />
                <Text style={[
                  styles.themeOptionText,
                  currentTheme === option.key && { color: theme.primary }
                ]}>
                  {option.name}
                </Text>
                {currentTheme === option.key && (
                  <View style={[styles.themeCheckmark, { backgroundColor: theme.primary }]}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </BlurView>

        {/* Backup Section */}
        <BlurView intensity={15} style={styles.section}>
          <LinearGradient
            colors={theme.gradient}
            style={styles.sectionGradient}
          />
          <View style={styles.sectionHeader}>
            <Shield size={24} color={theme.primary} />
            <Text style={styles.sectionTitle}>Backup de Dados</Text>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Download size={20} color="rgba(255, 255, 255, 0.8)" />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Backup Automático</Text>
                <Text style={styles.settingSubtitle}>
                  Backup automático semanal
                </Text>
              </View>
            </View>
            <Switch
              value={autoBackup}
              onValueChange={setAutoBackup}
              trackColor={{ false: 'rgba(255, 255, 255, 0.2)', true: `${theme.primary}80` }}
              thumbColor={autoBackup ? theme.primary : 'rgba(255, 255, 255, 0.8)'}
            />
          </View>

          <TouchableOpacity style={styles.actionButton} onPress={handleExportData}>
            <Upload size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Exportar Dados</Text>
          </TouchableOpacity>
        </BlurView>

        {/* App Info Section */}
        <BlurView intensity={15} style={styles.section}>
          <LinearGradient
            colors={theme.gradient}
            style={styles.sectionGradient}
          />
          <View style={styles.sectionHeader}>
            <Settings size={24} color={theme.primary} />
            <Text style={styles.sectionTitle}>Informações do App</Text>
          </View>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Versão</Text>
              <Text style={styles.infoValue}>1.1</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Tema</Text>
              <Text style={styles.infoValue}>
                {themeOptions.find(t => t.key === currentTheme)?.name}
              </Text>
            </View>
          </View>
        </BlurView>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  sectionGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 12,
  },
  sectionDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 20,
    lineHeight: 20,
  },
  themeOptions: {
    gap: 12,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  themeColorPreview: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 12,
  },
  themeOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
  },
  themeCheckmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});