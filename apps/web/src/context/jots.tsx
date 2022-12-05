import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { IconType } from 'react-icons';
import { FaExchangeAlt } from 'react-icons/fa';
import { ImEmbed } from 'react-icons/im';
import { SiHtml5, SiJavascript, SiMarkdown, SiReact, SiTypescript } from 'react-icons/si';
import { VscJson } from 'react-icons/vsc';

import { CustomJotItem, Jot, JotEntry, JotItem, JotItemTypes } from '@/types/jot';

export type { Jot, JotEntry, JotItem } from '@/types/jot';
export { JotItemTypes } from '@/types/jot';

// todo: add option for custom types as plugin
// use module federation for plugins? babel? webpack/vite in electron? or plain es6 js with modules

export const defaultJotItemType = JotItemTypes.markdown;

export const jotItemTypesIcons: Record<string, IconType> = {
  javascript: SiJavascript,
  typescript: SiTypescript,
  html: SiHtml5,
  markdown: SiMarkdown,
  embed: ImEmbed,
  converter: FaExchangeAlt,
  json: VscJson,
  react: SiReact,
};

export type JotItemData = JotItem['data'];

type JotsContext = {
  jots: JotEntry[];
  jotsLoading: boolean;
  getJot?: (id: string) => Promise<Jot | null>;
  addJot?: () => Promise<Jot>;
  removeJot?: (id: string) => Promise<void>;
  updateJot?: (jot: Jot) => Promise<void>;
};

export const getDefaultValueForType = (type: JotItemTypes) => {
  switch (type) {
    case JotItemTypes.excalidraw:
      return [];
    default:
      return '';
  }
};

export const customJotItems: Record<string, CustomJotItem> = {
  custom_1: {
    icon: () => <>🐲</>,
    view({ el, data }) {
      console.log('viewd', el);
      el.innerText = data as string;
    },
  },
};

const jotsContext = createContext<JotsContext>({
  jots: [],
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

  async function getJots() {
    setLoadingJots(true);
    // return new Promise((resolve) => {
    //   setTimeout(() => {
    //     const jotsFromLocalStorage = localStorage.getItem('jots');
    //     let s: Jot[] = [];
    //     if (jotsFromLocalStorage) {
    //       s = JSON.parse(jotsFromLocalStorage);
    //     }

    //     setJots(s);
    //     resolve(s);
    //     setLoadingJots(false);
    //   }, 1000);
    // });
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

  // function saveJotsToLocalStorage(toSave: Jot[]) {
  //   localStorage.setItem('jots', JSON.stringify(toSave));
  // }

  async function addJot() {
    const jot = await window.api.createJot('New Jot');
    const jotEntries = await window.api.getJotFiles();
    setJots(jotEntries);

    return jot;
    // saveJotsToLocalStorage(newJots);
  }

  async function removeJot(jotId: string) {
    const newJots = jots.filter((jot) => jot.id !== jotId);
    setJots(newJots);
    // saveJotsToLocalStorage(newJots);
  }

  // async function removeJotItem(jot: Jot, jotItemId: string) {
  //   const newJots = jots.map((jot) =>
  //     jot.id === jotId
  //       ? {
  //           ...jot,
  //           items: jot.items.filter((item) => item.id !== jotItemId),
  //         }
  //       : jot
  //   );
  //   setJots(newJots);
  //   saveJotsToLocalStorage(newJots);
  // }

  async function updateJot(jot: Jot) {
    const newJots = jots.map((s) => (s.id === jot.id ? jot : s));
    setJots(newJots);
    window.api.writeJot(jot);
    // saveJotsToLocalStorage(newJots);
  }

  return (
    <jotsContext.Provider value={{ jots, addJot, getJot, updateJot, removeJot, jotsLoading }}>
      {children}
    </jotsContext.Provider>
  );
}
