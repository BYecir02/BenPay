import { View, StyleSheet, FlatList, TouchableOpacity, Modal } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';

// Exemple de produits mixtes
const produits = [
  {
    id: '1',
    nom: 'Pain',
    prix: 250,
    stock: 12,
    categorie: 'Alimentation',
    type: 'fabrication', // Type avec ingrédients
    ingredients: [
      { nom: 'Farine', quantite: 0.5, unite: 'kg', coutUnitaire: 400 },
      { nom: 'Levure', quantite: 0.01, unite: 'kg', coutUnitaire: 2000 },
    ],
  },
  {
    id: '2',
    nom: 'iPhone 15',
    prix: 450000,
    stock: 3,
    categorie: 'Électronique',
    type: 'revente', // Type sans ingrédients
    prixAchat: 420000, // Prix d'achat pour les produits de revente
    fournisseur: 'Apple Store Cotonou',
  },
  {
    id: '3',
    nom: 'Chargeur USB-C',
    prix: 5000,
    stock: 15,
    categorie: 'Accessoires',
    type: 'revente',
    prixAchat: 3500,
    fournisseur: 'Grossiste Tech',
  },
  {
    id: '4',
    nom: 'Savon artisanal',
    prix: 400,
    stock: 20,
    categorie: 'Hygiène',
    type: 'fabrication',
    ingredients: [
      { nom: 'Soude', quantite: 0.05, unite: 'kg', coutUnitaire: 1000 },
      { nom: 'Huile', quantite: 0.2, unite: 'L', coutUnitaire: 1200 },
    ],
  },
];

// Options de tri
const sortOptions = [
  { key: 'nom-asc', label: 'Nom (A-Z)', icon: 'sort-by-alpha' },
  { key: 'nom-desc', label: 'Nom (Z-A)', icon: 'sort-by-alpha' },
  { key: 'prix-desc', label: 'Prix décroissant', icon: 'trending-down' },
  { key: 'prix-asc', label: 'Prix croissant', icon: 'trending-up' },
  { key: 'stock-desc', label: 'Stock décroissant', icon: 'inventory' },
  { key: 'stock-asc', label: 'Stock croissant', icon: 'inventory-2' },
  { key: 'marge-desc', label: 'Marge décroissante', icon: 'monetization-on' },
  { key: 'marge-asc', label: 'Marge croissante', icon: 'attach-money' },
  { key: 'type-fabrication', label: 'Fabrication seulement', icon: 'build' },
  { key: 'type-revente', label: 'Revente seulement', icon: 'store' },
  { key: 'stock-bas', label: 'Stock faible (≤3)', icon: 'warning' },
];

// Fonction utilitaire pour calculer le coût de revient
function calculerCoutRevient(produit) {
  if (produit.type === 'fabrication' && produit.ingredients) {
    return produit.ingredients.reduce((total, ing) => total + (ing.quantite * ing.coutUnitaire), 0);
  } else if (produit.type === 'revente' && produit.prixAchat) {
    return produit.prixAchat;
  }
  return 0;
}

// Fonction pour calculer la marge
function calculerMarge(produit) {
  const coutRevient = calculerCoutRevient(produit);
  return produit.prix - coutRevient;
}

// Fonction pour calculer le pourcentage de marge
function calculerPourcentageMarge(produit) {
  const coutRevient = calculerCoutRevient(produit);
  if (coutRevient === 0) return 0;
  return ((produit.prix - coutRevient) / coutRevient * 100).toFixed(1);
}

