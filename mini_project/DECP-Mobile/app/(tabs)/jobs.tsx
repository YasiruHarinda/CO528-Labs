import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const API = 'https://decp-backend-xxxx.onrender.com'; // ← your Render URL

export default function JobsScreen() {
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API}/api/jobs`)
      .then(r => r.json())
      .then(data => setJobs(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={jobs}
        keyExtractor={(item, index) => item.id || String(index)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.company}>{item.company} · {item.location}</Text>
            <View style={styles.tagRow}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{item.type || 'Job'}</Text>
              </View>
            </View>
            <Text style={styles.desc}>{item.desc}</Text>
            <TouchableOpacity style={styles.btn}>
              <Text style={styles.btnText}>Apply Now</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No jobs posted yet.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a1628' },
  card: { margin: 12, marginTop: 4, padding: 16, backgroundColor: '#0f1e38',
          borderRadius: 14, borderWidth: 1, borderColor: '#1a2a4a' },
  title: { color: '#fff', fontWeight: 'bold', fontSize: 15, marginBottom: 4 },
  company: { color: '#4a6a8a', fontSize: 12, marginBottom: 8 },
  tagRow: { flexDirection: 'row', marginBottom: 8 },
  tag: { backgroundColor: 'rgba(26,90,255,0.2)', paddingHorizontal: 10,
         paddingVertical: 3, borderRadius: 6 },
  tagText: { color: '#00d4ff', fontSize: 11 },
  desc: { color: '#8899bb', fontSize: 12, lineHeight: 18 },
  btn: { backgroundColor: '#1a5aff', borderRadius: 8, padding: 10,
         alignItems: 'center', marginTop: 12 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  empty: { color: '#4a6a8a', textAlign: 'center', marginTop: 60, fontSize: 14 },
});