import { useState } from 'react';
import { StyleSheet, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    // Logique de connexion à compléter (API, validation, etc.)
    Alert.alert('Connexion', `Téléphone: ${phone}\nMot de passe: ${password}`);
    router.replace('/(tabs)');
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Connexion</ThemedText>
      <TextInput
        style={styles.input}
        placeholder="Numéro de téléphone"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        maxLength={15}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Se connecter" onPress={handleLogin} />

      {/* Lien vers l'inscription */}
      <TouchableOpacity onPress={() => router.replace('/auth/register')}>
        <ThemedText type="link" style={{ marginTop: 16, textAlign: 'center' }}>
          Pas encore de compte ? S'inscrire
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    gap: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
});