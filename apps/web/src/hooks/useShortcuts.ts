import { useEffect } from 'react';

export enum Keys {
  F = 'F',
  P = 'P',
  K = 'K',
  Escape = 'Escape',
}

export enum ModifierKeys {
  CommandOrControl = 'CommandOrControl',
}

export type Shortcut = `${ModifierKeys}+${Keys}` | Keys;

const useShortcuts = (shortcuts: Shortcut[], action: () => void) => {
  useEffect(() => {
    const onKeyPress = (e: KeyboardEvent) => {
      const shouldTrigger = shortcuts.some((shortcut) => {
        const hasModifier = shortcut.includes('+');

        if (!hasModifier) {
          return e.code === `Key${shortcut}`;
        }

        const [modifier, key] = shortcut.split('+');

        if (modifier === ModifierKeys.CommandOrControl) {
          return (e.ctrlKey || e.metaKey) && e.code === `Key${key}`;
        }

        return false;
      });

      if (shouldTrigger) {
        action();
      }
    };

    window.addEventListener('keydown', onKeyPress);

    return () => window.removeEventListener('keydown', onKeyPress);
  }, [shortcuts, action]);
};

export default useShortcuts;
