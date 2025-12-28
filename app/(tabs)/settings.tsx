import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Switch, ScrollView, StatusBar } from 'react-native';
import { Moon, Sun, Globe, Bell, ChevronRight, Info } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { theme, isDark, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [dailyReminders, setDailyReminders] = useState(true);

  const SettingsItem = ({ icon, title, subtitle, onPress, showSwitch, switchValue, onSwitchChange }: {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    onPress?: () => void;
    showSwitch?: boolean;
    switchValue?: boolean;
    onSwitchChange?: (value: boolean) => void;
  }) => (
    <TouchableOpacity
      style={[styles.settingsItem, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <View style={styles.itemContent}>
        <Text style={[styles.itemTitle, { color: theme.colors.text }]}>{title}</Text>
        <Text style={[styles.itemSubtitle, { color: theme.colors.textSecondary }]}>{subtitle}</Text>
      </View>
      {showSwitch && (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
          thumbColor={switchValue ? theme.colors.primary : '#FFFFFF'}
        />
      )}
      {!showSwitch && (
        <ChevronRight size={20} color={theme.colors.textSecondary} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'light-content'} backgroundColor={theme.colors.headerBackground} />

      <View style={[styles.header, { backgroundColor: theme.colors.headerBackground }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.headerText }]}>Settings</Text>
      </View>

      <ScrollView style={styles.settingsContainer} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>Notifications</Text>
        <View style={[styles.section, { backgroundColor: theme.colors.surfaceSecondary }]}>
          <SettingsItem
            icon={<Bell size={24} color={theme.colors.primary} />}
            title="Push Notifications"
            subtitle="Receive app notifications"
            showSwitch={true}
            switchValue={notifications}
            onSwitchChange={setNotifications}
          />
          <SettingsItem
            icon={<Bell size={24} color={theme.colors.primary} />}
            title="Daily Reminders"
            subtitle="Get reminded to read daily"
            showSwitch={true}
            switchValue={dailyReminders}
            onSwitchChange={setDailyReminders}
          />
        </View>

        <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>Appearance</Text>
        <View style={[styles.section, { backgroundColor: theme.colors.surfaceSecondary }]}>
          <SettingsItem
            icon={isDark ? <Moon size={24} color={theme.colors.primary} /> : <Sun size={24} color={theme.colors.primary} />}
            title="Dark Mode"
            subtitle="Enable dark theme"
            showSwitch={true}
            switchValue={isDark}
            onSwitchChange={toggleTheme}
          />
        </View>

        <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>Language</Text>
        <View style={[styles.section, { backgroundColor: theme.colors.surfaceSecondary }]}>
          <SettingsItem
            icon={<Globe size={24} color={theme.colors.primary} />}
            title="Default Language"
            subtitle="Set preferred scripture language"
            onPress={() => {}}
          />
        </View>

        <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>About</Text>
        <View style={[styles.section, { backgroundColor: theme.colors.surfaceSecondary }]}>
          <SettingsItem
            icon={<Info size={24} color={theme.colors.primary} />}
            title="About the App"
            subtitle="Learn more about this application"
            onPress={() => router.push('/(tabs)/profile')}
          />
        </View>
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  settingsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 24,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  section: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  iconContainer: {
    marginRight: 16,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
  },
  bottomPadding: {
    height: 40,
  },
});
