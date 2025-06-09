import { View, StyleSheet, Button } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ThemedText type="title">Mon Profil</ThemedText>
      <ThemedText>Nom : Jean Dupont</ThemedText>
      <ThemedText>Email : jean.dupont@email.com</ThemedText>
      <Button title="Déconnexion" color="red" onPress={() => router.replace('/')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    padding: 24,
  },
});