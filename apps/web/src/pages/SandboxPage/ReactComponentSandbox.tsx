import { Box, Button, Spinner } from '@chakra-ui/react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import ErrorBoundary from '@/components/ErrorBoundary';
import { transform } from '@/utils/babel';
import tryEval from '@/utils/evaluate';
import { getSearchParam } from '@/utils/getSearchParam';
import logger from '@/utils/logger';
import { postMessageToTop } from '@/utils/messaging';

const pluginContext = {
  components: {
    Button,
    Box,
  },
  hooks: {
    useState,
    useEffect,
    useRef,
    useMemo,
    useCallback,
  },
  utils: {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    triggerResize: () => {},
  },
};

window.React = React;

const fileNameInErrorMessage = '/file.tsx: ';

const ReactComponentSandbox: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  //   const componentRef = useRef<React.FC<{ pluginContext: typeof pluginContext }> | null>(
  //     null,
  //   );
  const [Component, setComponent] = useState<
    React.FC<{
      pluginContext: typeof pluginContext;
    }>
  >();
  const [iframeID] = useState(() => getSearchParam('iframeID'));

  const onError = useCallback(
    (error: string | null) => {
      if (!iframeID) return;

      setError(error);
      postMessageToTop(iframeID, {
        name: 'error',
        error,
      });
    },
    [iframeID],
  );

  const replaceReact = (code: string) => {
    return code.replace("import React from 'react'", '');
  };

  const fetchComponent = useCallback(
    async (code: string) => {
      if (!iframeID) return;
      try {
        setLoading(true);
        // fetch script and babel transform
        const transformedCode = (transform(replaceReact(code)).code || '').replaceAll(
          '/*#__PURE__*/',
          '',
        );
        const dataUri = `data:text/javascript;charset=utf-8,${transformedCode}`;
        const module = await tryEval(`import(\`${dataUri}\`)`);
        if (!module.default) {
          onError('Missing default export');
          return;
        }

        setComponent(() => module.default);
        setLoading(false);
        onError(null);
      } catch (e) {
        logger.error(e);
        setLoading(false);
        onError((e as Error).message.replace(fileNameInErrorMessage, ''));
      }
    },
    [iframeID, onError],
  );

  const sendResize = useCallback(() => {
    if (!iframeID) return;
    postMessageToTop(iframeID, {
      name: 'resize',
      height: document.body.clientHeight,
    });
  }, [iframeID]);

  const pluginContextAPI = useMemo(
    () => ({
      ...pluginContext,
      utils: {
        ...pluginContext.utils,
        triggerResize: sendResize,
      },
    }),
    [sendResize],
  );

  useEffect(() => {
    if (!iframeID) return;

    const onMessage = (event: MessageEvent) => {
      // FIXME, TODO: add the check for the origin
      // if (isOriginAllowed(event.origin)) {
      if (event.data.name === 'code') {
        fetchComponent(event.data.code);
      }
    };
    window.addEventListener('message', onMessage);

    // TODO, FIXME: change target origin
    postMessageToTop(iframeID, {
      name: 'ready',
    });

    return () => {
      window.removeEventListener('message', onMessage);
    };
  }, [fetchComponent, iframeID]);

  useEffect(sendResize);

  useEffect(() => {
    window.addEventListener('resize', sendResize);

    return () => {
      window.removeEventListener('resize', sendResize);
    };
  }, [sendResize]);

  useEffect(() => {
    if (!iframeID) return;

    const images = document.querySelectorAll('img');
    let loaded = 0;
    const onImageLoad = () => {
      loaded++;
      if (loaded === images.length) {
        sendResize();
      }
    };
    images.forEach((image) => {
      image.addEventListener('load', onImageLoad);
    });
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      sendResize();
    });
    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [sendResize]);

  if (error) {
    return (
      <Box>
        <Box>Error:</Box>
        <Box whiteSpace="pre-wrap" color="error.300">
          {error}
        </Box>
      </Box>
    );
  }

  if (loading || !Component) {
    return <Spinner />;
  }

  return (
    <Box p="1">
      <ErrorBoundary onErrorStateChanged={(e) => onError(e?.message || null)}>
        <Component pluginContext={pluginContextAPI} />
      </ErrorBoundary>
    </Box>
  );
};

export default ReactComponentSandbox;
