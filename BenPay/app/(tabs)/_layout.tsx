import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF', // Couleur de l’onglet actif
        tabBarInactiveTintColor: '#888',  // Couleur des onglets inactifs
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#eee',
          height: 65,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons
              name="home"
              color={color}
              size={focused ? 32 : 26}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Produits',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons
              name="inventory"
              color={color}
              size={focused ? 32 : 26}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Transactions',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons
              name="receipt-long"
              color={color}
              size={focused ? 32 : 26}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="clients"
        options={{
          title: 'Clients',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons
              name="people"
              color={color}
              size={focused ? 32 : 26}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons
              name="person"
              color={color}
              size={focused ? 32 : 26}
            />
          ),
        }}
      />
    </Tabs>
  );
}