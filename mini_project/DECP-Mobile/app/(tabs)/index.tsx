import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator,
  TouchableOpacity, SafeAreaView, BackHandler, Platform
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useFocusEffect } from 'expo-router';

const WEB_URL = 'https://co-528-labs-oito.vercel.app'; 

export default function App() {
  const webviewRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);

  // Android back button
  useFocusEffect(
    React.useCallback(() => {
      if(Platform.OS !== 'android') return;
      const onBack = () => {
        if(canGoBack && webviewRef.current){
          webviewRef.current.goBack();
          return true;
        }
        return false;
      };
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBack);
      return () => subscription.remove();
    }, [canGoBack])
  );

  // Error screen
  if(error){
    return (
      <SafeAreaView style={styles.center}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>📡</Text>
        <Text style={styles.errorTitle}>Connection Error</Text>
        <Text style={styles.errorMsg}>
          Could not load DECP.{'\n'}Check your internet connection.
        </Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => {
          setError(false);
          setLoading(true);
        }}>
          <Text style={styles.retryText}>🔄 Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>

      {/* WebView — always rendered, never unmounts */}
      <WebView
        ref={webviewRef}
        source={{ uri: WEB_URL }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        allowsBackForwardNavigationGestures={true}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}    
        onError={() => { setLoading(false); setError(true); }}
        onHttpError={() => { setLoading(false); setError(true); }}
        onNavigationStateChange={state => setCanGoBack(state.canGoBack)}
      />

      {/* Loading overlay — sits ON TOP of webview, removed when done */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.logo}>DECP</Text>
          <Text style={styles.subtitle}>
            Department Engagement & Career Platform
          </Text>
          <Text style={styles.uni}>
            University of Peradeniya · CE
          </Text>
          <ActivityIndicator
            size="large"
            color="#00d4ff"
            style={{ marginTop: 48 }}
          />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1628'
  },
  webview: {
    flex: 1,
    backgroundColor: '#0a1628'
  },

  // Loading overlay on top of webview
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject, // covers entire screen
    backgroundColor: '#0a1628',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    padding: 40
  },
  logo: {
    fontSize: 56,
    fontWeight: '900',
    color: '#00d4ff',
    letterSpacing: 6,
    marginBottom: 14
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 6
  },
  uni: {
    fontSize: 11,
    color: '#4a6a8a',
    textAlign: 'center'
  },
  loadingText: {
    color: '#4a6a8a',
    fontSize: 12,
    marginTop: 14
  },

  // Error screen
  center: {
    flex: 1,
    backgroundColor: '#0a1628',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10
  },
  errorMsg: {
    fontSize: 14,
    color: '#4a6a8a',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30
  },
  retryBtn: {
    backgroundColor: '#1a5aff',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12
  },
  retryText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15
  }
});