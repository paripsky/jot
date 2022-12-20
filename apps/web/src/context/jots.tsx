import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { CustomJotItemTypeValue, jotItemTypes } from '@/constants/jotItemTypes';
import { Jot, JotEntry, JotItem } from '@/types/jot';

export type { Jot, JotEntry, JotItem } from '@/types/jot';

export const defaultJotItemType = jotItemTypes.markdown.id;

export type JotItemData = JotItem['data'];

type JotsContext = {
  jots: JotEntry[];
  recentJots: JotEntry[];
  jotsLoading: boolean;
  getJot?: (id: string) => Promise<Jot | null>;
  addJot?: () => Promise<Jot>;
  removeJot?: (id: string) => Promise<void>;
  updateJot?: (jot: Jot) => Promise<void>;
};

export const getDefaultValueForType = (type: string) => {
  return jotItemTypes[type]?.defaultData ?? '';
};

export const customJotItems: Record<string, CustomJotItemTypeValue> = {
  custom_1: {
    id: 'custom_1',
    name: 'Custom 1',
    icon: () => <>🐲</>,
    view({ el, data }) {
      console.log('viewd', el);
      el.innerText = data as string;
    },
  },
};

const jotsContext = createContext<JotsContext>({
  jots: [],
  recentJots: [],
  jotsLoading: false,
});

export const useJots = () => {
  const context = useContext(jotsContext);
  if (!context) {
    throw new Error('useJots must be used within a JotsProvider');
  }

  return context;
};

type JotsProviderProps = {
  children?: React.ReactNode;
};

export function JotsProvider({ children }: JotsProviderProps) {
  const [jots, setJots] = useState<JotEntry[]>(() => []);
  const [jotsLoading, setLoadingJots] = useState(true);

  const recentJots = useMemo(() => {
    return jots
      .slice()
      .sort((a, b) => {
        if (!a.updatedAt || !b.updatedAt) {
          return 0;
        }

        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      })
      .slice(0, 3);
  }, [jots]);

  async function getJots() {
    setLoadingJots(true);
    const jotEntries = await window.api.getJotFiles();
    setJots(jotEntries);
    setLoadingJots(false);
  }

  const getJot = useCallback(async (id: string) => {
    return window.api.getJot(id);
  }, []);

  useEffect(() => {
    getJots();
  }, []);

  async function addJot() {
    const jot = await window.api.createJot('New Jot');
    const jotEntries = await window.api.getJotFiles();
    setJots(jotEntries);

    return jot;
  }

  async function removeJot(jotId: string) {
    const newJots = jots.filter((jot) => jot.id !== jotId);
    setJots(newJots);
  }

  async function updateJot(jot: Jot) {
    const now = new Date().toISOString();
    jot.updatedAt = now;
    const newJots = jots.map((s) => (s.id === jot.id ? jot : s));
    setJots(newJots);
    window.api.writeJot(jot);
  }

  return (
    <jotsContext.Provider
      value={{ jots, recentJots, addJot, getJot, updateJot, removeJot, jotsLoading }}
    >
      {children}
    </jotsContext.Provider>
  );
}
