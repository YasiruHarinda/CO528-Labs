import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, 
         TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';

const API = 'https://decp-backend-xxxx.onrender.com'; // ← your Render URL

export default function FeedScreen() {
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadPosts = async () => {
    try {
      const resp = await fetch(`${API}/api/posts`);
      const data = await resp.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch(e) {
      console.log('Failed to load posts');
    }
  };

  useEffect(() => { loadPosts(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  };

  const submitPost = async () => {
    if(!newPost.trim()) return;
    try {
      await fetch(`${API}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: newPost,
          authorName: 'CE Student',
          authorBatch: 'E20'
        })
      });
      setNewPost('');
      loadPosts();
    } catch(e) {}
  };

  return (
    <View style={styles.container}>
      {/* Post composer */}
      <View style={styles.composer}>
        <TextInput
          style={styles.input}
          placeholder="Share an update..."
          placeholderTextColor="#4a6a8a"
          value={newPost}
          onChangeText={setNewPost}
          multiline
        />
        <TouchableOpacity style={styles.postBtn} onPress={submitPost}>
          <Text style={styles.postBtnText}>Post</Text>
        </TouchableOpacity>
      </View>

      {/* Posts list */}
      <FlatList
        data={posts}
        keyExtractor={(item, index) => item.id || String(index)}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh}
            tintColor="#00d4ff"/>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {item.authorName?.[0] || '?'}
                </Text>
              </View>
              <View>
                <Text style={styles.author}>
                  {item.authorName || 'CE Student'}
                </Text>
                <Text style={styles.batch}>
                  {item.authorBatch || ''}
                </Text>
              </View>
            </View>
            <Text style={styles.postText}>{item.text}</Text>
            <Text style={styles.meta}>
              ❤️ {item.likes || 0}  💬 {item.comments || 0}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No posts yet. Be the first to post!
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a1628' },
  composer: { flexDirection: 'row', margin: 12, gap: 8, alignItems: 'flex-end' },
  input: { flex: 1, backgroundColor: '#0f1e38', color: '#fff',
           borderRadius: 10, padding: 12, fontSize: 13,
           borderWidth: 1, borderColor: '#1a2a4a', minHeight: 50 },
  postBtn: { backgroundColor: '#1a5aff', borderRadius: 10,
             padding: 12, paddingHorizontal: 16 },
  postBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  card: { margin: 12, marginTop: 4, padding: 16, backgroundColor: '#0f1e38',
          borderRadius: 14, borderWidth: 1, borderColor: '#1a2a4a' },
  cardHeader: { flexDirection: 'row', alignItems: 'center',
                marginBottom: 10, gap: 10 },
  avatar: { width: 36, height: 36, borderRadius: 18,
            backgroundColor: '#1a5aff', alignItems: 'center',
            justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  author: { color: '#fff', fontWeight: '600', fontSize: 14 },
  batch: { color: '#4a6a8a', fontSize: 11, marginTop: 2 },
  postText: { color: '#ccc', lineHeight: 22, fontSize: 13 },
  meta: { color: '#4a6a8a', marginTop: 10, fontSize: 12 },
  empty: { color: '#4a6a8a', textAlign: 'center', marginTop: 60, fontSize: 14 },
});