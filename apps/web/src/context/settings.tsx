import React, { createContext, useContext, useState } from 'react';

import type { AvatarType } from '../utils/avatar';

export type Settings = {
  nickname: string;
  avatarType: AvatarType;
};

type SettingsContext = {
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
};

const defaultSettings = {
  nickname: 'Jotter',
  avatarType: 'initials' as const,
};

const settingsContext = createContext<SettingsContext>({
  settings: defaultSettings,
  updateSettings: () => {
    throw new Error('updateSettings must be implemented');
  },
});

export const useSettings = () => {
  const context = useContext(settingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }

  return context;
};

type SettingsProviderProps = {
  children?: React.ReactNode;
};

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useState<Settings>(() => {
    const settingsFromLocalStorage = localStorage.getItem('settings');

    if (settingsFromLocalStorage) {
      return JSON.parse(settingsFromLocalStorage);
    }

    return defaultSettings;
  });

  function updateSettings(s: Partial<Settings>) {
    const newSettings = { ...settings, ...s };
    setSettings(newSettings);
    localStorage.setItem('settings', JSON.stringify(newSettings));
  }

  return (
    <settingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </settingsContext.Provider>
  );
}
