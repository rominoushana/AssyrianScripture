import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { Search, Book } from 'lucide-react-native';

interface BibleBook {
  id: string;
  name: string;
  chapters: number;
  testament: 'Old' | 'New';
}

const bibleBooks: BibleBook[] = [
  { id: 'genesis', name: 'Genesis', chapters: 50, testament: 'Old' },
  { id: 'exodus', name: 'Exodus', chapters: 40, testament: 'Old' },
  { id: 'leviticus', name: 'Leviticus', chapters: 27, testament: 'Old' },
  { id: 'numbers', name: 'Numbers', chapters: 36, testament: 'Old' },
  { id: 'deuteronomy', name: 'Deuteronomy', chapters: 34, testament: 'Old' },
  { id: 'matthew', name: 'Matthew', chapters: 28, testament: 'New' },
  { id: 'mark', name: 'Mark', chapters: 16, testament: 'New' },
  { id: 'luke', name: 'Luke', chapters: 24, testament: 'New' },
  { id: 'john', name: 'John', chapters: 21, testament: 'New' },
  { id: 'acts', name: 'Acts', chapters: 28, testament: 'New' },
];

export default function BibleScreen() {
  const [selectedTestament, setSelectedTestament] = useState<'Old' | 'New'>('New');

  const filteredBooks = bibleBooks.filter(book => book.testament === selectedTestament);

  const renderBookItem = ({ item }: { item: BibleBook }) => (
    <TouchableOpacity style={styles.bookItem}>
      <View style={styles.bookIcon}>
        <Book size={24} color="#C53030" />
      </View>
      <View style={styles.bookInfo}>
        <Text style={styles.bookName}>{item.name}</Text>
        <Text style={styles.bookChapters}>{item.chapters} chapters</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bible</Text>
      </View>

      {/* Testament Selector */}
      <View style={styles.testamentSelector}>
        <TouchableOpacity
          style={[styles.testamentTab, selectedTestament === 'Old' && styles.activeTestamentTab]}
          onPress={() => setSelectedTestament('Old')}>
          <Text style={[styles.testamentText, selectedTestament === 'Old' && styles.activeTestamentText]}>
            Old Testament
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.testamentTab, selectedTestament === 'New' && styles.activeTestamentTab]}
          onPress={() => setSelectedTestament('New')}>
          <Text style={[styles.testamentText, selectedTestament === 'New' && styles.activeTestamentText]}>
            New Testament
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TouchableOpacity style={styles.searchBar}>
          <Search size={20} color="#666666" />
          <Text style={styles.searchPlaceholder}>Search books, chapters, verses...</Text>
        </TouchableOpacity>
      </View>

      {/* Books List */}
      <FlatList
        data={filteredBooks}
        renderItem={renderBookItem}
        keyExtractor={(item) => item.id}
        style={styles.booksList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#C53030',
    paddingHorizontal: 20,
    paddingVertical: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
  testamentSelector: {
    backgroundColor: '#F7FAFC',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  testamentTab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  activeTestamentTab: {
    backgroundColor: '#C53030',
  },
  testamentText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  activeTestamentText: {
    color: '#FFFFFF',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F7FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchPlaceholder: {
    marginLeft: 12,
    fontSize: 16,
    color: '#666666',
  },
  booksList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  bookIcon: {
    marginRight: 16,
  },
  bookInfo: {
    flex: 1,
  },
  bookName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 4,
  },
  bookChapters: {
    fontSize: 14,
    color: '#666666',
  },
});