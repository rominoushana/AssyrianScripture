import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Theme {
  dark: boolean;
  colors: {
    primary: string;
    primaryLight: string;
    background: string;
    surface: string;
    surfaceSecondary: string;
    text: string;
    textSecondary: string;
    border: string;
    headerBackground: string;
    headerText: string;
    tabBar: string;
    tabBarBorder: string;
    modalOverlay: string;
    cardBackground: string;
    inputBackground: string;
  };
}

const lightTheme: Theme = {
  dark: false,
  colors: {
    primary: '#C53030',
    primaryLight: '#FEE2E2',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceSecondary: '#F7FAFC',
    text: '#2D3748',
    textSecondary: '#666666',
    border: '#E0E0E0',
    headerBackground: '#C53030',
    headerText: '#FFFFFF',
    tabBar: '#FAFAFA',
    tabBarBorder: '#E0E0E0',
    modalOverlay: 'rgba(0, 0, 0, 0.5)',
    cardBackground: '#FFFFFF',
    inputBackground: '#F7FAFC',
  },
};

const darkTheme: Theme = {
  dark: true,
  colors: {
    primary: '#E53E3E',
    primaryLight: '#742A2A',
    background: '#1A1A1A',
    surface: '#2D2D2D',
    surfaceSecondary: '#3D3D3D',
    text: '#F7FAFC',
    textSecondary: '#A0AEC0',
    border: '#4A4A4A',
    headerBackground: '#2D2D2D',
    headerText: '#F7FAFC',
    tabBar: '#2D2D2D',
    tabBarBorder: '#4A4A4A',
    modalOverlay: 'rgba(0, 0, 0, 0.7)',
    cardBackground: '#2D2D2D',
    inputBackground: '#3D3D3D',
  },
};

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
