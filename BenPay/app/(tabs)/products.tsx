import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { MaterialIcons } from '@expo/vector-icons';

// Exemple de produits avec ingrédients et coût de revient
const produits = [
  {
    id: '1',
    nom: 'Pain',
    prix: 250,
    stock: 12,
    categorie: 'Alimentation',
    ingredients: [
      { nom: 'Farine', quantite: 0.5, unite: 'kg', coutUnitaire: 400 }, // 0.5kg à 400 FCFA/kg
      { nom: 'Levure', quantite: 0.01, unite: 'kg', coutUnitaire: 2000 },
    ],
  },
  {
    id: '2',
    nom: 'T-shirt',
    prix: 3500,
    stock: 5,
    categorie: 'Vêtements',
    ingredients: [
      { nom: 'Tissu', quantite: 1, unite: 'm', coutUnitaire: 800 },
      { nom: 'Fil', quantite: 0.1, unite: 'bobine', coutUnitaire: 500 },
    ],
  },
  {
    id: '3',
    nom: 'Savon',
    prix: 400,
    stock: 20,
    categorie: 'Hygiène',
    ingredients: [
      { nom: 'Soude', quantite: 0.05, unite: 'kg', coutUnitaire: 1000 },
      { nom: 'Huile', quantite: 0.2, unite: 'L', coutUnitaire: 1200 },
    ],
  },
];

// Fonction utilitaire pour calculer le coût de revient
function calculerCout(ingredients) {
  if (!ingredients) return 0;
  return ingredients.reduce((total, ing) => total + (ing.quantite * ing.coutUnitaire), 0);
}

export default function ProductsScreen() {
  const renderItem = ({ item }) => (
    <View style={styles.productCard}>
      <View style={{ flex: 1 }}>
        <ThemedText type="defaultSemiBold">{item.nom}</ThemedText>
        <ThemedText type="default" style={styles.categorie}>{item.categorie}</ThemedText>
        <ThemedText type="default">Prix : {item.prix} FCFA</ThemedText>
        <ThemedText type="default">
          Coût de revient : {calculerCout(item.ingredients)} FCFA
        </ThemedText>
        <ThemedText type="default" style={item.stock <= 3 ? styles.stockLow : undefined}>
          Stock : {item.stock}
        </ThemedText>
        {/* Affichage des ingrédients */}
        <View style={styles.ingredientBox}>
          <ThemedText style={styles.ingredientTitle}>Ingrédients :</ThemedText>
          {item.ingredients.map((ing, idx) => (
            <ThemedText key={idx} style={styles.ingredientLine}>
              - {ing.nom} : {ing.quantite} {ing.unite} × {ing.coutUnitaire} FCFA
            </ThemedText>
          ))}
        </View>
      </View>
      <TouchableOpacity style={styles.editBtn} onPress={() => { /* ouvrir l’édition */ }}>
        <MaterialIcons name="edit" size={22} color="#007AFF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <ThemedText type="title">Produits</ThemedText>
        <TouchableOpacity style={styles.addBtn} onPress={() => { /* ouvrir l’ajout */ }}>
          <MaterialIcons name="add-circle" size={28} color="#27AE60" />
          <ThemedText style={{ color: '#27AE60', marginLeft: 4 }}>Ajouter</ThemedText>
        </TouchableOpacity>
      </View>
      <FlatList
        data={produits}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
        ListEmptyComponent={
          <ThemedText>Aucun produit pour le moment.</ThemedText>
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
  productCard: {
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
  categorie: {
    fontSize: 13,
    color: '#888',
    marginBottom: 2,
  },
  stockLow: {
    color: '#F39C12',
    fontWeight: 'bold',
  },
  editBtn: {
    marginLeft: 12,
    padding: 4,
  },
  ingredientBox: {
    marginTop: 8,
    marginBottom: 4,
  },
  ingredientTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#555',
  },
  ingredientLine: {
    fontSize: 13,
    color: '#555',
    marginLeft: 8,
  },
});