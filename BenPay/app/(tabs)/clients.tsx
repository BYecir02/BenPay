import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { MaterialIcons } from '@expo/vector-icons';

// Exemple de clients simulés
const clients = [
  { id: '1', nom: 'Alice', email: 'alice@email.com', points: 12, achats: 5 },
  { id: '2', nom: 'Bob', email: 'bob@email.com', points: 7, achats: 2 },
  { id: '3', nom: 'Charles', email: 'charles@email.com', points: 20, achats: 9 },
];

export default function ClientsScreen() {
  const renderItem = ({ item }) => (
    <View style={styles.clientCard}>
      <View style={{ flex: 1 }}>
        <ThemedText type="defaultSemiBold">{item.nom}</ThemedText>
        <ThemedText type="default" style={styles.email}>{item.email}</ThemedText>
        <ThemedText type="default">Points fidélité : {item.points}</ThemedText>
        <ThemedText type="default">Achats : {item.achats}</ThemedText>
      </View>
      <TouchableOpacity style={styles.editBtn} onPress={() => { /* ouvrir l’édition */ }}>
        <MaterialIcons name="edit" size={22} color="#007AFF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <ThemedText type="title">Clients</ThemedText>
        <TouchableOpacity style={styles.addBtn} onPress={() => { /* ouvrir l’ajout */ }}>
          <MaterialIcons name="person-add" size={28} color="#27AE60" />
          <ThemedText style={{ color: '#27AE60', marginLeft: 4 }}>Ajouter</ThemedText>
        </TouchableOpacity>
      </View>
      <FlatList
        data={clients}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
        ListEmptyComponent={
          <ThemedText>Aucun client pour le moment.</ThemedText>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F8F0',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  clientCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  email: {
    fontSize: 13,
    color: '#888',
    marginBottom: 2,
  },
  editBtn: {
    marginLeft: 12,
    padding: 4,
  },
});