import { StyleSheet, Button, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';

export default function HomeScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <ThemedText type="title">Bienvenue sur BenPay</ThemedText>
      <Button title="S'inscrire" onPress={() => router.push('/auth/register')} />
      <Button title="Se connecter" onPress={() => router.push('/auth/login')} />
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