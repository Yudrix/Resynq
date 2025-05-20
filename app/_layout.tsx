import '../global.css';
import { AuthProvider, useAuth } from '../context/auth';
import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(drawer)',
};

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  
  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inDrawerGroup = segments[0] === '(drawer)';
    const isRootPage = segments.length === 0 || (segments.length === 1 && segments[0] === '');

    console.log('Auth state:', { user: !!user, inAuthGroup, segments, path: segments.join('/') });

    if (!user) {
      if (inDrawerGroup) {
        router.replace('/');
      }
    } else {
      if (inAuthGroup || isRootPage) {
        router.replace('/(drawer)/(tabs)');
      }
    }
  }, [user, loading, segments]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#4299e1" />
      </View>
    );
  }
  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthProvider>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthGuard>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ title: 'Modal', presentation: 'modal' }} />
      </Stack>
      </AuthGuard>
    </GestureHandlerRootView>
    </AuthProvider>
  );
}
