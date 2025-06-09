import { useState, useRef } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import QRCode from 'react-native-qrcode-svg';
import { useRouter } from 'expo-router';

export default function NewSaleScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [clientPhone, setClientPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('mobile_money');
  const qrRef = useRef();

  const products = [
    { id: 1, name: "Téléphone XYZ", price: 75000, stock: 5 },
    { id: 2, name: "Chargeur USB-C", price: 5000, stock: 12 },
  ];

  const calculateTotal = () => selectedProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleAddProduct = (product) => {
    setSelectedProducts(prev => {
      const existing = prev.find(p => p.id === product.id);
      return existing 
        ? prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p)
        : [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setSelectedProducts(prev =>
      prev.map(p => 
        p.id === productId ? { ...p, quantity: newQuantity } : p
      )
    );
  };

  const removeProduct = (productId) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== productId));
  };

  const generateTransactionQR = () => JSON.stringify({
    amount: calculateTotal(),
    client: clientPhone,
    products: selectedProducts.map(p => ({ id: p.id, qty: p.quantity })),
    timestamp: new Date().toISOString(),
  });

  const handleCompleteSale = () => {
    if (!clientPhone) return Alert.alert("Erreur", "Numéro client requis");
    if (selectedProducts.length === 0) return Alert.alert("Erreur", "Panier vide");
    setStep(3);
  };

  // Affiche le bouton retour à toutes les étapes
  const handleBack = () => {
    if (step === 1) {
      router.back();
    } else {
      setStep(step - 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Barre d'étapes avec bouton retour */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBack}
        >
          <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <View style={styles.steps}>
          {[1, 2, 3].map((stepNumber) => (
            <View 
              key={stepNumber} 
              style={[
                styles.step, 
                step >= stepNumber && styles.activeStep,
                step === stepNumber && styles.currentStep
              ]}
            >
              <ThemedText type="defaultSemiBold" style={styles.stepText}>
                {stepNumber}
              </ThemedText>
            </View>
          ))}
        </View>
      </View>

      {/* Étape 1 : Sélection produits */}
      {step === 1 && (
        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <ThemedText type="sectionTitle">Client</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Numéro MTN/Moov (ex: 22961234567)"
              keyboardType="phone-pad"
              value={clientPhone}
              onChangeText={setClientPhone}
            />
          </View>

          <View style={styles.section}>
            <ThemedText type="sectionTitle">Produits</ThemedText>
            {products.map(product => (
              <TouchableOpacity 
                key={product.id} 
                style={styles.productCard}
                onPress={() => handleAddProduct(product)}
              >
                <View style={{ flex: 1 }}>
                  <ThemedText type="defaultSemiBold">{product.name}</ThemedText>
                  <ThemedText type="default">{product.price.toLocaleString()} FCFA</ThemedText>
                </View>
                <MaterialIcons name="add-circle" size={24} color="#007AFF" />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.section}>
            <ThemedText type="sectionTitle">Panier</ThemedText>
            {selectedProducts.length === 0 ? (
              <ThemedText style={styles.emptyText}>Aucun produit</ThemedText>
            ) : (
              <>
                {selectedProducts.map(item => (
                  <View key={item.id} style={styles.cartItem}>
                    <View style={{ flex: 1 }}>
                      <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
                      <ThemedText type="default">{item.price.toLocaleString()} FCFA/unité</ThemedText>
                    </View>
                    
                    <View style={styles.quantityControls}>
                      <TouchableOpacity 
                        onPress={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <MaterialIcons 
                          name="remove-circle" 
                          size={24} 
                          color={item.quantity <= 1 ? '#ccc' : '#ff3b30'} 
                        />
                      </TouchableOpacity>
                      
                      <ThemedText type="defaultSemiBold" style={styles.quantityText}>
                        {item.quantity}
                      </ThemedText>
                      
                      <TouchableOpacity 
                        onPress={() => handleQuantityChange(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                      >
                        <MaterialIcons 
                          name="add-circle" 
                          size={24} 
                          color={item.quantity >= item.stock ? '#ccc' : '#34c759'} 
                        />
                      </TouchableOpacity>
                    </View>
                    
                    <TouchableOpacity 
                      style={styles.deleteButton}
                      onPress={() => removeProduct(item.id)}
                    >
                      <MaterialIcons name="delete" size={20} color="#ff3b30" />
                    </TouchableOpacity>
                  </View>
                ))}
                
                <View style={styles.totalContainer}>
                  <ThemedText type="title">Total:</ThemedText>
                  <ThemedText type="title">{calculateTotal().toLocaleString()} FCFA</ThemedText>
                </View>
              </>
            )}
          </View>

          <TouchableOpacity 
            style={[styles.button, selectedProducts.length === 0 && styles.disabledButton]}
            disabled={selectedProducts.length === 0}
            onPress={() => setStep(2)}
          >
            <ThemedText type="buttonLabel">Valider le panier</ThemedText>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Étape 2 : Paiement */}
      {step === 2 && (
        <View style={styles.content}>
          <View style={styles.section}>
            <ThemedText type="sectionTitle">Paiement</ThemedText>
            <TouchableOpacity 
              style={[styles.paymentMethod, paymentMethod === 'mobile_money' && styles.selectedMethod]}
              onPress={() => setPaymentMethod('mobile_money')}
            >
              <MaterialIcons name="phone-android" size={24} color="#007AFF" />
              <ThemedText type="defaultSemiBold" style={styles.methodText}>
                Mobile Money (MTN/Moov)
              </ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.summary}>
            <ThemedText type="sectionTitle">Récapitulatif</ThemedText>
            {selectedProducts.map(item => (
              <View key={item.id} style={styles.summaryItem}>
                <ThemedText type="default">
                  {item.quantity}x {item.name}
                </ThemedText>
                <ThemedText type="default">
                  {(item.price * item.quantity).toLocaleString()} FCFA
                </ThemedText>
              </View>
            ))}
            <View style={styles.summaryTotal}>
              <ThemedText type="title">Total:</ThemedText>
              <ThemedText type="title">{calculateTotal().toLocaleString()} FCFA</ThemedText>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.button}
            onPress={handleCompleteSale}
          >
            <ThemedText type="buttonLabel">Générer QR Code</ThemedText>
          </TouchableOpacity>
        </View>
      )}

      {/* Étape 3 : QR Code */}
      {step === 3 && (
        <View style={styles.qrContainer}>
          <ThemedText type="title" style={styles.qrTitle}>Paiement Mobile Money</ThemedText>
          <ThemedText type="default" style={styles.qrSubtitle}>
            Scannez avec {paymentMethod.includes('mtn') ? 'MTN' : 'Moov'} Money
          </ThemedText>
          
          <View style={styles.qrCodeWrapper}>
            <QRCode
              value={generateTransactionQR()}
              size={220}
              color="#000"
              backgroundColor="#fff"
              getRef={qrRef}
            />
          </View>

          <View style={styles.amountDisplay}>
            <ThemedText type="title">{calculateTotal().toLocaleString()} FCFA</ThemedText>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.printButton}
              onPress={() => console.log("Imprimer reçu")}
            >
              <MaterialIcons name="print" size={20} color="#fff" />
              <ThemedText type="buttonLabel" style={styles.printButtonText}>
                Imprimer
              </ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.newSaleButton}
              onPress={() => {
                setSelectedProducts([]);
                setStep(1);
              }}
            >
              <MaterialIcons name="add-shopping-cart" size={20} color="#007AFF" />
              <ThemedText type="buttonLabel" style={styles.newSaleButtonText}>
                Nouvelle vente
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 16,
  },
  steps: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  step: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeStep: {
    backgroundColor: '#E6F2FF',
  },
  currentStep: {
    backgroundColor: '#007AFF',
  },
  stepText: {
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 8,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
    alignItems: 'center',
    elevation: 1,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  quantityText: {
    marginHorizontal: 8,
    minWidth: 24,
    textAlign: 'center',
  },
  deleteButton: {
    marginLeft: 8,
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 16,
    color: '#888',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedMethod: {
    borderColor: '#007AFF',
    backgroundColor: '#E6F2FF',
  },
  methodText: {
    marginLeft: 12,
  },
  summary: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  qrContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  qrTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  qrSubtitle: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  qrCodeWrapper: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 3,
  },
  amountDisplay: {
    marginVertical: 24,
    padding: 16,
    backgroundColor: '#E8F8F0',
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  printButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  printButtonText: {
    color: '#fff',
  },
  newSaleButton: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  newSaleButtonText: {
    color: '#007AFF',
  },
});