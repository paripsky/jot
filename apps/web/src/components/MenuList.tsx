import { Stack, StackProps } from '@jot/ui';
import React, { useCallback, useEffect, useRef, useState } from 'react';

export type MenuListProps = Omit<StackProps, 'children'> & {
  children: ({ focusedIndex }: { focusedIndex: number }) => React.ReactNode;
  onSelect: () => void;
  offset?: {
    x: number;
    y: number;
  };
};

function MenuList({ children, onSelect, offset = { x: 0, y: 0 }, ...props }: MenuListProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const closeMenu = useCallback(() => {
    setFocusedIndex(-1);
    onSelect();
  }, [onSelect, setFocusedIndex]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!menuRef.current) return;
      const totalChildren = menuRef.current.childNodes.length;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex((focusedIndex + 1) % totalChildren);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex(focusedIndex - 1 < 0 ? totalChildren - 1 : focusedIndex - 1);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeMenu();
      } else if (e.key === 'Enter') {
        (menuRef.current.childNodes[focusedIndex] as HTMLElement)?.click();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [focusedIndex, closeMenu]);

  const onBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (e.target.parentElement !== menuRef.current) {
      closeMenu();
    }
  };

  const onClick = () => {
    closeMenu();
  };

  return (
    <Stack
      {...props}
      ref={menuRef}
      onBlur={onBlur}
      onClick={onClick}
      left={offset.x}
      top={offset.y}
    >
      {children({ focusedIndex })}
    </Stack>
  );
}

export default MenuList;