export default function ProductsScreen() {
  const [sortBy, setSortBy] = useState('nom-asc');
  const [showSortModal, setShowSortModal] = useState(false);

  // Fonction de tri
  const getSortedProducts = () => {
    let sorted = [...produits];

    switch (sortBy) {
      case 'nom-asc':
        return sorted.sort((a, b) => a.nom.localeCompare(b.nom));
      case 'nom-desc':
        return sorted.sort((a, b) => b.nom.localeCompare(a.nom));
      case 'prix-desc':
        return sorted.sort((a, b) => b.prix - a.prix);
      case 'prix-asc':
        return sorted.sort((a, b) => a.prix - b.prix);
      case 'stock-desc':
        return sorted.sort((a, b) => b.stock - a.stock);
      case 'stock-asc':
        return sorted.sort((a, b) => a.stock - b.stock);
      case 'marge-desc':
        return sorted.sort((a, b) => calculerMarge(b) - calculerMarge(a));
      case 'marge-asc':
        return sorted.sort((a, b) => calculerMarge(a) - calculerMarge(b));
      case 'type-fabrication':
        return sorted.filter(p => p.type === 'fabrication');
      case 'type-revente':
        return sorted.filter(p => p.type === 'revente');
      case 'stock-bas':
        return sorted.filter(p => p.stock <= 3);
      default:
        return sorted;
    }
  };

  const getCurrentSortLabel = () => {
    return sortOptions.find(option => option.key === sortBy)?.label || 'Nom (A-Z)';
  };

  const renderItem = ({ item }) => {
    const coutRevient = calculerCoutRevient(item);
    const marge = calculerMarge(item);
    const pourcentageMarge = calculerPourcentageMarge(item);

    return (
      <View style={styles.productCard}>
        <View style={{ flex: 1 }}>
          {/* En-tête du produit */}
          <View style={styles.productHeader}>
            <ThemedText type="defaultSemiBold">{item.nom}</ThemedText>
            <View style={[styles.typeBadge, { 
              backgroundColor: item.type === 'fabrication' ? '#E8F8F0' : '#E6F2FF' 
            }]}>
              <ThemedText style={[styles.typeBadgeText, { 
                color: item.type === 'fabrication' ? '#27AE60' : '#007AFF' 
              }]}>
                {item.type === 'fabrication' ? 'Fabrication' : 'Revente'}
              </ThemedText>
            </View>
          </View>

          <ThemedText type="default" style={styles.categorie}>{item.categorie}</ThemedText>
          
          {/* Informations prix */}
          <View style={styles.priceInfo}>
            <ThemedText type="default" style={styles.prixVente}>
              Prix de vente : {item.prix.toLocaleString()} FCFA
            </ThemedText>
            <ThemedText type="default" style={styles.coutRevient}>
              Coût de revient : {coutRevient.toLocaleString()} FCFA
            </ThemedText>
            <ThemedText type="default" style={[styles.marge, { color: marge > 0 ? '#27AE60' : '#F39C12' }]}>
              Marge : {marge.toLocaleString()} FCFA ({pourcentageMarge}%)
            </ThemedText>
          </View>

          {/* Stock */}
          <ThemedText type="default" style={item.stock <= 3 ? styles.stockLow : styles.stock}>
            Stock : {item.stock} {item.stock <= 3 && '⚠️'}
          </ThemedText>

          {/* Détails spécifiques selon le type */}
          {item.type === 'fabrication' && item.ingredients ? (
            <View style={styles.detailBox}>
              <ThemedText style={styles.detailTitle}>📋 Ingrédients :</ThemedText>
              {item.ingredients.map((ing, idx) => (
                <ThemedText key={idx} style={styles.detailLine}>
                  • {ing.nom} : {ing.quantite} {ing.unite} × {ing.coutUnitaire.toLocaleString()} FCFA
                </ThemedText>
              ))}
            </View>
          ) : (
            <View style={styles.detailBox}>
              <ThemedText style={styles.detailTitle}>🏪 Fournisseur :</ThemedText>
              <ThemedText style={styles.detailLine}>• {item.fournisseur}</ThemedText>
              <ThemedText style={styles.detailLine}>
                • Prix d'achat : {item.prixAchat?.toLocaleString()} FCFA
              </ThemedText>
            </View>
          )}
        </View>
        
        <TouchableOpacity style={styles.editBtn} onPress={() => { /* ouvrir l'édition */ }}>
          <MaterialIcons name="edit" size={22} color="#007AFF" />
        </TouchableOpacity>
      </View>
    );
  };

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

  // Statistiques dynamiques
  const sortedProducts = getSortedProducts();
  const totalProduits = sortedProducts.length;
  const produitsEnStock = sortedProducts.filter(p => p.stock > 0).length;
  const produitsStockBas = sortedProducts.filter(p => p.stock <= 3).length;

  return (
    <View style={styles.container}>
      {/* Header avec titre et bouton de tri */}
      <View style={styles.headerRow}>
        <ThemedText type="title">Produits</ThemedText>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.sortButton}
            onPress={() => setShowSortModal(true)}
          >
            <MaterialIcons name="sort" size={20} color="#007AFF" />
            <ThemedText style={styles.sortButtonText}>
              {getCurrentSortLabel()}
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addBtn} onPress={() => { /* ouvrir l'ajout */ }}>
            <MaterialIcons name="add-circle" size={28} color="#27AE60" />
            <ThemedText style={{ color: '#27AE60', marginLeft: 4 }}>Ajouter</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats rapides */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <ThemedText type="statValue">{totalProduits}</ThemedText>
          <ThemedText type="statLabel">Affichés</ThemedText>
        </View>
        <View style={styles.statItem}>
          <ThemedText type="statValue" style={{ color: '#27AE60' }}>{produitsEnStock}</ThemedText>
          <ThemedText type="statLabel">En stock</ThemedText>
        </View>
        <View style={styles.statItem}>
          <ThemedText type="statValue" style={{ color: '#F39C12' }}>{produitsStockBas}</ThemedText>
          <ThemedText type="statLabel">Stock bas</ThemedText>
        </View>
      </View>

      <FlatList
        data={sortedProducts}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialIcons name="inventory" size={48} color="#ccc" />
            <ThemedText style={{ color: '#888', marginTop: 8 }}>
              Aucun produit pour ce filtre.
            </ThemedText>
          </View>
        }
        showsVerticalScrollIndicator={false}
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
                Trier et filtrer
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F2FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  sortButtonText: {
    color: '#007AFF',
    fontSize: 12,
    fontWeight: '500',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F8F0',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
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
  productCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  categorie: {
    fontSize: 13,
    color: '#888',
    marginBottom: 8,
  },
  priceInfo: {
    marginBottom: 8,
  },
  prixVente: {
    fontWeight: '600',
    color: '#1A1A1A',
  },
  coutRevient: {
    color: '#666',
    fontSize: 14,
  },
  marge: {
    fontWeight: '600',
    fontSize: 14,
  },
  stock: {
    color: '#666',
    marginBottom: 8,
  },
  stockLow: {
    color: '#F39C12',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detailBox: {
    marginTop: 8,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 8,
  },
  detailTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 4,
  },
  detailLine: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  editBtn: {
    marginLeft: 12,
    padding: 4,
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