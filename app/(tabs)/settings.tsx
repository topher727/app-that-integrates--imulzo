
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Platform, TextInput, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/IconSymbol";
import { GlassView } from "expo-glass-effect";
import { useTheme } from "@react-navigation/native";
import { Button } from "@/components/button";
import * as Haptics from "expo-haptics";

export default function SettingsScreen() {
  const theme = useTheme();
  const [webhookUrl, setWebhookUrl] = useState("");
  const [savedWebhookUrl, setSavedWebhookUrl] = useState("");

  const handleSaveWebhook = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    if (!webhookUrl.trim()) {
      Alert.alert("Error", "Please enter a webhook URL");
      return;
    }

    // Basic URL validation
    try {
      new URL(webhookUrl);
      setSavedWebhookUrl(webhookUrl);
      Alert.alert("Success", "Webhook URL saved successfully!");
      console.log("Webhook URL saved:", webhookUrl);
    } catch (error) {
      Alert.alert("Error", "Please enter a valid URL");
      console.log("Invalid URL:", error);
    }
  };

  const handleClearWebhook = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setWebhookUrl("");
    setSavedWebhookUrl("");
    Alert.alert("Success", "Webhook URL cleared");
    console.log("Webhook URL cleared");
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          Platform.OS !== 'ios' && styles.contentContainerWithTabBar
        ]}
      >
        <View style={styles.header}>
          <IconSymbol name="gear" size={40} color={theme.colors.primary} />
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Settings</Text>
        </View>

        <GlassView 
          style={[
            styles.section,
            Platform.OS !== 'ios' && { backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
          ]} 
          glassEffectStyle="regular"
        >
          <View style={styles.sectionHeader}>
            <IconSymbol name="link" size={24} color={theme.colors.primary} />
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Webhook Configuration</Text>
          </View>
          
          <Text style={[styles.label, { color: theme.dark ? '#98989D' : '#666' }]}>
            Webhook URL
          </Text>
          
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                color: theme.colors.text,
                borderColor: theme.dark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
              }
            ]}
            placeholder="https://example.com/webhook"
            placeholderTextColor={theme.dark ? '#666' : '#999'}
            value={webhookUrl}
            onChangeText={setWebhookUrl}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
          />

          {savedWebhookUrl ? (
            <View style={styles.savedUrlContainer}>
              <IconSymbol name="checkmark.circle.fill" size={20} color="#4caf50" />
              <Text style={[styles.savedUrlText, { color: theme.dark ? '#98989D' : '#666' }]}>
                Saved: {savedWebhookUrl}
              </Text>
            </View>
          ) : null}

          <View style={styles.buttonContainer}>
            <Button
              onPress={handleSaveWebhook}
              variant="primary"
              style={styles.saveButton}
            >
              Save Webhook URL
            </Button>

            {savedWebhookUrl ? (
              <Button
                onPress={handleClearWebhook}
                variant="secondary"
                style={styles.clearButton}
              >
                Clear Webhook URL
              </Button>
            ) : null}
          </View>

          <Text style={[styles.helpText, { color: theme.dark ? '#666' : '#999' }]}>
            Enter a webhook URL to receive voicemail notifications and updates. The webhook will be called when new voicemails are received.
          </Text>
        </GlassView>

        <GlassView 
          style={[
            styles.section,
            Platform.OS !== 'ios' && { backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
          ]} 
          glassEffectStyle="regular"
        >
          <View style={styles.sectionHeader}>
            <IconSymbol name="info.circle" size={24} color={theme.colors.primary} />
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>About</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.dark ? '#98989D' : '#666' }]}>App Name:</Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>myID</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.dark ? '#98989D' : '#666' }]}>Version:</Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>1.0.0</Text>
          </View>
        </GlassView>
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
    padding: 20,
  },
  contentContainerWithTabBar: {
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  section: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  savedUrlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  savedUrlText: {
    fontSize: 14,
    flex: 1,
  },
  buttonContainer: {
    gap: 12,
    marginTop: 8,
  },
  saveButton: {
    width: '100%',
  },
  clearButton: {
    width: '100%',
  },
  helpText: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
  },
});
