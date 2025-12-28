import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Menu, Clock, Sun, Moon } from 'lucide-react-native';
import SideMenu from '@/components/SideMenu';
import { useTheme } from '@/contexts/ThemeContext';

export default function HomeScreen() {
  const { theme, isDark } = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);
  const mediaItems = [
    {
      id: 1,
      title: 'Double Edged Sword Podcast',
      subtitle: 'Episode 136: Contentious are not always destructive',
      duration: '28 min',
      image: 'https://images.pexels.com/photos/7428100/pexels-photo-7428100.jpeg?auto=compress&cs=tinysrgb&w=200&h=200',
    },
    {
      id: 2,
      title: 'Vision of Hope',
      subtitle: 'Acts: 15:31-35 (Assyrian)',
      duration: '31 min',
      image: 'https://images.pexels.com/photos/3205570/pexels-photo-3205570.jpeg?auto=compress&cs=tinysrgb&w=200&h=200',
    },
    {
      id: 3,
      title: 'Double Edged Sword Podcast',
      subtitle: 'Episode 135: Parish unity in the early Church',
      duration: '26 min',
      image: 'https://images.pexels.com/photos/7428100/pexels-photo-7428100.jpeg?auto=compress&cs=tinysrgb&w=200&h=200',
    },
    {
      id: 4,
      title: 'Double Edged Sword Podcast',
      subtitle: 'Episode 134: The Apostles right to the believers in Antioch',
      duration: '29 min',
      image: 'https://images.pexels.com/photos/7428100/pexels-photo-7428100.jpeg?auto=compress&cs=tinysrgb&w=200&h=200',
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.surfaceSecondary }]}>
      <StatusBar barStyle="light-content" backgroundColor="#A93226" />

      <View style={[styles.header, { backgroundColor: isDark ? '#7B2D26' : '#A93226' }]}>
        <View style={styles.headerLeft}>
          <View style={styles.logoContainer}>
            <Clock size={28} color="#FFFFFF" />
          </View>
          <Text style={styles.assyrianText}>ܐܥܕܬܐ</Text>
        </View>
        <TouchableOpacity style={styles.menuButton} onPress={() => setMenuVisible(true)}>
          <Menu size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.todaySection, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.todayTitle, { color: theme.colors.text }]}>Today</Text>
          <View style={[styles.seasonsCard, { backgroundColor: isDark ? '#2D2D2D' : '#1F2937' }]}>
            <Text style={styles.seasonsTitle}>Elijah and Cross Seasons</Text>
            <Text style={styles.seasonsSubtitle}>The Seventh Sunday of Elijah,</Text>
            <Text style={styles.seasonsDate}>October 6th</Text>
          </View>
        </View>

        <View style={[styles.greetingSection, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.greetingRow}>
            {isDark ? <Moon size={20} color="#6B7280" /> : <Sun size={20} color="#F59E0B" />}
            <Text style={[styles.greetingText, { color: theme.colors.text }]}>
              {isDark ? 'Good Evening' : 'Good Morning'}
            </Text>
          </View>
        </View>

        <View style={[styles.verseCard, { backgroundColor: isDark ? '#3D2A2A' : '#5C1F33' }]}>
          <View style={styles.verseHeader}>
            <Text style={styles.verseTitle}>Verse of the Day</Text>
            <Text style={styles.verseReference}>Romans 8:11 ESV</Text>
          </View>
          <Text style={styles.verseText}>
            If the Spirit of him who raised Jesus from the dead dwells in you, he who raised Christ Jesus from the dead will also give life to your mortal bodies through his Spirit who dwells in you.
          </Text>
          <Text style={styles.verseAssyrian}>
            ܡܶܢ ܕܪܽܘܚܶܗ ܕܗܰܘ ܕܰܐܩܺܝܡ ܠܝܶܫܽܘܥ ܡܶܢ ܒܶܝܬ ܡܺܝܬܶ̈ܐ ܥܳܡܪܳܐ ܒܟ݂ܽܘܢ܇ ܗ̱ܽܘ ܕܰܐܩܺܝܡ ܠܰܡܫܺܝܚܳܐ ܡܶܢ ܒܶܝܬ ܡܺܝܬܶ̈ܐ܇ ܐܳܦ݂ ܠܦ݂ܰܓ̣ܪܰܝܟ݁ܽܘܢ ܡܳܝܽܘܬܶ̈ܐ ܢܰܚܶܐ ܒܪܽܘܚܶܗ ܕܥܳܡܪܳܐ ܒܟ݂ܽܘܢ܀
          </Text>
        </View>

        <View style={styles.mediaSection}>
          <View style={styles.mediaSectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Latest Media</Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: theme.colors.primary }]}>See all</Text>
            </TouchableOpacity>
          </View>

          {mediaItems.map((item) => (
            <TouchableOpacity key={item.id} style={[styles.mediaCard, { backgroundColor: theme.colors.surface }]}>
              <Image
                source={{ uri: item.image }}
                style={[styles.mediaImage, { backgroundColor: theme.colors.border }]}
              />
              <View style={styles.mediaContent}>
                <Text style={[styles.mediaTitle, { color: theme.colors.text }]}>{item.title}</Text>
                <Text style={[styles.mediaSubtitle, { color: theme.colors.textSecondary }]}>{item.subtitle}</Text>
              </View>
              <View style={styles.mediaDuration}>
                <Clock size={14} color={theme.colors.textSecondary} />
                <Text style={[styles.mediaDurationText, { color: theme.colors.textSecondary }]}>{item.duration}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <SideMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  assyrianText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
  menuButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  todaySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginBottom: 16,
  },
  todayTitle: {
    fontSize: 32,
    fontWeight: '700',
  },
  seasonsCard: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  seasonsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  seasonsSubtitle: {
    fontSize: 12,
    color: '#D1D5DB',
    marginBottom: 2,
  },
  seasonsDate: {
    fontSize: 12,
    color: '#D1D5DB',
  },
  greetingSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 16,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  greetingText: {
    fontSize: 18,
    fontWeight: '600',
  },
  verseCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  verseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  verseTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  verseReference: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  verseText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  verseAssyrian: {
    fontSize: 16,
    lineHeight: 28,
    color: '#FFFFFF',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  mediaSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  mediaSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  mediaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  mediaImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
  },
  mediaContent: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  mediaTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  mediaSubtitle: {
    fontSize: 12,
    lineHeight: 18,
  },
  mediaDuration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mediaDurationText: {
    fontSize: 12,
  },
  bottomSpacer: {
    height: 20,
  },
});
