import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, 
         StyleSheet, Image } from 'react-native';

export default function EventsScreen() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetch('https://portal.ce.pdn.ac.lk/api/events/v2/')
      .then(r => r.json())
      .then(data => {
        const mapped = (data.data || []).map((e: any) => {
          const date = new Date(e.start_at);
          return {
            id: e.id,
            title: e.title,
            day: date.getDate(),
            month: date.toLocaleString('default', { month: 'short' }),
            time: date.toLocaleTimeString('en-US', {
              hour: '2-digit', minute: '2-digit'
            }),
            location: e.location || 'CE Department',
            desc: e.description
              ? e.description.replace(/<[^>]*>/g, '').slice(0, 120)
              : '',
            image: e.image || null,
            tag: e.event_type?.[0] || 'Event'
          };
        });
        setEvents(mapped);
      })
      .catch(() => {});
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(item, index) => String(item.id || index)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.image && (
              <Image source={{ uri: item.image }}
                style={styles.eventImage}/>
            )}
            <View style={styles.row}>
              <View style={styles.dateBadge}>
                <Text style={styles.day}>{item.day}</Text>
                <Text style={styles.month}>{item.month}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.meta}>
                  🕑 {item.time}
                </Text>
                <Text style={styles.meta}>
                  📍 {item.location}
                </Text>
                <Text style={styles.desc}>{item.desc}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.btn}>
              <Text style={styles.btnText}>RSVP</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Loading events...</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a1628' },
  card: { margin: 12, marginTop: 4, padding: 16, backgroundColor: '#0f1e38',
          borderRadius: 14, borderWidth: 1, borderColor: '#1a2a4a' },
  eventImage: { width: '100%', height: 140, borderRadius: 10,
                marginBottom: 12, resizeMode: 'cover' },
  row: { flexDirection: 'row', gap: 12 },
  dateBadge: { backgroundColor: '#1a5aff', borderRadius: 10,
               padding: 10, alignItems: 'center', minWidth: 50,
               alignSelf: 'flex-start' },
  day: { color: '#fff', fontWeight: 'bold', fontSize: 20, lineHeight: 22 },
  month: { color: 'rgba(255,255,255,0.8)', fontSize: 10,
           textTransform: 'uppercase' },
  title: { color: '#fff', fontWeight: 'bold', fontSize: 14,
           marginBottom: 4, flex: 1 },
  meta: { color: '#4a6a8a', fontSize: 11, marginBottom: 2 },
  desc: { color: '#8899bb', fontSize: 12, lineHeight: 18, marginTop: 4 },
  btn: { backgroundColor: '#1a5aff', borderRadius: 8, padding: 10,
         alignItems: 'center', marginTop: 12 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  empty: { color: '#4a6a8a', textAlign: 'center', marginTop: 60, fontSize: 14 },
});