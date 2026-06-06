import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Modal, Animated,
} from 'react-native';
import { Letter } from '../types/letter';

interface Props {
  letter: Letter | null;
  onDismiss: () => void;
}

export default function NewLetterModal({ letter, onDismiss }: Props) {
  const [showContent, setShowContent] = React.useState(false);
  const scale = useRef(new Animated.Value(0.3)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!letter) return;
    setShowContent(false);
    Animated.spring(scale, {
      toValue: 1, friction: 6, tension: 100, useNativeDriver: true,
    }).start();
    Animated.timing(opacity, {
      toValue: 1, duration: 400, useNativeDriver: true,
    }).start();
  }, [letter]);

  if (!letter) return null;

  const handleOpen = () => {
    Animated.parallel([
      Animated.timing(scale, { toValue: 0.5, duration: 300, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => setShowContent(true));
  };

  return (
    <Modal visible={true} animationType="fade" transparent>
      <View style={styles.overlay}>
        {showContent ? (
          <View style={styles.contentCard}>
            <Text style={styles.contentTitle}>{letter.title}</Text>
            <Text style={styles.contentBody} numberOfLines={6}>{letter.body}</Text>
            {letter.photos.length > 0 && (
              <Text style={styles.photoHint}>📷 附有 {letter.photos.length} 张照片</Text>
            )}
            <TouchableOpacity style={styles.continueButton} onPress={onDismiss}>
              <Text style={styles.continueText}>继续旅程</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Animated.View style={[styles.envelopeContainer, { transform: [{ scale }], opacity }]}>
            <TouchableOpacity onPress={handleOpen} activeOpacity={0.9}>
              <Text style={styles.envelopeIcon}>📮</Text>
              <Text style={styles.envelopeTitle}>另一个宇宙的你来信了</Text>
              <Text style={styles.envelopeHint}>点击打开</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
  envelopeContainer: { alignItems: 'center' },
  envelopeIcon: { fontSize: 80 },
  envelopeTitle: { color: '#fff', fontSize: 20, fontWeight: '500', marginTop: 16 },
  envelopeHint: { color: '#888', fontSize: 14, marginTop: 8 },
  contentCard: { width: '85%', maxHeight: '70%', padding: 24 },
  contentTitle: { color: '#fff', fontSize: 24, fontWeight: '700' },
  contentBody: { color: 'rgba(255,255,255,0.8)', fontSize: 15, lineHeight: 24, marginTop: 16 },
  photoHint: { color: '#888', fontSize: 13, marginTop: 16 },
  continueButton: { marginTop: 32, backgroundColor: '#fff', borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  continueText: { color: '#000', fontSize: 16, fontWeight: '600' },
});
