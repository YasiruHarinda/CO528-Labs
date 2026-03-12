import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, FlatList, SafeAreaView, ScrollView } from 'react-native';

const API = 'http://localhost:3000'; // change to Render URL when deployed

export default function App() {
  const [tab, setTab] = useState('feed');
  const [posts, setPosts] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [events, setEvents] = useState([]);
  const [newPost, setNewPost] = useState('');

  useEffect(() => {
    fetch(`${API}/api/posts`).then(r => r.json()).then(setPosts).catch(() => {});
    fetch(`${API}/api/jobs`).then(r => r.json()).then(setJobs).catch(() => {});
    fetch(`${API}/api/events`).then(r => r.json()).then(setEvents).catch(() => {});
  }, []);

  const submitPost = async () => {
    if (!newPost.trim()) return;
    await fetch(`${API}/api/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newPost, authorName: 'You', authorBatch: 'E19' })
    });
    setNewPost('');
    fetch(`${API}/api/posts`).then(r => r.json()).then(setPosts).catch(() => {});
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.header}>DECP</Text>
        <Text style={styles.headerSub}>CE · UoP</Text>
      </View>

      {/* Tab Bar */}
      <View style={styles.tabs}>
        {['feed', 'jobs', 'events', 'profile'].map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.activeTab]}
            onPress={() => setTab(t)}
          >
            <Text style={tab === t ? styles.activeTabText : styles.tabText}>
              {t === 'feed' ? '📰' : t === 'jobs' ? '💼' : t === 'events' ? '📅' : '👤'}
            </Text>
            <Text style={tab === t ? styles.activeTabText : styles.tabText}>
              {t.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* FEED TAB */}
      {tab === 'feed' && (
        <View style={{ flex: 1 }}>
          <View style={styles.composer}>
            <TextInput
              style={styles.composerInput}
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
          <FlatList
            data={posts}
            keyExtractor={(item, index) => item.id || String(index)}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {item.authorName ? item.authorName[0] : '?'}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.author}>{item.authorName || 'Unknown'}</Text>
                    <Text style={styles.batch}>{item.authorBatch || ''}</Text>
                  </View>
                </View>
                <Text style={styles.postText}>{item.text}</Text>
                <Text style={styles.meta}>❤️ {item.likes || 0}  💬 {item.comments || 0}</Text>
              </View>
            )}
            ListEmptyComponent={<Text style={styles.empty}>No posts yet. Be the first!</Text>}
          />
        </View>
      )}

      {/* JOBS TAB */}
      {tab === 'jobs' && (
        <FlatList
          data={jobs}
          keyExtractor={(item, index) => item.id || String(index)}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.jobTitle}>{item.title}</Text>
              <Text style={styles.company}>{item.company} · {item.location}</Text>
              <View style={styles.tagRow}>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{item.type}</Text>
                </View>
              </View>
              <Text style={styles.desc}>{item.desc}</Text>
              <TouchableOpacity style={styles.applyBtn}>
                <Text style={styles.applyBtnText}>Apply Now</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.empty}>No jobs posted yet.</Text>}
        />
      )}

      {/* EVENTS TAB */}
      {tab === 'events' && (
        <FlatList
          data={events}
          keyExtractor={(item, index) => item.id || String(index)}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.eventRow}>
                <View style={styles.dateBadge}>
                  <Text style={styles.dateDay}>{item.day || '—'}</Text>
                  <Text style={styles.dateMonth}>{item.month || '—'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.jobTitle}>{item.title}</Text>
                  <Text style={styles.batch}>🕑 {item.time}  📍 {item.location}</Text>
                  <Text style={styles.desc}>{item.desc}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.applyBtn}>
                <Text style={styles.applyBtnText}>RSVP</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.empty}>No events yet.</Text>}
        />
      )}

      {/* PROFILE TAB */}
      {tab === 'profile' && (
        <ScrollView>
          <View style={styles.profileCard}>
            <View style={styles.profileAvatar}>
              <Text style={styles.profileAvatarText}>CE</Text>
            </View>
            <Text style={styles.profileName}>CE Student</Text>
            <Text style={styles.batch}>E/19/001 · E19 Batch</Text>
            <View style={styles.tagRow}>
              <View style={styles.tag}><Text style={styles.tagText}>Student</Text></View>
              <View style={[styles.tag, { backgroundColor: 'rgba(0,200,150,0.2)' }]}>
                <Text style={[styles.tagText, { color: '#00c896' }]}>Active</Text>
              </View>
            </View>
          </View>
          <View style={styles.card}>
            <Text style={styles.author}>Department</Text>
            <Text style={styles.desc}>Computer Engineering</Text>
            <Text style={[styles.author, { marginTop: 12 }]}>University</Text>
            <Text style={styles.desc}>University of Peradeniya</Text>
          </View>
        </ScrollView>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a1628' },
  headerRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, padding: 16, paddingBottom: 8 },
  header: { color: '#00d4ff', fontSize: 24, fontWeight: 'bold' },
  headerSub: { color: '#4a6a8a', fontSize: 13 },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#1a2a4a' },
  tab: { flex: 1, padding: 10, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderColor: '#00d4ff' },
  tabText: { color: '#4a6a8a', fontSize: 10, marginTop: 2 },
  activeTabText: { color: '#00d4ff', fontSize: 10, fontWeight: 'bold', marginTop: 2 },
  composer: { flexDirection: 'row', margin: 12, gap: 8, alignItems: 'flex-end' },
  composerInput: { flex: 1, backgroundColor: '#0f1e38', color: '#fff', borderRadius: 10, padding: 12, fontSize: 13, borderWidth: 1, borderColor: '#1a2a4a', minHeight: 50 },
  postBtn: { backgroundColor: '#1a5aff', borderRadius: 10, padding: 12, paddingHorizontal: 16 },
  postBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  card: { margin: 12, marginTop: 6, padding: 16, backgroundColor: '#0f1e38', borderRadius: 14, borderWidth: 1, borderColor: '#1a2a4a' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#1a5aff', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  author: { color: '#fff', fontWeight: '600', fontSize: 14 },
  batch: { color: '#4a6a8a', fontSize: 11, marginTop: 2 },
  postText: { color: '#ccc', lineHeight: 22, fontSize: 13 },
  meta: { color: '#4a6a8a', marginTop: 10, fontSize: 12 },
  jobTitle: { color: '#fff', fontWeight: 'bold', fontSize: 15, marginBottom: 4 },
  company: { color: '#4a6a8a', fontSize: 12, marginBottom: 8 },
  tagRow: { flexDirection: 'row', gap: 6, marginBottom: 8, flexWrap: 'wrap' },
  tag: { backgroundColor: 'rgba(26,90,255,0.2)', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 6 },
  tagText: { color: '#00d4ff', fontSize: 11 },
  desc: { color: '#8899bb', fontSize: 12, lineHeight: 18 },
  applyBtn: { backgroundColor: '#1a5aff', borderRadius: 8, padding: 10, alignItems: 'center', marginTop: 12 },
  applyBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  eventRow: { flexDirection: 'row', gap: 12, marginBottom: 10 },
  dateBadge: { backgroundColor: '#1a5aff', borderRadius: 10, padding: 10, alignItems: 'center', minWidth: 50 },
  dateDay: { color: '#fff', fontWeight: 'bold', fontSize: 20, lineHeight: 22 },
  dateMonth: { color: 'rgba(255,255,255,0.8)', fontSize: 10, textTransform: 'uppercase' },
  profileCard: { margin: 16, padding: 24, backgroundColor: '#0f1e38', borderRadius: 16, alignItems: 'center' },
  profileAvatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#1a5aff', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  profileAvatarText: { color: '#fff', fontWeight: 'bold', fontSize: 26 },
  profileName: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  empty: { color: '#4a6a8a', textAlign: 'center', marginTop: 40, fontSize: 14 },
});