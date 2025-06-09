import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

export default function ClientsScreen() {
  return (
    <View style={styles.container}>
      <ThemedText type="title">Clients</ThemedText>
      <ThemedText>Liste de vos clients à venir...</ThemedText>
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