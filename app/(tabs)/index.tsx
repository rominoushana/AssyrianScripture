import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Modal, Pressable } from 'react-native';
import { ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import { useLocalSearchParams } from 'expo-router';
import { getLiturgicalEvents, getBibleVerses, parseReference, BibleVerse, LiturgicalEvent } from '@/lib/supabase';
import { useTheme } from '@/contexts/ThemeContext';

type LanguageType = 'ASY' | 'ENG' | 'TSL';
type ReadingType = 'Lct. 1' | 'Lct. 2' | 'Apst' | 'Gospel';

export default function ReadingsScreen() {
  const { theme, isDark } = useTheme();
  const { eventIndex } = useLocalSearchParams<{ eventIndex?: string }>();
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageType>('ASY');
  const [selectedReading, setSelectedReading] = useState<ReadingType>('Gospel');
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [liturgicalEvents, setLiturgicalEvents] = useState<LiturgicalEvent[]>([]);
  const [displayedVerses, setDisplayedVerses] = useState<BibleVerse[]>([]);
  const [loading, setLoading] = useState(true);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());

  useEffect(() => {
    loadLiturgicalEvents();
  }, []);

  useEffect(() => {
    if (eventIndex && liturgicalEvents.length > 0) {
      const index = parseInt(eventIndex, 10);
      if (!isNaN(index) && index >= 0 && index < liturgicalEvents.length) {
        setCurrentEventIndex(index);
      }
    }
  }, [eventIndex, liturgicalEvents]);

  useEffect(() => {
    if (liturgicalEvents.length > 0) {
      loadVerses();
    }
  }, [currentEventIndex, selectedReading, liturgicalEvents]);

  const loadLiturgicalEvents = async () => {
    try {
      const events = await getLiturgicalEvents(2025);
      setLiturgicalEvents(events);
      setLoading(false);
    } catch (error) {
      console.error('Error loading liturgical events:', error);
      setLoading(false);
    }
  };

  const loadVerses = async () => {
    if (liturgicalEvents.length === 0) return;

    const currentEvent = liturgicalEvents[currentEventIndex];
    let reference = '';

    switch (selectedReading) {
      case 'Lct. 1':
        reference = currentEvent.lection_1;
        break;
      case 'Lct. 2':
        reference = currentEvent.lection_2;
        break;
      case 'Apst':
        reference = currentEvent.epistle;
        break;
      case 'Gospel':
        reference = currentEvent.gospel;
        break;
    }

    if (!reference) {
      setDisplayedVerses([]);
      return;
    }

    const parsed = parseReference(reference);
    if (!parsed) {
      setDisplayedVerses([]);
      return;
    }

    try {
      const verses = await getBibleVerses(
        parsed.book,
        parsed.chapter,
        parsed.startVerse,
        parsed.endVerse
      );
      setDisplayedVerses(verses);
    } catch (error) {
      console.error('Error loading verses:', error);
      setDisplayedVerses([]);
    }
  };

  const goToPreviousEvent = () => {
    if (currentEventIndex > 0) {
      setCurrentEventIndex(currentEventIndex - 1);
    }
  };

  const goToNextEvent = () => {
    if (currentEventIndex < liturgicalEvents.length - 1) {
      setCurrentEventIndex(currentEventIndex + 1);
    }
  };

  const openCalendar = () => {
    if (liturgicalEvents.length > 0) {
      const currentEvent = liturgicalEvents[currentEventIndex];
      setCalendarDate(new Date(currentEvent.date + 'T00:00:00'));
    }
    setCalendarVisible(true);
  };

  const selectDateFromCalendar = (day: number) => {
    const selectedDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day);
    const dateString = selectedDate.toISOString().split('T')[0];

    const eventIdx = liturgicalEvents.findIndex(e => e.date === dateString);
    if (eventIdx !== -1) {
      setCurrentEventIndex(eventIdx);
      setCalendarVisible(false);
    } else {
      let closestIndex = 0;
      let closestDiff = Infinity;
      liturgicalEvents.forEach((event, index) => {
        const eventDate = new Date(event.date + 'T00:00:00');
        const diff = Math.abs(eventDate.getTime() - selectedDate.getTime());
        if (diff < closestDiff) {
          closestDiff = diff;
          closestIndex = index;
        }
      });
      setCurrentEventIndex(closestIndex);
      setCalendarVisible(false);
    }
  };

  const changeCalendarMonth = (delta: number) => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + delta, 1));
  };

  const getCalendarDays = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const hasEventOnDay = (day: number) => {
    const dateString = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day)
      .toISOString().split('T')[0];
    return liturgicalEvents.some(e => e.date === dateString);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  };

  const getReadingTitle = () => {
    if (displayedVerses.length === 0) return '';

    const bookName = displayedVerses[0].book;

    switch (selectedLanguage) {
      case 'ASY':
        if (bookName === 'Matthew') return 'ܐܘܢܓܠܝܘܢ ܕܡܬܝ';
        if (bookName === 'Mark') return 'ܐܘܢܓܠܝܘܢ ܕܡܪܩܘܣ';
        if (bookName === 'Luke') return 'ܐܘܢܓܠܝܘܢ ܕܠܘܩܐ';
        if (bookName === 'John') return 'ܐܘܢܓܠܝܘܢ ܕܝܘܚܢܢ';
        return bookName;
      case 'ENG':
        return `Gospel of ${bookName}`;
      case 'TSL':
        if (bookName === 'Matthew') return "Ewangelion d'Matay";
        if (bookName === 'Mark') return "Ewangelion d'Marqos";
        if (bookName === 'Luke') return "Ewangelion d'Luqa";
        if (bookName === 'John') return "Ewangelion d'Yokhanan";
        return bookName;
    }
  };

  const getVerseText = (verse: BibleVerse) => {
    switch (selectedLanguage) {
      case 'ASY':
        return verse.assyrian;
      case 'ENG':
        return verse.english;
      case 'TSL':
        return verse.transliteration;
    }
  };

  const getVerseReference = () => {
    if (displayedVerses.length === 0) return '';
    const first = displayedVerses[0];
    const last = displayedVerses[displayedVerses.length - 1];
    if (first.verse === last.verse) {
      return `${first.chapter}:${first.verse}`;
    }
    return `${first.chapter}:${first.verse}-${last.verse}`;
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <StatusBar barStyle="light-content" backgroundColor={theme.colors.headerBackground} />
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (liturgicalEvents.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <StatusBar barStyle="light-content" backgroundColor={theme.colors.headerBackground} />
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>No liturgical events found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentEvent = liturgicalEvents[currentEventIndex];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.headerBackground} />

      <View style={[styles.header, { backgroundColor: theme.colors.headerBackground }]}>
        <View style={styles.dateNavigation}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={goToPreviousEvent}
            disabled={currentEventIndex === 0}>
            <ChevronLeft
              size={24}
              color={currentEventIndex === 0 ? 'rgba(255,255,255,0.5)' : '#FFFFFF'}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.dateContainer} onPress={openCalendar}>
            <Text style={styles.dateText}>{formatDate(currentEvent.date)}</Text>
            <Text style={styles.occasionText}>{currentEvent.feast_name}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navButton}
            onPress={goToNextEvent}
            disabled={currentEventIndex === liturgicalEvents.length - 1}>
            <ChevronRight
              size={24}
              color={currentEventIndex === liturgicalEvents.length - 1 ? 'rgba(255,255,255,0.5)' : '#FFFFFF'}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.tabsContainer, { backgroundColor: theme.colors.surfaceSecondary, borderBottomColor: theme.colors.border }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.readingTabsScroll}>
          {(['Lct. 1', 'Lct. 2', 'Apst', 'Gospel'] as ReadingType[]).map((reading) => (
            <TouchableOpacity
              key={reading}
              style={[
                styles.readingTab,
                selectedReading === reading && styles.activeReadingTab
              ]}
              onPress={() => setSelectedReading(reading)}>
              <Text style={[
                styles.readingTabText,
                { color: theme.colors.textSecondary },
                selectedReading === reading && { color: theme.colors.primary }
              ]}>
                {reading}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={[styles.languageTabsContainer, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        {(['ASY', 'TSL', 'ENG'] as LanguageType[]).map((lang) => (
          <TouchableOpacity
            key={lang}
            style={[
              styles.languageTab,
              selectedLanguage === lang && styles.activeLanguageTab
            ]}
            onPress={() => setSelectedLanguage(lang)}>
            <Text style={[
              styles.languageTabText,
              { color: theme.colors.textSecondary },
              selectedLanguage === lang && { color: theme.colors.primary, fontWeight: '700' }
            ]}>
              {lang}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.contentHeader, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        {selectedLanguage === 'ASY' ? (
          <>
            <Text style={[styles.verseReference, { color: theme.colors.textSecondary }]}>{getVerseReference()}</Text>
            <Text style={[styles.contentTitle, styles.assyrianTitle, { color: theme.colors.text }]}>
              {getReadingTitle()}
            </Text>
          </>
        ) : (
          <>
            <Text style={[styles.contentTitle, { color: theme.colors.text }]}>
              {getReadingTitle()}
            </Text>
            <Text style={[styles.verseReference, { color: theme.colors.textSecondary }]}>{getVerseReference()}</Text>
          </>
        )}
      </View>

      <ScrollView
        style={[styles.scrollContent, { backgroundColor: theme.colors.background }]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.versesContainer}>
          {displayedVerses.length === 0 ? (
            <Text style={[styles.noDataText, { color: theme.colors.textSecondary }]}>No verses available for this reading.</Text>
          ) : (
            displayedVerses.map((verse) => (
              <View key={verse.id} style={[
                styles.verseRow,
                selectedLanguage === 'ASY' && styles.assyrianVerseRow
              ]}>
                {selectedLanguage === 'ASY' ? (
                  <>
                    <Text style={[
                      styles.verseText,
                      styles.assyrianVerseText,
                      { color: theme.colors.text }
                    ]}>
                      {getVerseText(verse)}
                    </Text>
                    <Text style={[styles.verseNumber, styles.assyrianVerseNumber, { color: theme.colors.primary }]}>{verse.verse}</Text>
                  </>
                ) : (
                  <>
                    <Text style={[styles.verseNumber, { color: theme.colors.primary }]}>{verse.verse}</Text>
                    <Text style={[
                      styles.verseText,
                      selectedLanguage === 'TSL' && styles.transliterationText,
                      { color: theme.colors.text }
                    ]}>
                      {getVerseText(verse)}
                    </Text>
                  </>
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <Modal
        visible={calendarVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCalendarVisible(false)}>
        <Pressable style={[styles.modalOverlay, { backgroundColor: theme.colors.modalOverlay }]} onPress={() => setCalendarVisible(false)}>
          <Pressable style={[styles.calendarModal, { backgroundColor: theme.colors.surface }]} onPress={(e) => e.stopPropagation()}>
            <View style={styles.calendarHeader}>
              <TouchableOpacity onPress={() => changeCalendarMonth(-1)} style={styles.calendarNavBtn}>
                <ChevronLeft size={24} color={theme.colors.text} />
              </TouchableOpacity>
              <Text style={[styles.calendarMonthText, { color: theme.colors.text }]}>
                {calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </Text>
              <TouchableOpacity onPress={() => changeCalendarMonth(1)} style={styles.calendarNavBtn}>
                <ChevronRight size={24} color={theme.colors.text} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setCalendarVisible(false)} style={styles.calendarCloseBtn}>
                <X size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <View style={styles.calendarWeekdays}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <Text key={day} style={[styles.calendarWeekdayText, { color: theme.colors.textSecondary }]}>{day}</Text>
              ))}
            </View>
            <View style={styles.calendarDays}>
              {getCalendarDays().map((day, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.calendarDay,
                    day && hasEventOnDay(day) && [styles.calendarDayWithEvent, { backgroundColor: theme.colors.primaryLight }]
                  ]}
                  onPress={() => day && selectDateFromCalendar(day)}
                  disabled={!day}>
                  {day && (
                    <>
                      <Text style={[
                        styles.calendarDayText,
                        { color: theme.colors.text },
                        hasEventOnDay(day) && { color: theme.colors.primary, fontWeight: '600' }
                      ]}>
                        {day}
                      </Text>
                      {hasEventOnDay(day) && <View style={[styles.eventDot, { backgroundColor: theme.colors.primary }]} />}
                    </>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
  },
  noDataText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 32,
  },
  header: {
    paddingBottom: 16,
  },
  dateNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  navButton: {
    padding: 4,
  },
  dateContainer: {
    flex: 1,
    alignItems: 'center',
  },
  dateText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  occasionText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 2,
    opacity: 0.95,
  },
  tabsContainer: {
    borderBottomWidth: 1,
  },
  readingTabsScroll: {
    paddingVertical: 8,
    justifyContent: 'space-evenly',
    flexGrow: 1,
  },
  readingTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeReadingTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#C53030',
  },
  readingTabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  languageTabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'center',
    borderBottomWidth: 1,
  },
  languageTab: {
    paddingHorizontal: 24,
    paddingVertical: 6,
    marginHorizontal: 4,
  },
  activeLanguageTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#C53030',
  },
  languageTabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  contentHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  assyrianTitle: {
    textAlign: 'right',
    fontSize: 20,
    fontFamily: 'EastSyriacMarcus',
  },
  verseReference: {
    fontSize: 14,
    marginLeft: 12,
    marginRight: 12,
  },
  scrollContent: {
    flex: 1,
  },
  versesContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  verseRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  assyrianVerseRow: {
    flexDirection: 'row-reverse',
  },
  verseNumber: {
    fontSize: 16,
    fontWeight: '700',
    marginRight: 12,
    minWidth: 24,
    paddingTop: 2,
  },
  assyrianVerseNumber: {
    marginRight: 0,
    marginLeft: 12,
  },
  verseText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 26,
  },
  assyrianVerseText: {
    fontSize: 18,
    lineHeight: 32,
    textAlign: 'right',
    writingDirection: 'rtl',
    fontFamily: 'EastSyriacMarcus',
  },
  transliterationText: {
    fontStyle: 'italic',
    fontSize: 15,
    lineHeight: 24,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarModal: {
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 360,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarNavBtn: {
    padding: 8,
  },
  calendarMonthText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  calendarCloseBtn: {
    padding: 8,
  },
  calendarWeekdays: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  calendarWeekdayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
  },
  calendarDays: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarDayWithEvent: {
    borderRadius: 20,
  },
  calendarDayText: {
    fontSize: 14,
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
});
