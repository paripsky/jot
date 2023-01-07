import { Excalidraw } from '@excalidraw/excalidraw';
import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types';
import { Flex, useColorMode } from '@jot/ui';
import { useCallback, useMemo, useRef } from 'react';

import { JotItemData } from '@/context/jots';

export type ExcalidrawJotEditProps = {
  data: JotItemData;
  onChange: (data: JotItemData) => void;
};

function ExcalidrawJotEdit({ data, onChange }: ExcalidrawJotEditProps) {
  const { colorMode } = useColorMode();
  const excalidrawRef = useRef<ExcalidrawImperativeAPI | null>(null);

  const initialExcalidrawData = useMemo(
    () => ({
      elements: data as ExcalidrawElement[],
    }),
    [data],
  );

  const onExcalidrawChange = useCallback(
    (elements: readonly ExcalidrawElement[]) => {
      if (elements === data) return;
      onChange(elements as ExcalidrawElement[]);
    },
    [onChange, data],
  );

  return (
    <Flex minH="sm" h="full" w="full">
      <Excalidraw
        ref={excalidrawRef}
        initialData={initialExcalidrawData}
        onChange={onExcalidrawChange}
        theme={colorMode}
      />
    </Flex>
  );
}

export default ExcalidrawJotEdit;
