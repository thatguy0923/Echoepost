import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import { Letter } from '../types/letter';

const { width } = Dimensions.get('window');

interface Props {
  letter: Letter | null;
  onClose: () => void;
}

export default function LetterDetail({ letter, onClose }: Props) {
  if (!letter) return null;

  return (
    <Modal
      visible={true}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>{letter.title}</Text>

          {letter.unlockedAt && (
            <Text style={styles.date}>
              收到于{' '}
              {new Date(letter.unlockedAt).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          )}

          <View style={styles.divider} />

          <Text style={styles.body}>{letter.body}</Text>

          {letter.photos.length > 0 && (
            <View style={styles.photosSection}>
              <Text style={styles.photosTitle}>照片</Text>
              {letter.photos.map((photo) => (
                <View key={photo.id} style={styles.photoContainer}>
                  <Image
                    source={photo.imageUri as any}
                    style={styles.photo}
                    resizeMode="contain"
                  />
                  {photo.caption && (
                    <Text style={styles.caption}>{photo.caption}</Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  closeButton: {
    position: 'absolute', top: 56, right: 24, zIndex: 1,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center',
  },
  closeIcon: { color: '#fff', fontSize: 16, fontWeight: '600' },
  content: { padding: 24, paddingTop: 80, paddingBottom: 60 },
  title: { color: '#fff', fontSize: 28, fontWeight: '700' },
  date: { color: '#666', fontSize: 13, marginTop: 8 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.15)', marginVertical: 24 },
  body: { color: 'rgba(255,255,255,0.9)', fontSize: 16, lineHeight: 28 },
  photosSection: { marginTop: 32 },
  photosTitle: { color: '#666', fontSize: 14, fontWeight: '600', marginBottom: 12 },
  photoContainer: { marginBottom: 16 },
  photo: { width: width - 48, height: (width - 48) * 0.7, borderRadius: 12 },
  caption: { color: '#888', fontSize: 12, fontStyle: 'italic', marginTop: 6 },
});
