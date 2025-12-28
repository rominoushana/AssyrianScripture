import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, Modal, Pressable, ScrollView } from 'react-native';
import { ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { getLiturgicalEvents, LiturgicalEvent } from '@/lib/supabase';
import { useTheme } from '@/contexts/ThemeContext';

export default function CalendarScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [liturgicalEvents, setLiturgicalEvents] = useState<LiturgicalEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<LiturgicalEvent | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLiturgicalEvents();
  }, []);

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

  const changeMonth = (delta: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1));
  };

  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const days: { day: number; currentMonth: boolean }[] = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, currentMonth: false });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, currentMonth: true });
    }

    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, currentMonth: false });
    }

    return days;
  };

  const getEventForDay = (day: number, isCurrentMonth: boolean): LiturgicalEvent | null => {
    if (!isCurrentMonth) return null;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    return liturgicalEvents.find(e => e.date === dateString) || null;
  };

  const handleDayPress = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return;

    const event = getEventForDay(day, isCurrentMonth);
    if (event) {
      setSelectedEvent(event);
      setModalVisible(true);
    }
  };

  const formatModalDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const navigateToReadings = () => {
    if (!selectedEvent) return;

    const eventIdx = liturgicalEvents.findIndex(e => e.id === selectedEvent.id);
    setModalVisible(false);
    router.push({
      pathname: '/(tabs)',
      params: { eventIndex: eventIdx.toString() }
    });
  };

  const truncateFeastName = (name: string, maxLength: number = 12) => {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength - 2) + '...';
  };

  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const calendarDays = getCalendarDays();
  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.headerBackground} />

      <View style={[styles.header, { backgroundColor: theme.colors.headerBackground }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.headerText }]}>Calendar</Text>
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.titleContainer}>
          <Text style={[styles.pageTitle, { color: theme.colors.text }]}>Ecclesiastical Calendar</Text>
          <View style={[styles.titleDivider, { backgroundColor: theme.colors.border }]} />
        </View>

        <View style={styles.monthNavigation}>
          <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.navButton}>
            <ChevronLeft size={24} color={theme.colors.primary} />
          </TouchableOpacity>
          <Text style={[styles.monthText, { color: theme.colors.primary }]}>{monthYear}</Text>
          <TouchableOpacity onPress={() => changeMonth(1)} style={styles.navButton}>
            <ChevronRight size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.calendarContainer}>
          <View style={[styles.weekdaysRow, { borderBottomColor: theme.colors.border }]}>
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
              <View key={day} style={styles.weekdayCell}>
                <Text style={[styles.weekdayText, { color: theme.colors.textSecondary }]}>{day}</Text>
              </View>
            ))}
          </View>

          {weeks.map((week, weekIndex) => (
            <View key={weekIndex} style={styles.weekRow}>
              {week.map((dayInfo, dayIndex) => {
                const event = getEventForDay(dayInfo.day, dayInfo.currentMonth);
                const hasEvent = event !== null;

                return (
                  <TouchableOpacity
                    key={dayIndex}
                    style={[
                      styles.dayCell,
                      { borderBottomColor: theme.colors.border },
                      hasEvent && { backgroundColor: theme.colors.primaryLight }
                    ]}
                    onPress={() => handleDayPress(dayInfo.day, dayInfo.currentMonth)}
                    disabled={!dayInfo.currentMonth}>
                    <Text style={[
                      styles.dayNumber,
                      { color: theme.colors.text },
                      !dayInfo.currentMonth && { color: isDark ? '#555555' : '#CCCCCC' },
                      dayIndex === 0 && dayInfo.currentMonth && { color: theme.colors.primary }
                    ]}>
                      {dayInfo.day}
                    </Text>
                    {hasEvent && (
                      <View style={[styles.eventBadge, { backgroundColor: isDark ? '#4A2828' : '#FEE2E2' }]}>
                        <Text style={[styles.eventBadgeText, { color: theme.colors.primary }]} numberOfLines={1}>
                          {truncateFeastName(event.feast_name, 10)}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>Loading events...</Text>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <Pressable style={[styles.modalOverlay, { backgroundColor: theme.colors.modalOverlay }]} onPress={() => setModalVisible(false)}>
          <Pressable style={[styles.modalContent, { backgroundColor: theme.colors.surface }]} onPress={(e) => e.stopPropagation()}>
            {selectedEvent && (
              <>
                <View style={[styles.modalHeader, { backgroundColor: theme.colors.headerBackground }]}>
                  <Text style={[styles.modalDate, { color: theme.colors.headerText }]}>{formatModalDate(selectedEvent.date)}</Text>
                  <TouchableOpacity
                    style={styles.modalCloseButton}
                    onPress={() => setModalVisible(false)}>
                    <X size={20} color={theme.colors.headerText} />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalBody}>
                  <Text style={[styles.modalFeastName, { color: theme.colors.text }]}>{selectedEvent.feast_name}</Text>

                  <View style={styles.readingsSection}>
                    <View style={styles.readingsHeader}>
                      <View style={[styles.bulletPoint, { backgroundColor: theme.colors.primary }]} />
                      <Text style={[styles.readingsTitle, { color: theme.colors.text }]}>Readings</Text>
                    </View>

                    <View style={styles.readingsList}>
                      <View style={styles.readingRow}>
                        <View style={[styles.readingBullet, { borderColor: theme.colors.primary }]} />
                        <Text style={[styles.readingLabel, { color: theme.colors.textSecondary }]}>Lection 1</Text>
                        <Text style={[styles.readingValue, { color: theme.colors.text }]}>{selectedEvent.lection_1 || '-'}</Text>
                      </View>
                      <View style={styles.readingRow}>
                        <View style={[styles.readingBullet, { borderColor: theme.colors.primary }]} />
                        <Text style={[styles.readingLabel, { color: theme.colors.textSecondary }]}>Lection 2</Text>
                        <Text style={[styles.readingValue, { color: theme.colors.text }]}>{selectedEvent.lection_2 || '-'}</Text>
                      </View>
                      <View style={styles.readingRow}>
                        <View style={[styles.readingBullet, { borderColor: theme.colors.primary }]} />
                        <Text style={[styles.readingLabel, { color: theme.colors.textSecondary }]}>Apostle</Text>
                        <Text style={[styles.readingValue, { color: theme.colors.text }]}>{selectedEvent.epistle || '-'}</Text>
                      </View>
                      <View style={styles.readingRow}>
                        <View style={[styles.readingBullet, { borderColor: theme.colors.primary }]} />
                        <Text style={[styles.readingLabel, { color: theme.colors.textSecondary }]}>Gospel</Text>
                        <Text style={[styles.readingValue, { color: theme.colors.text }]}>{selectedEvent.gospel || '-'}</Text>
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity style={[styles.goToButton, { backgroundColor: theme.colors.primary }]} onPress={navigateToReadings}>
                    <Text style={styles.goToButtonText}>Go to</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
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
  scrollContent: {
    flex: 1,
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 12,
  },
  titleDivider: {
    width: 200,
    height: 1,
  },
  monthNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  navButton: {
    padding: 8,
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 16,
    minWidth: 160,
    textAlign: 'center',
  },
  calendarContainer: {
    paddingHorizontal: 8,
    paddingBottom: 24,
  },
  weekdaysRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingBottom: 8,
    marginBottom: 4,
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
  },
  weekdayText: {
    fontSize: 10,
    fontWeight: '600',
  },
  weekRow: {
    flexDirection: 'row',
    minHeight: 70,
  },
  dayCell: {
    flex: 1,
    minHeight: 70,
    paddingVertical: 4,
    paddingHorizontal: 2,
    borderBottomWidth: 1,
  },
  dayNumber: {
    fontSize: 12,
    marginBottom: 2,
  },
  eventBadge: {
    borderRadius: 2,
    paddingHorizontal: 3,
    paddingVertical: 2,
    marginTop: 2,
  },
  eventBadgeText: {
    fontSize: 8,
    fontWeight: '500',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 8,
    width: '85%',
    maxWidth: 360,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalDate: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  modalFeastName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
  },
  readingsSection: {
    marginBottom: 20,
  },
  readingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  readingsTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  readingsList: {
    paddingLeft: 16,
  },
  readingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  readingBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 1,
    marginRight: 8,
  },
  readingLabel: {
    fontSize: 13,
    width: 70,
  },
  readingValue: {
    fontSize: 13,
    flex: 1,
  },
  goToButton: {
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 4,
    alignSelf: 'center',
  },
  goToButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
