import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>CE</Text>
        </View>
        <Text style={styles.name}>CE Student</Text>
        <Text style={styles.index}>E/20/089 · E20 Batch</Text>
        <View style={styles.tagRow}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Student</Text>
          </View>
          <View style={[styles.tag, { backgroundColor: 'rgba(0,200,150,0.15)' }]}>
            <Text style={[styles.tagText, { color: '#00c896' }]}>Active</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Department</Text>
        <Text style={styles.value}>Computer Engineering</Text>
        <Text style={[styles.label, { marginTop: 12 }]}>University</Text>
        <Text style={styles.value}>University of Peradeniya</Text>
        <Text style={[styles.label, { marginTop: 12 }]}>Faculty</Text>
        <Text style={styles.value}>Engineering</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a1628' },
  profileCard: { margin: 16, padding: 24, backgroundColor: '#0f1e38',
                 borderRadius: 16, alignItems: 'center',
                 borderWidth: 1, borderColor: '#1a2a4a' },
  avatar: { width: 72, height: 72, borderRadius: 36,
            backgroundColor: '#1a5aff', alignItems: 'center',
            justifyContent: 'center', marginBottom: 12 },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 26 },
  name: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  index: { color: '#4a6a8a', fontSize: 13, marginBottom: 12 },
  tagRow: { flexDirection: 'row', gap: 8 },
  tag: { backgroundColor: 'rgba(26,90,255,0.2)', paddingHorizontal: 12,
         paddingVertical: 4, borderRadius: 8 },
  tagText: { color: '#00d4ff', fontSize: 12 },
  card: { margin: 12, marginTop: 0, padding: 16, backgroundColor: '#0f1e38',
          borderRadius: 14, borderWidth: 1, borderColor: '#1a2a4a' },
  label: { color: '#4a6a8a', fontSize: 11, letterSpacing: 0.5,
           textTransform: 'uppercase', marginBottom: 4 },
  value: { color: '#fff', fontSize: 14 },
});
