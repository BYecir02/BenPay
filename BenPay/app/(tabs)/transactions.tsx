import { View, StyleSheet, FlatList, TouchableOpacity, Modal } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';

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
  {
    id: '4',
    date: '2024-06-08 15:30',
    produit: 'Chaussures',
    client: 'Diana',
    montant: 12000,
    statut: 'Payé',
  },
  {
    id: '5',
    date: '2024-06-07 14:45',
    produit: 'Livre',
    client: 'Eve',
    montant: 2500,
    statut: 'En attente',
  },
];

const sortOptions = [
  { key: 'date-desc', label: 'Plus récent', icon: 'schedule' },
  { key: 'date-asc', label: 'Plus ancien', icon: 'history' },
  { key: 'amount-desc', label: 'Montant décroissant', icon: 'trending-down' },
  { key: 'amount-asc', label: 'Montant croissant', icon: 'trending-up' },
  { key: 'status-paid', label: 'Payé seulement', icon: 'check-circle' },
  { key: 'status-pending', label: 'En attente seulement', icon: 'hourglass-empty' },
];

export default function TransactionsScreen() {
  const [sortBy, setSortBy] = useState('date-desc');
  const [showSortModal, setShowSortModal] = useState(false);

  // Fonction de tri
  const getSortedTransactions = () => {
    let sorted = [...transactions];

    switch (sortBy) {
      case 'date-desc':
        return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
      case 'date-asc':
        return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
      case 'amount-desc':
        return sorted.sort((a, b) => b.montant - a.montant);
      case 'amount-asc':
        return sorted.sort((a, b) => a.montant - b.montant);
      case 'status-paid':
        return sorted.filter(t => t.statut === 'Payé');
      case 'status-pending':
        return sorted.filter(t => t.statut === 'En attente');
      default:
        return sorted;
    }
  };

  const getCurrentSortLabel = () => {
    return sortOptions.find(option => option.key === sortBy)?.label || 'Plus récent';
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <ThemedText type="defaultSemiBold">{item.produit}</ThemedText>
        <ThemedText type="default" style={styles.client}>{item.client}</ThemedText>
        <ThemedText type="default" style={styles.date}>{item.date}</ThemedText>
        <ThemedText type="default" style={styles.amount}>
          {item.montant.toLocaleString()} FCFA
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

  const renderSortOption = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.sortOption,
        sortBy === item.key && styles.selectedSortOption
      ]}
      onPress={() => {
        setSortBy(item.key);
        setShowSortModal(false);
      }}
    >
      <MaterialIcons 
        name={item.icon} 
        size={20} 
        color={sortBy === item.key ? '#007AFF' : '#666'} 
      />
      <ThemedText 
        style={[
          styles.sortOptionText,
          sortBy === item.key && { color: '#007AFF', fontWeight: '600' }
        ]}
      >
        {item.label}
      </ThemedText>
      {sortBy === item.key && (
        <MaterialIcons name="check" size={20} color="#007AFF" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header avec titre et bouton de tri */}
      <View style={styles.header}>
        <ThemedText type="title">Transactions</ThemedText>
        <TouchableOpacity 
          style={styles.sortButton}
          onPress={() => setShowSortModal(true)}
        >
          <MaterialIcons name="sort" size={20} color="#007AFF" />
          <ThemedText style={styles.sortButtonText}>
            {getCurrentSortLabel()}
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Stats rapides */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <ThemedText type="statValue">{getSortedTransactions().length}</ThemedText>
          <ThemedText type="statLabel">Total</ThemedText>
        </View>
        <View style={styles.statItem}>
          <ThemedText type="statValue" style={{ color: '#27AE60' }}>
            {getSortedTransactions().filter(t => t.statut === 'Payé').length}
          </ThemedText>
          <ThemedText type="statLabel">Payées</ThemedText>
        </View>
        <View style={styles.statItem}>
          <ThemedText type="statValue" style={{ color: '#F39C12' }}>
            {getSortedTransactions().filter(t => t.statut === 'En attente').length}
          </ThemedText>
          <ThemedText type="statLabel">En attente</ThemedText>
        </View>
      </View>

      {/* Liste des transactions */}
      <FlatList
        data={getSortedTransactions()}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialIcons name="receipt-long" size={48} color="#ccc" />
            <ThemedText style={{ color: '#888', marginTop: 8 }}>
              Aucune transaction pour ce filtre
            </ThemedText>
          </View>
        }
      />

      {/* Modal de tri */}
      <Modal
        visible={showSortModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSortModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText type="defaultSemiBold" style={styles.modalTitle}>
                Trier par
              </ThemedText>
              <TouchableOpacity onPress={() => setShowSortModal(false)}>
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={sortOptions}
              keyExtractor={item => item.key}
              renderItem={renderSortOption}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F2FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  sortButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
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
  date: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  amount: {
    color: '#007AFF',
    fontWeight: '600',
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
  },
  // Styles du modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  selectedSortOption: {
    backgroundColor: '#F0F8FF',
  },
  sortOptionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
});