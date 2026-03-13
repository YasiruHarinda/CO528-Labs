import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Linking, SafeAreaView, ScrollView
} from 'react-native';

const WEB_URL = 'https://co-528-labs-oito.vercel.app/';

export default function App() {
  const open = (path = '') => Linking.openURL(WEB_URL + path);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>

        <View style={styles.header}>
          <Text style={styles.logo}>DECP</Text>
          <Text style={styles.logoSub}>CE · University of Peradeniya</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardIcon}>🎓</Text>
          <Text style={styles.cardTitle}>
            Department Engagement{'\n'}& Career Platform
          </Text>
          <Text style={styles.cardDesc}>
            Connect with CE alumni, find jobs and stay updated with department events.
          </Text>
          <TouchableOpacity style={styles.mainBtn} onPress={() => open()}>
            <Text style={styles.mainBtnText}>🚀  Open DECP Platform</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionLabel}>QUICK ACCESS</Text>

        <View style={styles.grid}>
          {[
            { icon: '📰', label: 'Feed',     path: '#feed'     },
            { icon: '💼', label: 'Jobs',     path: '#jobs'     },
            { icon: '📅', label: 'Events',   path: '#events'   },
            { icon: '👥', label: 'Members',  path: '#members'  },
            { icon: '🔬', label: 'Research', path: '#research' },
            { icon: '💬', label: 'Messages', path: '#messages' },
          ].map(item => (
            <TouchableOpacity
              key={item.label}
              style={styles.gridBtn}
              onPress={() => open(item.path)}
            >
              <Text style={styles.gridIcon}>{item.icon}</Text>
              <Text style={styles.gridLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Department of Computer Engineering</Text>
          <Text style={styles.footerText}>University of Peradeniya, Sri Lanka</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a1628' },
  scroll: { padding: 20, paddingBottom: 40 },
  header: { alignItems: 'center', paddingVertical: 28 },
  logo: { fontSize: 48, fontWeight: '900', color: '#00d4ff', letterSpacing: 8 },
  logoSub: { fontSize: 12, color: '#4a6a8a', marginTop: 6, letterSpacing: 1 },
  card: { backgroundColor: '#0f1e38', borderRadius: 20, padding: 24,
          alignItems: 'center', borderWidth: 1, borderColor: '#1a2a4a', marginBottom: 28 },
  cardIcon: { fontSize: 44, marginBottom: 14 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#ffffff',
               textAlign: 'center', lineHeight: 26, marginBottom: 10 },
  cardDesc: { fontSize: 13, color: '#4a6a8a', textAlign: 'center',
              lineHeight: 20, marginBottom: 22 },
  mainBtn: { backgroundColor: '#1a5aff', paddingVertical: 14, paddingHorizontal: 32,
             borderRadius: 14, width: '100%', alignItems: 'center' },
  mainBtnText: { color: '#ffffff', fontWeight: '700', fontSize: 15 },
  sectionLabel: { fontSize: 11, color: '#4a6a8a', fontWeight: '600',
                  letterSpacing: 1.5, marginBottom: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 32 },
  gridBtn: { width: '30%', flexGrow: 1, backgroundColor: '#0f1e38', borderRadius: 16,
             padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#1a2a4a' },
  gridIcon: { fontSize: 28, marginBottom: 8 },
  gridLabel: { color: '#ffffff', fontSize: 12, fontWeight: '600' },
  footer: { alignItems: 'center', gap: 4 },
  footerText: { fontSize: 11, color: '#2a3a5a' },
});
