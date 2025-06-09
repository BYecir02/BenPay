import { View, StyleSheet, FlatList } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { MaterialIcons } from '@expo/vector-icons';

// Exemple de données simulées
const transactions = [
  {
    id: '1',
    date: '2024-06-09 10:15',
    produit: 'Pain',
    client: 'Alice',
    montant: 500,
    statut: 'Payé',
  },
  {
    id: '2',
    date: '2024-06-09 09:50',
    produit: 'T-shirt',
    client: 'Bob',
    montant: 3500,
    statut: 'En attente',
  },
  {
    id: '3',
    date: '2024-06-08 18:20',
    produit: 'Savon',
    client: 'Charles',
    montant: 400,
    statut: 'Payé',
  },
];

export default function TransactionsScreen() {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <ThemedText type="defaultSemiBold">{item.produit}</ThemedText>
        <ThemedText type="default" style={styles.client}>{item.client}</ThemedText>
        <ThemedText type="default">{item.date}</ThemedText>
        <ThemedText type="default" style={{ color: '#007AFF', fontWeight: 'bold' }}>
          {item.montant} FCFA
        </ThemedText>
      </View>
      <View style={styles.statusBox}>
        <MaterialIcons
          name={item.statut === 'Payé' ? 'check-circle' : 'hourglass-empty'}
          size={22}
          color={item.statut === 'Payé' ? '#27AE60' : '#F39C12'}
        />
        <ThemedText style={{
          color: item.statut === 'Payé' ? '#27AE60' : '#F39C12',
          marginLeft: 4,
          fontWeight: 'bold',
        }}>
          {item.statut}
        </ThemedText>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ThemedText type="title" style={{ marginBottom: 12 }}>Transactions</ThemedText>
      <FlatList
        data={transactions}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
        ListEmptyComponent={
          <ThemedText>Aucune transaction pour le moment.</ThemedText>
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
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  client: {
    fontSize: 13,
    color: '#888',
    marginBottom: 2,
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
});