import { View, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();

  const handleLogout = () => {
    // Ici tu peux aussi effacer le token si besoin
    router.replace('/auth/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarBox}>
        <MaterialIcons name="person" size={64} color="#007AFF" />
      </View>
      <ThemedText type="title" style={{ marginBottom: 8 }}>Jean Dupont</ThemedText>
      <ThemedText type="default" style={styles.info}>Email : jean.dupont@email.com</ThemedText>
      <ThemedText type="default" style={styles.info}>Rôle : Commerçant</ThemedText>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => {/* Naviguer vers l’aide */}}>
          <MaterialIcons name="help-outline" size={22} color="#007AFF" />
          <ThemedText style={styles.actionText}>Aide & Support</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => {/* Naviguer vers paramètres */}}>
          <MaterialIcons name="settings" size={22} color="#007AFF" />
          <ThemedText style={styles.actionText}>Paramètres</ThemedText>
        </TouchableOpacity>
      </View>

      <Button title="Déconnexion" color="red" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#F9FAFB',
  },
  avatarBox: {
    backgroundColor: '#EAF6FF',
    borderRadius: 50,
    padding: 16,
    marginBottom: 16,
  },
  info: {
    marginBottom: 4,
    color: '#444',
  },
  actions: {
    width: '100%',
    marginVertical: 24,
    gap: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    marginBottom: 8,
  },
  actionText: {
    marginLeft: 10,
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 16,
  },
});