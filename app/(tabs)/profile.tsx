import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { Menu, Clock } from 'lucide-react-native';
import SideMenu from '@/components/SideMenu';
import { useTheme } from '@/contexts/ThemeContext';

export default function AboutScreen() {
  const { theme, isDark } = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.surfaceSecondary }]}>
      <StatusBar barStyle="light-content" backgroundColor={isDark ? '#7B2D26' : '#A93226'} />

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

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.titleSection}>
          <Text style={[styles.pageTitle, { color: theme.colors.text }]}>About the App</Text>
          <View style={[styles.titleUnderline, { backgroundColor: theme.colors.primary }]} />
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Content</Text>
          <View style={[styles.cardDivider, { backgroundColor: theme.colors.border }]} />

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>The Texts</Text>
            <Text style={[styles.sectionText, { color: theme.colors.textSecondary }]}>
              The biblical texts in this document are mostly derived from the ABTAB Assyrian Bible Translation as done by the Aramaic Bible Project. Others are taken straight from the Assyrian Bible in modern Syriac, published in 1984.
            </Text>
            <Text style={[styles.sectionText, { color: theme.colors.textSecondary, marginTop: 8 }]}>
              The English version used is the English Revised Translation. The Transliterated text is done automatically through the Assyrian Texts.
            </Text>
          </View>

          <View style={[styles.sectionDivider, { backgroundColor: theme.colors.border }]} />

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Ecclesiastical Calendar</Text>
            <Text style={[styles.sectionText, { color: theme.colors.textSecondary }]}>
              The calendar is the exact same as our yearly Calendar as provided on acote.church and covers all commemorations, fasts, rogations, feasts and holidays which we celebrate every year.
            </Text>
          </View>

          <View style={[styles.sectionDivider, { backgroundColor: theme.colors.border }]} />

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Readings</Text>
            <Text style={[styles.sectionText, { color: theme.colors.textSecondary }]}>
              The readings are allotted according to the official ACOE Lectionary. We currently support the Sunday readings only, but are working on the development of a Daily Reading Cycle which relates to the time of the year, the Sunday readings and any event that is occurring.
            </Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.surface, marginTop: 16 }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>The App</Text>
          <View style={[styles.cardDivider, { backgroundColor: theme.colors.border }]} />

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Version</Text>
            <Text style={[styles.sectionText, { color: theme.colors.textSecondary }]}>
              This version is still a mock-up, but will soon be a draft.
            </Text>
            <Text style={[styles.versionNumber, { color: theme.colors.textSecondary }]}>Version 1.0.0</Text>
          </View>
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
  scrollContent: {
    flex: 1,
  },
  titleSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '400',
    marginBottom: 16,
  },
  titleUnderline: {
    width: 60,
    height: 3,
    borderRadius: 2,
  },
  card: {
    marginHorizontal: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '400',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  cardDivider: {
    height: 1,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  section: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 22,
  },
  sectionDivider: {
    height: 1,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  versionNumber: {
    fontSize: 14,
    marginTop: 12,
    opacity: 0.7,
  },
  bottomSpacer: {
    height: 32,
  },
});
