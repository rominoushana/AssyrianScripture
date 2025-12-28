import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Home, BookOpen, Calendar, Library, Settings, Info, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
}

export default function SideMenu({ visible, onClose }: SideMenuProps) {
  const { theme, isDark } = useTheme();
  const router = useRouter();

  const menuItems = [
    { icon: Home, label: 'Home', route: '/home', isHome: true },
    { icon: BookOpen, label: 'Readings', route: '/index', isHome: false },
    { icon: Calendar, label: 'Calendar', route: '/calendar', isHome: false },
    { icon: Library, label: 'Library', route: '/library', isHome: false },
    { icon: Settings, label: 'Settings', route: '/settings', isHome: false },
    { icon: Info, label: 'About', route: '/profile', isHome: false },
  ];

  const handleNavigation = (route: string) => {
    onClose();
    router.push(route as any);
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <Pressable style={[styles.overlay, { backgroundColor: theme.colors.modalOverlay }]} onPress={onClose}>
        <Pressable style={[styles.menuContainer, { backgroundColor: theme.colors.surface }]} onPress={(e) => e.stopPropagation()}>
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isHome = item.isHome;

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.menuItem,
                  { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border },
                  isHome && { backgroundColor: isDark ? '#7B2D26' : '#A93226' },
                ]}
                onPress={() => handleNavigation(item.route)}
              >
                <View style={styles.menuItemLeft}>
                  <Icon
                    size={24}
                    color={isHome ? '#FFFFFF' : theme.colors.text}
                  />
                  <Text style={[
                    styles.menuItemText,
                    { color: theme.colors.text },
                    isHome && { color: '#FFFFFF' },
                  ]}>
                    {item.label}
                  </Text>
                </View>
                <ChevronRight
                  size={20}
                  color={isHome ? '#FFFFFF' : theme.colors.textSecondary}
                />
              </TouchableOpacity>
            );
          })}

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>2025 - Tishbkhata</Text>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  menuContainer: {
    width: 280,
    height: '100%',
    paddingTop: 0,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
  },
});
