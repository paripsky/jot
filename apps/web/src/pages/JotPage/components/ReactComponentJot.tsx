import { Box, useColorMode } from '@chakra-ui/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import debounce from '@/utils/debounce';
import generateID from '@/utils/id';
import logger from '@/utils/logger';

export type ReactComponentJotProps = {
  data: unknown;
};

const ReactComponentJot: React.FC<ReactComponentJotProps> = ({ data }) => {
  const code = data as string;
  const { colorMode } = useColorMode();
  const [, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [showIframe, setShowIframe] = useState(false);
  const [iframeKey] = useState(0);
  const [iframeID] = useState(() => generateID());

  const url = `/sandbox/react?colorMode=${colorMode}&iframeID=${iframeID}`;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const sendCodeToIframe = useCallback(
    debounce((newCode = code) => {
      // FIXME, TODO: change target origin
      iframeRef.current?.contentWindow?.postMessage({ name: 'code', code: newCode }, '*');
    }, 600),
    [],
  );

  useEffect(() => {
    sendCodeToIframe(code);
  }, [sendCodeToIframe, code]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (!iframeRef.current || event.data.from !== iframeID) return;

      switch (event.data.name) {
        case 'ready': {
          sendCodeToIframe();
          break;
        }
        case 'resize': {
          iframeRef.current.style.height = `${event.data.height}px`;
          break;
        }
        case 'error': {
          setError(event.data.error);
          break;
        }
        default:
          logger.error('unkown message', event);
      }
    };
    window.addEventListener('message', onMessage);

    return () => window.removeEventListener('message', onMessage);
  }, [sendCodeToIframe, iframeID]);

  return (
    <Box
      position="relative"
      key={iframeKey}
      as="iframe"
      src={url}
      w="full"
      h="full"
      ref={iframeRef}
      display={showIframe ? 'inherit' : 'none'}
      sandbox="allow-scripts"
      onLoad={() => setShowIframe(true)}
    />
  );
};

export default ReactComponentJot;
