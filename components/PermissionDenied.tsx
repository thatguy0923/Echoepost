import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  onRequest: () => void;
}

export default function PermissionDenied({ onRequest }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>❤️</Text>
      <Text style={styles.title}>需要访问你的步数</Text>
      <Text style={styles.description}>
        另一个宇宙的你通过你的步数来感知你。{'\n'}
        每一步都在拉近两个世界的距离。
      </Text>
      <TouchableOpacity style={styles.button} onPress={onRequest}>
        <Text style={styles.buttonText}>允许访问步数</Text>
      </TouchableOpacity>
      <Text style={styles.footer}>
        你的步数数据完全保留在本地，不会上传到任何服务器。
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', padding: 32 },
  icon: { fontSize: 48, marginBottom: 24 },
  title: { color: '#fff', fontSize: 20, fontWeight: '600', marginBottom: 16 },
  description: { color: '#888', fontSize: 15, textAlign: 'center', lineHeight: 24, marginBottom: 32 },
  button: { backgroundColor: '#fff', borderRadius: 14, paddingVertical: 14, paddingHorizontal: 32, marginBottom: 20 },
  buttonText: { color: '#000', fontSize: 16, fontWeight: '600' },
  footer: { color: '#555', fontSize: 11, textAlign: 'center' },
});
