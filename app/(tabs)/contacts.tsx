
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Platform, Alert, Pressable, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/IconSymbol";
import { GlassView } from "expo-glass-effect";
import { useTheme } from "@react-navigation/native";
import { Button } from "@/components/button";
import * as Haptics from "expo-haptics";
import * as Contacts from "expo-contacts";
import { colors } from "@/styles/commonStyles";

interface Contact {
  id: string;
  name: string;
  phoneNumbers: string[];
  emails?: string[];
}

interface CallLogEntry {
  id: string;
  name: string;
  phoneNumber: string;
  type: 'incoming' | 'outgoing' | 'missed';
  duration: string;
  timestamp: Date;
}

export default function ContactsScreen() {
  const theme = useTheme();
  const [hasContactsPermission, setHasContactsPermission] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [callHistory, setCallHistory] = useState<CallLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'contacts' | 'history'>('contacts');

  // Mock call history data (since React Native doesn't have direct call log access)
  const mockCallHistory: CallLogEntry[] = [
    {
      id: '1',
      name: 'John Smith',
      phoneNumber: '+1 (555) 123-4567',
      type: 'incoming',
      duration: '5:23',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      phoneNumber: '+1 (555) 987-6543',
      type: 'outgoing',
      duration: '2:15',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    },
    {
      id: '3',
      name: 'Unknown',
      phoneNumber: '+1 (555) 456-7890',
      type: 'missed',
      duration: '0:00',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
    {
      id: '4',
      name: 'Dr. Williams',
      phoneNumber: '+1 (555) 234-5678',
      type: 'incoming',
      duration: '8:45',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      id: '5',
      name: 'Mom',
      phoneNumber: '+1 (555) 111-2222',
      type: 'outgoing',
      duration: '15:30',
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
    },
  ];

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      const { status } = await Contacts.getPermissionsAsync();
      setHasContactsPermission(status === 'granted');
      
      if (status === 'granted') {
        loadContacts();
        setCallHistory(mockCallHistory);
      }
    } catch (error) {
      console.log('Error checking permissions:', error);
    }
  };

  const requestContactsPermission = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    try {
      setIsLoading(true);
      const { status } = await Contacts.requestPermissionsAsync();
      
      if (status === 'granted') {
        setHasContactsPermission(true);
        await loadContacts();
        setCallHistory(mockCallHistory);
        Alert.alert('Success', 'Contacts permission granted!');
      } else {
        Alert.alert(
          'Permission Denied',
          'Please enable contacts permission in your device settings to view contacts and call history.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
      }
    } catch (error) {
      console.log('Error requesting permission:', error);
      Alert.alert('Error', 'Failed to request contacts permission');
    } finally {
      setIsLoading(false);
    }
  };

  const loadContacts = async () => {
    try {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails],
      });

      if (data.length > 0) {
        const formattedContacts: Contact[] = data
          .filter(contact => contact.phoneNumbers && contact.phoneNumbers.length > 0)
          .map(contact => ({
            id: contact.id,
            name: contact.name || 'Unknown',
            phoneNumbers: contact.phoneNumbers?.map(phone => phone.number || '') || [],
            emails: contact.emails?.map(email => email.email || '') || [],
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setContacts(formattedContacts);
        console.log(`Loaded ${formattedContacts.length} contacts`);
      }
    } catch (error) {
      console.log('Error loading contacts:', error);
      Alert.alert('Error', 'Failed to load contacts');
    }
  };

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
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleCallPress = (phoneNumber: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    const phoneUrl = `tel:${phoneNumber.replace(/[^0-9+]/g, '')}`;
    Linking.canOpenURL(phoneUrl)
      .then(supported => {
        if (supported) {
          Linking.openURL(phoneUrl);
        } else {
          Alert.alert('Error', 'Unable to make phone calls on this device');
        }
      })
      .catch(err => console.log('Error opening phone:', err));
  };

  const getCallTypeIcon = (type: string) => {
    switch (type) {
      case 'incoming':
        return 'phone.arrow.down.left';
      case 'outgoing':
        return 'phone.arrow.up.right';
      case 'missed':
        return 'phone.down.fill';
      default:
        return 'phone.fill';
    }
  };

  const getCallTypeColor = (type: string) => {
    switch (type) {
      case 'incoming':
        return colors.success;
      case 'outgoing':
        return colors.primary;
      case 'missed':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const renderPermissionRequest = () => (
    <View style={styles.permissionContainer}>
      <IconSymbol name="person.crop.circle.badge.exclamationmark" size={80} color={colors.primary} />
      <Text style={[styles.permissionTitle, { color: theme.colors.text }]}>
        Contacts & Call Log Access
      </Text>
      <Text style={[styles.permissionText, { color: colors.textSecondary }]}>
        To display your contacts and call history, we need permission to access your contacts.
      </Text>
      <Text style={[styles.permissionNote, { color: colors.textSecondary }]}>
        Note: Call log access is limited on iOS and Android. This app will display available call information.
      </Text>
      <Button
        onPress={requestContactsPermission}
        variant="primary"
        loading={isLoading}
        style={styles.permissionButton}
      >
        Grant Contacts Permission
      </Button>
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      <Pressable
        style={[
          styles.tab,
          activeTab === 'contacts' && styles.tabActive,
        ]}
        onPress={() => {
          if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          setActiveTab('contacts');
        }}
      >
        <IconSymbol
          name="person.2.fill"
          size={20}
          color={activeTab === 'contacts' ? colors.primary : colors.textSecondary}
        />
        <Text
          style={[
            styles.tabText,
            { color: activeTab === 'contacts' ? colors.primary : colors.textSecondary },
          ]}
        >
          Contacts ({contacts.length})
        </Text>
      </Pressable>

      <Pressable
        style={[
          styles.tab,
          activeTab === 'history' && styles.tabActive,
        ]}
        onPress={() => {
          if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          setActiveTab('history');
        }}
      >
        <IconSymbol
          name="clock.fill"
          size={20}
          color={activeTab === 'history' ? colors.primary : colors.textSecondary}
        />
        <Text
          style={[
            styles.tabText,
            { color: activeTab === 'history' ? colors.primary : colors.textSecondary },
          ]}
        >
          History ({callHistory.length})
        </Text>
      </Pressable>
    </View>
  );

  const renderContacts = () => (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[
        styles.listContainer,
        Platform.OS !== 'ios' && styles.listContainerWithTabBar,
      ]}
      showsVerticalScrollIndicator={false}
    >
      {contacts.length === 0 ? (
        <View style={styles.emptyState}>
          <IconSymbol name="person.crop.circle" size={64} color={colors.textSecondary} />
          <Text style={[styles.emptyStateTitle, { color: theme.colors.text }]}>
            No Contacts
          </Text>
          <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
            No contacts found on your device
          </Text>
        </View>
      ) : (
        contacts.map((contact) => (
          <GlassView
            key={contact.id}
            style={[
              styles.contactCard,
              Platform.OS !== 'ios' && { backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
            ]}
            glassEffectStyle="regular"
          >
            <View style={styles.contactHeader}>
              <View style={styles.contactAvatar}>
                <IconSymbol name="person.fill" size={24} color={colors.primary} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={[styles.contactName, { color: theme.colors.text }]}>
                  {contact.name}
                </Text>
                {contact.phoneNumbers.map((phone, index) => (
                  <Text key={index} style={[styles.contactPhone, { color: colors.textSecondary }]}>
                    {phone}
                  </Text>
                ))}
                {contact.emails && contact.emails.length > 0 && (
                  <Text style={[styles.contactEmail, { color: colors.textSecondary }]}>
                    {contact.emails[0]}
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.contactActions}>
              <Pressable
                style={styles.contactActionButton}
                onPress={() => handleCallPress(contact.phoneNumbers[0])}
              >
                <IconSymbol name="phone.fill" size={20} color={colors.primary} />
                <Text style={[styles.contactActionText, { color: colors.primary }]}>Call</Text>
              </Pressable>
            </View>
          </GlassView>
        ))
      )}

      <View style={styles.infoCard}>
        <IconSymbol name="info.circle.fill" size={24} color={colors.primary} />
        <View style={styles.infoContent}>
          <Text style={[styles.infoTitle, { color: theme.colors.text }]}>
            Contacts Integration
          </Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            Contacts are loaded from your device. Changes made in your device&apos;s contacts app will be reflected here.
          </Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderCallHistory = () => (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[
        styles.listContainer,
        Platform.OS !== 'ios' && styles.listContainerWithTabBar,
      ]}
      showsVerticalScrollIndicator={false}
    >
      {callHistory.length === 0 ? (
        <View style={styles.emptyState}>
          <IconSymbol name="phone.fill" size={64} color={colors.textSecondary} />
          <Text style={[styles.emptyStateTitle, { color: theme.colors.text }]}>
            No Call History
          </Text>
          <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
            No call history available
          </Text>
        </View>
      ) : (
        callHistory.map((call) => (
          <GlassView
            key={call.id}
            style={[
              styles.callCard,
              Platform.OS !== 'ios' && { backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
            ]}
            glassEffectStyle="regular"
          >
            <View style={styles.callHeader}>
              <View style={[styles.callTypeIcon, { backgroundColor: `${getCallTypeColor(call.type)}20` }]}>
                <IconSymbol
                  name={getCallTypeIcon(call.type)}
                  size={20}
                  color={getCallTypeColor(call.type)}
                />
              </View>
              <View style={styles.callInfo}>
                <Text style={[styles.callName, { color: theme.colors.text }]}>
                  {call.name}
                </Text>
                <Text style={[styles.callPhone, { color: colors.textSecondary }]}>
                  {call.phoneNumber}
                </Text>
              </View>
              <View style={styles.callMeta}>
                <Text style={[styles.callTime, { color: colors.textSecondary }]}>
                  {formatTimestamp(call.timestamp)}
                </Text>
                {call.duration !== '0:00' && (
                  <Text style={[styles.callDuration, { color: colors.textSecondary }]}>
                    {call.duration}
                  </Text>
                )}
              </View>
            </View>
            <Pressable
              style={styles.callBackButton}
              onPress={() => handleCallPress(call.phoneNumber)}
            >
              <IconSymbol name="phone.fill" size={18} color={colors.primary} />
              <Text style={[styles.callBackText, { color: colors.primary }]}>Call Back</Text>
            </Pressable>
          </GlassView>
        ))
      )}

      <View style={styles.infoCard}>
        <IconSymbol name="info.circle.fill" size={24} color={colors.primary} />
        <View style={styles.infoContent}>
          <Text style={[styles.infoTitle, { color: theme.colors.text }]}>
            Call Log Limitations
          </Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            Direct call log access is restricted on iOS and Android for privacy reasons. This is simulated data. For production, integrate with a backend service or native module.
          </Text>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <IconSymbol name="person.2.crop.square.stack" size={40} color={colors.primary} />
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            Contacts & History
          </Text>
        </View>

        {!hasContactsPermission ? (
          renderPermissionRequest()
        ) : (
          <>
            {renderTabs()}
            {activeTab === 'contacts' ? renderContacts() : renderCallHistory()}
          </>
        )}
      </View>
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
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  permissionNote: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  permissionButton: {
    marginTop: 16,
    minWidth: 250,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.card,
    gap: 8,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  tabActive: {
    backgroundColor: `${colors.primary}15`,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
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
  contactCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: {
    flex: 1,
    gap: 4,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
  },
  contactPhone: {
    fontSize: 14,
  },
  contactEmail: {
    fontSize: 12,
  },
  contactActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  contactActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  contactActionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  callCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  callHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  callTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callInfo: {
    flex: 1,
    gap: 4,
  },
  callName: {
    fontSize: 16,
    fontWeight: '600',
  },
  callPhone: {
    fontSize: 14,
  },
  callMeta: {
    alignItems: 'flex-end',
    gap: 4,
  },
  callTime: {
    fontSize: 12,
  },
  callDuration: {
    fontSize: 12,
    fontWeight: '600',
  },
  callBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: `${colors.primary}15`,
  },
  callBackText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
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
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    lineHeight: 18,
  },
});
