import { createStore } from '@jot/ui';

import { AvatarType } from '@/utils/avatar';

const initialState = {
  nickname: 'Jotter',
  avatarType: 'initials' as AvatarType,
};

export const [useSettings, SettingsProvider] = createStore({
  initialState: () => {
    const settingsFromLocalStorage = localStorage.getItem('settings');

    if (settingsFromLocalStorage) {
      return JSON.parse(settingsFromLocalStorage) as typeof initialState;
    }

    return initialState;
  },
  actions: {
    updateSettings: ({ state, setState }, toUpdate: Partial<typeof initialState>) => {
      const newSettings = {
        ...state,
        ...toUpdate,
      };
      setState(newSettings);
      localStorage.setItem('settings', JSON.stringify(newSettings));
    },
  },
});
