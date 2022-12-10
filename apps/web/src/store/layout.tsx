import { useBreakpointValue } from '@chakra-ui/react';

import { createStore } from './store';

const initialState = {
  isSidebarOpen: false,
};

export const [useLayout, LayoutProvider] = createStore({
  initialState,
  useHooks: () => {
    const isSidebarFloating = useBreakpointValue({ base: true, md: false }) || false;

    return {
      isSidebarFloating,
    };
  },
  actions: {
    toggleSidebar: ({ state, setState }) => {
      setState({ ...state, isSidebarOpen: !state.isSidebarOpen });
    },
  },
});
