import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../constants';
import { getMatchingPeers } from '../../services/apiService';
import { getInitials, calculateMatchPercentage } from '../../utils/helpers';
import { addConnection, removeConnection, selectIsConnected } from '../../store/slices/connectionsSlice';

const PeerMatchScreen = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);
  const { connections } = useSelector((state) => state.connections);
  const [peers, setPeers] = useState([]);
  const isDark = mode === 'dark';
  const themeColors = isDark ? COLORS.dark : COLORS.light;

  useEffect(() => {
    loadPeers();
  }, []);

  const loadPeers = async () => {
    try {
      const matchingPeers = await getMatchingPeers(
        userData?.subjects || [],
        userData?.learningGoals || []
      );
      setPeers(matchingPeers.filter(peer => peer.id !== userData?.uid));
    } catch (error) {
      console.error('Error loading peers:', error);
    }
  };

  const handleConnect = (peer) => {
    Alert.alert(
      'Connect with Peer',
      `Send connection request to ${peer.displayName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Connect',
          onPress: () => dispatch(addConnection(peer)),
        },
      ]
    );
  };

  const handleDisconnect = (peer) => {
    Alert.alert(
      'Remove Connection',
      `Remove ${peer.displayName} from your connections?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => dispatch(removeConnection(peer.id)),
        },
      ]
    );
  };

  const renderPeerCard = ({ item }) => {
    const isConnected = connections.some(conn => conn.id === item.id);

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: themeColors.card }]}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.avatar, { backgroundColor: COLORS.primary }]}>
            <Text style={styles.avatarText}>{getInitials(item.displayName)}</Text>
          </View>
          <View style={styles.peerInfo}>
            <Text style={[styles.peerName, { color: themeColors.text }]}>
              {item.displayName}
            </Text>
            <Text style={[styles.peerLevel, { color: themeColors.textSecondary }]}>
              {item.level} • {item.subjects?.slice(0, 2).join(', ')}
            </Text>
          </View>
        </View>
        {item.bio && (
          <Text style={[styles.peerBio, { color: themeColors.textSecondary }]} numberOfLines={2}>
            {item.bio}
          </Text>
        )}
        <TouchableOpacity
          style={[
            styles.connectButton,
            isConnected && { backgroundColor: `${COLORS.secondary}15` }
          ]}
          onPress={() => isConnected ? handleDisconnect(item) : handleConnect(item)}
        >
          <Feather
            name={isConnected ? "user-check" : "user-plus"}
            size={16}
            color={isConnected ? COLORS.secondary : COLORS.primary}
          />
          <Text style={[
            styles.connectText,
            { color: isConnected ? COLORS.secondary : COLORS.primary }
          ]}>
            {isConnected ? 'Connected' : 'Connect'}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <FlatList
        data={peers}
        renderItem={renderPeerCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="users" size={64} color={themeColors.textSecondary} />
            <Text style={[styles.emptyText, { color: themeColors.text }]}>
              No peers found
            </Text>
            <Text style={[styles.emptySubtext, { color: themeColors.textSecondary }]}>
              Update your profile to find study buddies
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { padding: SIZES.padding },
  card: {
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.margin,
    ...SHADOWS.light,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: { color: '#FFFFFF', fontSize: SIZES.h5, fontWeight: 'bold' },
  peerInfo: { flex: 1 },
  peerName: { fontSize: SIZES.h6, fontWeight: 'bold', marginBottom: 4 },
  peerLevel: { fontSize: SIZES.caption },
  peerBio: { fontSize: SIZES.body, marginBottom: 12, lineHeight: 20 },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  connectText: { fontSize: SIZES.body, fontWeight: '600' },
  emptyContainer: { alignItems: 'center', paddingVertical: 80 },
  emptyText: { fontSize: SIZES.h6, marginTop: 16, fontWeight: '600' },
  emptySubtext: { fontSize: SIZES.body, marginTop: 8, textAlign: 'center' },
});

export default PeerMatchScreen;
