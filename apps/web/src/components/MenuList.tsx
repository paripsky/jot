import { Stack, StackProps } from '@chakra-ui/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

export type MenuListProps = StackProps & {
  children?: React.ReactNode;
  onSelect: () => void;
  offset?: {
    x: number;
    y: number;
  };
};

const MenuList: React.FC<MenuListProps> = ({
  children,
  onSelect,
  offset = { x: 0, y: 0 },
  ...props
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);

  useEffect(() => {
    if (!menuRef.current) return;

    setFocusedIndex(0);
  }, []);

  useEffect(() => {
    if (!menuRef.current || focusedIndex === -1) return;

    const node = menuRef.current.childNodes[focusedIndex];
    (node as HTMLElement)?.focus();
  }, [focusedIndex]);

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
      {children}
    </Stack>
  );
};

export default MenuList;
