
import React from "react";
import { View, Text, StyleSheet, ScrollView, Platform, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/IconSymbol";
import { GlassView } from "expo-glass-effect";
import { useTheme } from "@react-navigation/native";
import { colors } from "@/styles/commonStyles";
import * as Haptics from "expo-haptics";

export default function ProfileScreen() {
  const theme = useTheme();

  const handleOptionPress = (option: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    console.log(`${option} pressed`);
    Alert.alert(option, `${option} feature coming soon!`);
  };

  const profileOptions = [
    {
      icon: 'person.circle.fill',
      title: 'Account Information',
      subtitle: 'View and edit your profile',
      color: colors.primary,
    },
    {
      icon: 'bell.fill',
      title: 'Notifications',
      subtitle: 'Manage notification preferences',
      color: colors.secondary,
    },
    {
      icon: 'lock.fill',
      title: 'Privacy & Security',
      subtitle: 'Control your privacy settings',
      color: colors.warning,
    },
    {
      icon: 'phone.fill',
      title: 'Voicemail Settings',
      subtitle: 'Configure voicemail preferences',
      color: colors.info,
    },
    {
      icon: 'arrow.down.circle.fill',
      title: 'Storage & Data',
      subtitle: 'Manage app storage',
      color: colors.success,
    },
    {
      icon: 'questionmark.circle.fill',
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      color: colors.accent,
    },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          Platform.OS !== 'ios' && styles.contentContainerWithTabBar
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <IconSymbol name="person.crop.circle.fill" size={80} color={colors.primary} />
          </View>
          <Text style={[styles.userName, { color: theme.colors.text }]}>
            John Doe
          </Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
            john.doe@example.com
          </Text>
          <Text style={[styles.userPhone, { color: colors.textSecondary }]}>
            +1 (555) 123-4567
          </Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <IconSymbol name="phone.fill" size={24} color={colors.primary} />
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>24</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Voicemails</Text>
          </View>
          <View style={styles.statCard}>
            <IconSymbol name="person.2.fill" size={24} color={colors.secondary} />
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>156</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Contacts</Text>
          </View>
          <View style={styles.statCard}>
            <IconSymbol name="clock.fill" size={24} color={colors.accent} />
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>48</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Calls Today</Text>
          </View>
        </View>

        {/* Options List */}
        <View style={styles.optionsContainer}>
          {profileOptions.map((option, index) => (
            <Pressable
              key={index}
              onPress={() => handleOptionPress(option.title)}
              style={({ pressed }) => [
                styles.optionCard,
                pressed && styles.optionCardPressed,
              ]}
            >
              <View style={[styles.optionIconContainer, { backgroundColor: `${option.color}20` }]}>
                <IconSymbol name={option.icon} size={24} color={option.color} />
              </View>
              <View style={styles.optionContent}>
                <Text style={[styles.optionTitle, { color: theme.colors.text }]}>
                  {option.title}
                </Text>
                <Text style={[styles.optionSubtitle, { color: colors.textSecondary }]}>
                  {option.subtitle}
                </Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
            </Pressable>
          ))}
        </View>

        {/* App Info */}
        <View style={styles.appInfoContainer}>
          <Text style={[styles.appInfoText, { color: colors.textSecondary }]}>
            myID Voicemail App
          </Text>
          <Text style={[styles.appInfoText, { color: colors.textSecondary }]}>
            Version 1.0.0
          </Text>
          <Text style={[styles.appInfoText, { color: colors.textSecondary }]}>
            © 2024 myID. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  contentContainerWithTabBar: {
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  optionsContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  optionCardPressed: {
    opacity: 0.7,
  },
  optionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionContent: {
    flex: 1,
    gap: 4,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  optionSubtitle: {
    fontSize: 13,
  },
  appInfoContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    gap: 4,
  },
  appInfoText: {
    fontSize: 12,
    textAlign: 'center',
  },
});
