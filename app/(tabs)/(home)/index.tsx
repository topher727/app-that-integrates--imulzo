
import React, { useState } from "react";
import { Stack } from "expo-router";
import { ScrollView, Pressable, StyleSheet, View, Text, Platform, TextInput } from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { GlassView } from "expo-glass-effect";
import { useTheme } from "@react-navigation/native";
import { colors } from "@/styles/commonStyles";
import * as Haptics from "expo-haptics";

interface Voicemail {
  id: string;
  caller: string;
  phoneNumber: string;
  duration: string;
  timestamp: Date;
  isNew: boolean;
  transcription?: string;
}

export default function HomeScreen() {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock voicemail data - in production, this would come from native module or backend
  const [voicemails, setVoicemails] = useState<Voicemail[]>([
    {
      id: "1",
      caller: "John Smith",
      phoneNumber: "+1 (555) 123-4567",
      duration: "1:23",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isNew: true,
      transcription: "Hi, this is John. I wanted to follow up on our meeting..."
    },
    {
      id: "2",
      caller: "Sarah Johnson",
      phoneNumber: "+1 (555) 987-6543",
      duration: "0:45",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      isNew: true,
      transcription: "Hey, just checking in about the project deadline..."
    },
    {
      id: "3",
      caller: "Unknown",
      phoneNumber: "+1 (555) 456-7890",
      duration: "2:15",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      isNew: false,
    },
    {
      id: "4",
      caller: "Dr. Williams",
      phoneNumber: "+1 (555) 234-5678",
      duration: "1:05",
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
      isNew: false,
      transcription: "This is Dr. Williams office calling to confirm your appointment..."
    },
  ]);

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleVoicemailPress = (voicemail: Voicemail) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    console.log("Playing voicemail:", voicemail.id);
    
    // Mark as read
    setVoicemails(prev => 
      prev.map(vm => vm.id === voicemail.id ? { ...vm, isNew: false } : vm)
    );
  };

  const handleDeleteVoicemail = (id: string) => {
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    console.log("Deleting voicemail:", id);
    setVoicemails(prev => prev.filter(vm => vm.id !== id));
  };

  const filteredVoicemails = voicemails.filter(vm => 
    vm.caller.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vm.phoneNumber.includes(searchQuery)
  );

  const newCount = voicemails.filter(vm => vm.isNew).length;

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => console.log("Refresh voicemails")}
      style={styles.headerButtonContainer}
    >
      <IconSymbol name="arrow.clockwise" color={colors.primary} size={22} />
    </Pressable>
  );

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "myID Voicemail",
            headerRight: renderHeaderRight,
          }}
        />
      )}
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header Stats */}
        <View style={styles.headerStats}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{voicemails.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={[styles.statCard, styles.statCardHighlight]}>
            <Text style={[styles.statNumber, { color: colors.card }]}>{newCount}</Text>
            <Text style={[styles.statLabel, { color: colors.card }]}>New</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{voicemails.length - newCount}</Text>
            <Text style={styles.statLabel}>Read</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <IconSymbol name="magnifyingglass" color={colors.textSecondary} size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search voicemails..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery("")}>
              <IconSymbol name="xmark.circle.fill" color={colors.textSecondary} size={20} />
            </Pressable>
          )}
        </View>

        {/* Voicemail List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.listContainer,
            Platform.OS !== 'ios' && styles.listContainerWithTabBar
          ]}
          showsVerticalScrollIndicator={false}
        >
          {filteredVoicemails.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol name="phone.fill" color={colors.textSecondary} size={64} />
              <Text style={styles.emptyStateTitle}>No Voicemails</Text>
              <Text style={styles.emptyStateText}>
                {searchQuery ? "No voicemails match your search" : "You don't have any voicemails yet"}
              </Text>
            </View>
          ) : (
            filteredVoicemails.map((voicemail) => (
              <Pressable
                key={voicemail.id}
                onPress={() => handleVoicemailPress(voicemail)}
                style={({ pressed }) => [
                  styles.voicemailCard,
                  pressed && styles.voicemailCardPressed,
                ]}
              >
                <View style={styles.voicemailHeader}>
                  <View style={styles.voicemailInfo}>
                    <View style={styles.callerRow}>
                      {voicemail.isNew && <View style={styles.newBadge} />}
                      <Text style={[styles.callerName, voicemail.isNew && styles.callerNameBold]}>
                        {voicemail.caller}
                      </Text>
                    </View>
                    <Text style={styles.phoneNumber}>{voicemail.phoneNumber}</Text>
                  </View>
                  <View style={styles.voicemailMeta}>
                    <Text style={styles.timestamp}>{formatTimestamp(voicemail.timestamp)}</Text>
                    <View style={styles.durationBadge}>
                      <IconSymbol name="waveform" color={colors.primary} size={12} />
                      <Text style={styles.duration}>{voicemail.duration}</Text>
                    </View>
                  </View>
                </View>

                {voicemail.transcription && (
                  <View style={styles.transcriptionContainer}>
                    <Text style={styles.transcription} numberOfLines={2}>
                      {voicemail.transcription}
                    </Text>
                  </View>
                )}

                <View style={styles.voicemailActions}>
                  <Pressable 
                    style={styles.actionButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      console.log("Play voicemail:", voicemail.id);
                    }}
                  >
                    <IconSymbol name="play.circle.fill" color={colors.primary} size={24} />
                    <Text style={styles.actionButtonText}>Play</Text>
                  </Pressable>
                  
                  <Pressable 
                    style={styles.actionButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      console.log("Call back:", voicemail.phoneNumber);
                    }}
                  >
                    <IconSymbol name="phone.fill" color={colors.secondary} size={20} />
                    <Text style={styles.actionButtonText}>Call</Text>
                  </Pressable>
                  
                  <Pressable 
                    style={styles.actionButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleDeleteVoicemail(voicemail.id);
                    }}
                  >
                    <IconSymbol name="trash.fill" color={colors.error} size={20} />
                    <Text style={styles.actionButtonText}>Delete</Text>
                  </Pressable>
                </View>
              </Pressable>
            ))
          )}

          {/* Info Card */}
          <View style={styles.infoCard}>
            <IconSymbol name="info.circle.fill" color={colors.primary} size={24} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Native Integration Required</Text>
              <Text style={styles.infoText}>
                Direct voicemail access requires native iOS/Android modules. This UI demonstrates the interface that can be connected to native APIs or a backend service.
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerStats: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  statCardHighlight: {
    backgroundColor: colors.primary,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    padding: 0,
  },
  scrollView: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  listContainerWithTabBar: {
    paddingBottom: 100,
  },
  voicemailCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  voicemailCardPressed: {
    opacity: 0.7,
  },
  voicemailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  voicemailInfo: {
    flex: 1,
  },
  callerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  newBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.highlight,
  },
  callerName: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.text,
  },
  callerNameBold: {
    fontWeight: '700',
  },
  phoneNumber: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  voicemailMeta: {
    alignItems: 'flex-end',
    gap: 6,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  duration: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  transcriptionContainer: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  transcription: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  voicemailActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    alignItems: 'center',
    gap: 4,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  headerButtonContainer: {
    padding: 6,
  },
});
