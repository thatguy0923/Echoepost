import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useJourney } from '../hooks/useJourney';
import { Letter } from '../types/letter';
import LetterDetail from '../components/LetterDetail';
import NewLetterModal from '../components/NewLetterModal';
import PermissionDenied from '../components/PermissionDenied';

export default function HomeScreen() {
  const journey = useJourney();
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [showDebug, setShowDebug] = useState(false);

  // ---- 加载中 ----
  if (journey.isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>正在连接宇宙...</Text>
      </View>
    );
  }

  // ---- 权限拒绝 ----
  if (journey.isPermissionDenied) {
    return <PermissionDenied onRequest={journey.requestPermission} />;
  }

  // ---- 主界面 ----
  return (
    <SafeAreaView style={styles.container}>
      {/* 步数展示 */}
      <TouchableOpacity
        style={styles.stepSection}
        activeOpacity={0.8}
        onLongPress={() => setShowDebug(!showDebug)}
      >
        <Text style={styles.stepLabel}>你已经走了</Text>
        <Text style={styles.stepCount}>
          {journey.totalSteps.toLocaleString()}
        </Text>
        <Text style={styles.stepUnit}>步</Text>
      </TouchableOpacity>

      {/* 调试面板（长按步数触发） */}
      {showDebug && (
        <View style={styles.debugPanel}>
          <Text style={styles.debugTitle}>原型调试</Text>
          <View style={styles.debugRow}>
            <TouchableOpacity
              style={styles.debugButton}
              onPress={() => journey.addSteps(500)}
            >
              <Text style={styles.debugButtonText}>+500 步</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.debugButton}
              onPress={() => journey.addSteps(1000)}
            >
              <Text style={styles.debugButtonText}>+1000 步</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.debugButton}
              onPress={() => journey.addSteps(3000)}
            >
              <Text style={styles.debugButtonText}>+3000 步</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.debugHint}>
            步数达标时自动解锁信件并弹出通知
          </Text>
        </View>
      )}

      {/* 信件列表 */}
      <FlatList
        data={journey.unlockedLetters}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          journey.unlockedLetters.length > 0 ? (
            <Text style={styles.sectionTitle}>收到的信</Text>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📮</Text>
            <Text style={styles.emptyTitle}>还没有收到信</Text>
            <Text style={styles.emptySubtitle}>
              继续走，另一个宇宙的你正在路上
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <LetterCard
            letter={item}
            onPress={() => setSelectedLetter(item)}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={journey.checkForNewLetter}
            tintColor="#888"
          />
        }
      />

      {/* 错误提示 */}
      {journey.errorMessage && (
        <Text style={styles.errorText}>{journey.errorMessage}</Text>
      )}

      {/* 信件详情 Modal */}
      <LetterDetail
        letter={selectedLetter}
        onClose={() => setSelectedLetter(null)}
      />

      {/* 新信到达动画 */}
      <NewLetterModal
        letter={journey.newLetter}
        onDismiss={journey.dismissNewLetter}
      />
    </SafeAreaView>
  );
}

// ---- 信件卡片子组件 ----
function LetterCard({ letter, onPress }: {
  letter: Letter;
  onPress: () => void;
}) {
  const isNew = letter.unlockedAt
    ? Date.now() - new Date(letter.unlockedAt).getTime() < 86400000
    : false;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{letter.title}</Text>
        <View style={styles.cardMeta}>
          {isNew && (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>新</Text>
            </View>
          )}
          {letter.unlockedAt && (
            <Text style={styles.cardDate}>
              {formatRelativeTime(letter.unlockedAt)}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ---- 相对时间格式化 ----
function formatRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes} 分钟前`;
  if (hours < 24) return `${hours} 小时前`;
  if (days < 7) return `${days} 天前`;
  return new Date(isoString).toLocaleDateString('zh-CN');
}

// ---- 样式 ----
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  centered: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#888',
    marginTop: 12,
    fontSize: 14,
  },
  stepSection: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 32,
  },
  stepLabel: {
    color: '#888',
    fontSize: 15,
  },
  stepCount: {
    color: '#fff',
    fontSize: 56,
    fontWeight: '200',
    fontVariant: ['tabular-nums'],
  },
  stepUnit: {
    color: '#888',
    fontSize: 15,
    marginTop: 4,
  },
  debugPanel: {
    marginHorizontal: 24,
    marginBottom: 16,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
  },
  debugTitle: {
    color: '#34C759',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 10,
  },
  debugRow: {
    flexDirection: 'row',
    gap: 8,
  },
  debugButton: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  debugButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  debugHint: {
    color: '#555',
    fontSize: 11,
    marginTop: 10,
    textAlign: 'center',
  },
  sectionTitle: {
    color: '#666',
    fontSize: 13,
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
  listContent: {
    paddingBottom: 40,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    color: '#888',
    fontSize: 17,
    fontWeight: '500',
  },
  emptySubtitle: {
    color: '#555',
    fontSize: 13,
    marginTop: 8,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
  },
  cardContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  newBadge: {
    backgroundColor: '#34C759',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  newBadgeText: {
    color: '#000',
    fontSize: 11,
    fontWeight: '700',
  },
  cardDate: {
    color: '#888',
    fontSize: 12,
  },
  errorText: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    color: '#ff6b6b',
    fontSize: 12,
    textAlign: 'center',
  },
});
