import { useBreakpointValue, useDisclosure } from '@chakra-ui/react';
import React, { createContext, useContext } from 'react';

type LayoutContext = {
  isSidebarOpen: boolean;
  isSidebarFloating: boolean;
  toggleSidebar: () => void;
};

const layoutContext = createContext<LayoutContext>({
  isSidebarOpen: false,
  isSidebarFloating: false,
  toggleSidebar: () => {
    throw new Error('toggleSidebar must be implemented');
  },
});

export const useLayout = () => {
  const context = useContext(layoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }

  return context;
};

type LayoutProviderProps = {
  children?: React.ReactNode;
};

export function LayoutProvider({ children }: LayoutProviderProps) {
  const { isOpen: isSidebarOpen, onToggle: toggleSidebar } = useDisclosure();
  const isSidebarFloating =
    useBreakpointValue({ base: true, md: false }) || false;

  return (
    <layoutContext.Provider
      value={{ isSidebarOpen, toggleSidebar, isSidebarFloating }}
    >
      {children}
    </layoutContext.Provider>
  );
}
