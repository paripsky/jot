import './App.css';

import { ChakraProvider, ColorModeScript, Spinner } from '@chakra-ui/react';
import React, { Suspense, useMemo } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';

import { LayoutProvider } from '@/store/layout';
import { SettingsProvider } from '@/store/settings';

import { JotsProvider } from './context/jots';
import DefaultLayout from './layouts/DefaultLayout';
import routes from './routes';
import { createTheme, defaultColors } from './theme';

const SandboxPage = React.lazy(() => import('./pages/SandboxPage'));
const isSandbox = window.location.pathname.startsWith('/sandbox');

function App() {
  const theme = useMemo(() => createTheme({ colors: defaultColors }), []);

  return (
    <React.StrictMode>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          {isSandbox ? (
            <Suspense fallback={<Spinner />}>
              <SandboxPage />
            </Suspense>
          ) : (
            <SettingsProvider>
              <JotsProvider>
                <LayoutProvider>
                  <Routes>
                    <Route path="/" element={<DefaultLayout />}>
                      {routes.map((route) => (
                        <Route
                          key={route.name}
                          path={route.path}
                          element={route.element}
                          index={route.index}
                        />
                      ))}
                      <Route path="*" element={<Navigate replace to="/" />} />
                    </Route>
                  </Routes>
                </LayoutProvider>
              </JotsProvider>
            </SettingsProvider>
          )}
        </BrowserRouter>
      </ChakraProvider>
    </React.StrictMode>
  );
}

export default App;
