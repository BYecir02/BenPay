import { View, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';

export default function HomeTab() {
  // Simulations de données
  const todaySales = 14;
  const todayRevenue = 125000; // FCFA
  const lowStock = 2;
  const userName = "Badirou Mohamed Yecir";

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0.9)).current;
  const router = useRouter();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.ScrollView 
      style={[styles.container, { opacity: fadeAnim }]}
      contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false} 
    >
      {/* Message de bienvenue */}
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>Bonjour, {userName} 👋</ThemedText>
        <ThemedText type="subtitle" style={styles.subtitle}>Tableau de bord BenPay</ThemedText>
      </View>

      {/* Statistiques clés - Version verticale plus large */}
      <Animated.View style={[styles.statsContainer, { transform: [{ scale: scaleValue }] }]}>
        <StatCard 
          icon="shopping-cart" 
          value={todaySales} 
          label="Ventes aujourd'hui" 
          color="#007AFF" 
          iconBg="#E6F2FF"
        />
        <StatCard 
          icon="attach-money" 
          value={`${todayRevenue.toLocaleString()} FCFA`} 
          label="Chiffre d'affaires" 
          color="#27AE60" 
          iconBg="#E8F8F0"
        />
        <StatCard 
          icon="warning" 
          value={lowStock} 
          label="Stocks faibles" 
          color="#F39C12" 
          iconBg="#FEF5E6"
        />
      </Animated.View>

      {/* Actions rapides */}
      <View style={styles.sectionTitle}>
        <ThemedText type="sectionTitle">Actions rapides</ThemedText>
      </View>
      <View style={styles.quickLinks}>
        <ActionCard 
          icon="point-of-sale" 
          label="Nouvelle vente" 
          color="#007AFF"
          onPress={() => router.push('/(tabs)/new-sale')}
        />
        <ActionCard 
          icon="inventory" 
          label="Gérer les produits" 
          color="#27AE60"
          onPress={() => router.push('/(tabs)/products')}
        />
        <ActionCard 
          icon="history" 
          label="Historique" 
          color="#F39C12"
          onPress={() => router.push('/(tabs)/transactions')}
        />
        <ActionCard 
          icon="file-download" 
          label="Exporter (CSV)" 
          color="#9B51E0"
          onPress={() => {/* Ajoute ici l'action d'export */}}
        />
      </View>

      {/* Bannière d'information */}
      <View style={styles.infoBanner}>
        <MaterialIcons name="info" size={20} color="#007AFF" />
        <View style={{ flex: 1, marginLeft: 8 }}>
          <ThemedText type="defaultSemiBold" style={styles.infoText}>
            Astuce professionnelle
          </ThemedText>
          <ThemedText type="default" style={styles.infoText}>
            Finalisez une vente pour générer un QR code Mobile Money en 1 clic.
          </ThemedText>
        </View>
      </View>
    </Animated.ScrollView>
  );
}

// Composant StatCard réutilisable - Version plus large
const StatCard = ({ icon, value, label, color, iconBg }) => (
  <View style={[styles.statCard, { borderLeftColor: color }]}>
    <View style={styles.statContent}>
      <View style={[styles.statIconContainer, { backgroundColor: iconBg }]}>
        <MaterialIcons name={icon} size={24} color={color} />
      </View>
      <View style={styles.statTextContainer}>
        <ThemedText type="statValue" style={{ color }}>{value}</ThemedText>
        <ThemedText type="statLabel">{label}</ThemedText>
      </View>
    </View>
  </View>
);

// Composant ActionCard réutilisable
const ActionCard = ({ icon, label, color, onPress }) => (
  <TouchableOpacity 
    style={[styles.actionCard, { borderTopColor: color }]}
    activeOpacity={0.7}
    onPress={onPress}
  >
    <MaterialIcons name={icon} size={24} color={color} />
    <ThemedText type="defaultSemiBold" style={styles.actionLabel}>{label}</ThemedText>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  // Nouveau style pour les stats en vertical
  statsContainer: {
    marginBottom: 28,
    gap: 16,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20, // Plus de padding
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
  },
  // Nouveau layout horizontal pour le contenu
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIconContainer: {
    width: 48, // Plus grand
    height: 48, // Plus grand
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  quickLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderTopWidth: 3,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionLabel: {
    textAlign: 'center',
  },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: '#E6F2FF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'flex-start',
  },
  infoText: {
    color: '#1A1A1A',
  },
});