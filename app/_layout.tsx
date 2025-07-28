import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useTheme, ThemeProvider } from '@/components/ThemeContent';
import { DataStoreProvider } from '@/hooks/useDataStore';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <ThemeProvider>
      <DataStoreProvider>
        <>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </>
      </DataStoreProvider>
    </ThemeProvider>
  );
}
