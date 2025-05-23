import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { TouchableOpacity, Text } from 'react-native';
import { useAuth } from '../../context/auth';

import { HeaderButton } from '../../components/HeaderButton';

function CustomDrawerContent(props) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />

      <TouchableOpacity
        style={{
          marginTop: 20,
          marginHorizontal: 16,
          backgroundColor: '#f87171',
          padding: 12,
          borderRadius: 8,
        }}
        onPress={handleLogout}>
          <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center'}}>
            Log Out
          </Text>
        </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

const DrawerLayout = () => {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props}/>}
      >
      <Drawer.Screen
        name="index"
        options={{
          headerTitle: 'Home',
          drawerLabel: 'Home',
          drawerIcon: ({ size, color }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="(tabs)"
        options={{
          headerTitle: 'Tabs',
          drawerLabel: 'Tabs',
          drawerIcon: ({ size, color }) => (
            <MaterialIcons name="border-bottom" size={size} color={color} />
          ),
          headerRight: () => (
            <Link href="/modal" asChild>
              <HeaderButton />
            </Link>
          ),
        }}
      />
    </Drawer>
  );
}

export default DrawerLayout;
