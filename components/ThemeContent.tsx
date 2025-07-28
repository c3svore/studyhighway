import { useState, useEffect, createContext, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeType = 'default' | 'warm' | 'blue';

export interface Theme {
  primary: string;
  gradient: string[];
  gradientRgb: string;
}

const themes: Record<ThemeType, Theme> = {
  default: {
    primary: '#ffb6c1',
    gradient: ['rgba(212, 195, 250, 0.3)', 'rgba(212, 195, 250, 0.1)'],
    gradientRgb: '212, 195, 250',
  },
  warm: {
    primary: '#d4c3a4',
    gradient: ['rgba(210, 210, 196, 0.3)', 'rgba(210, 210, 196, 0.1)'],
    gradientRgb: '210, 210, 196',
  },
  blue: {
    primary: '#416598',
    gradient: ['rgba(87, 137, 175, 0.3)', 'rgba(87, 137, 175, 0.1)'],
    gradientRgb: '87, 137, 175',
  },
};

const THEME_STORAGE_KEY = '@studyhighway_theme';

interface ThemeContextType {
  currentTheme: ThemeType;
  theme: Theme;
  setTheme: (theme: ThemeType) => void;
  autoBackup: boolean;
  setAutoBackup: (enabled: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('default');
  const [autoBackup, setAutoBackupState] = useState(false);

  useEffect(() => {
    loadThemeSettings();
  }, []);

  const loadThemeSettings = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      const savedAutoBackup = await AsyncStorage.getItem('@studyhighway_auto_backup');
      
      if (savedTheme && themes[savedTheme as ThemeType]) {
        setCurrentTheme(savedTheme as ThemeType);
      }
      
      if (savedAutoBackup) {
        setAutoBackupState(JSON.parse(savedAutoBackup));
      }
    } catch (error) {
      console.error('Error loading theme settings:', error);
    }
  };

  const setTheme = async (theme: ThemeType) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
      setCurrentTheme(theme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const setAutoBackup = async (enabled: boolean) => {
    try {
      await AsyncStorage.setItem('@studyhighway_auto_backup', JSON.stringify(enabled));
      setAutoBackupState(enabled);
    } catch (error) {
      console.error('Error saving auto backup setting:', error);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        theme: themes[currentTheme],
        setTheme,
        autoBackup,
        setAutoBackup,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
