// Settings Context for Institutional Configurations
import React, { createContext, useContext, useState, useEffect } from 'react';

const SETTINGS_KEY = 'edudecision_settings';

const DEFAULT_SETTINGS = {
  institutionName: "National Institute of Science & Technology",
  institutionCode: "NIST-ENG-042",
  attendanceThreshold: 75,
  probationCgpaThreshold: 6.0,
  currentAcademicTerm: "2024-2025 (Even Semester)",
  internalWeightage: 40,
  externalWeightage: 60,
  passingMarksTotal: 45
};

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  const updateSettings = (newSettings) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};

export default SettingsContext;
