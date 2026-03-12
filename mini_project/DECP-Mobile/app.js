import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, FlatList } from 'react-native';

const API = 'https://decp-api.onrender.com'; // Your backend URL

export default function App() {
  const [tab, setTab] = useState('feed');
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/posts`).then(r => r.json()).then(setPosts).catch(() => {});
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>DECP – CE UoP</Text>
      // Tab navigation
      <View style={styles.tabs}>
        {['feed','jobs','events','profile'].map(t => (
          <TouchableOpacity key={t} style={[styles.tab, tab===t && styles.activeTab]} onPress={() => setTab(t)}>
            <Text style={tab===t ? styles.activeTabText : styles.tabText}>{t.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}</View>
      // Feed tab
      {tab === 'feed' && (
        <FlatList data={posts} keyExtractor={i => i.id}
          renderItem={({item}) => (
            <View style={styles.card}>
              <Text style={styles.author}>{item.authorName}</Text>
              <Text style={styles.postText}>{item.text}</Text>
              <Text style={styles.meta}>❤️ {item.likes} · 💬 {item.comments}</Text>
            </View>
          )} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a1628', paddingTop: 44 },
  header: { color: '#00d4ff', fontSize: 22, fontWeight: 'bold', padding: 16 },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#1a2a4a' },
  tab: { flex: 1, padding: 12, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderColor: '#00d4ff' },
  tabText: { color: '#4a6a8a', fontSize: 11 },
  activeTabText: { color: '#00d4ff', fontSize: 11, fontWeight: 'bold' },
  card: { margin: 12, padding: 16, backgroundColor: '#0f1e38', borderRadius: 12 },
  author: { color: '#fff', fontWeight: 'bold', marginBottom: 6 },
  postText: { color: '#ccc', lineHeight: 22 },
  meta: { color: '#4a6a8a', marginTop: 8, fontSize: 12 },
});