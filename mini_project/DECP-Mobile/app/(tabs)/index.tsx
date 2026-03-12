import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

const API = 'https://decp-api.onrender.com';

export default function FeedScreen() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API}/api/posts`)
      .then(res => res.json())
      .then(setPosts)
      .catch(() => {});
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>DECP – CE UoP</Text>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.author}>{item.authorName}</Text>
            <Text style={styles.postText}>{item.text}</Text>
            <Text style={styles.meta}>
              ❤️ {item.likes} · 💬 {item.comments}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a1628', paddingTop: 44 },
  header: { color: '#00d4ff', fontSize: 22, fontWeight: 'bold', padding: 16 },
  card: { margin: 12, padding: 16, backgroundColor: '#0f1e38', borderRadius: 12 },
  author: { color: '#fff', fontWeight: 'bold', marginBottom: 6 },
  postText: { color: '#ccc', lineHeight: 22 },
  meta: { color: '#4a6a8a', marginTop: 8, fontSize: 12 },
});