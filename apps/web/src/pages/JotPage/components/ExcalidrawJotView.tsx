import { Box, useColorMode } from '@chakra-ui/react';
import { Excalidraw } from '@excalidraw/excalidraw';
import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';

type ExcalidrawJotViewProps = {
  id: string;
  data: unknown;
};

export const ExcalidrawJotView: React.FC<ExcalidrawJotViewProps> = ({ id, data }) => {
  const { colorMode } = useColorMode();

  return (
    <Box h="sm" w="full">
      <Excalidraw
        key={id}
        initialData={{
          elements: data as ExcalidrawElement[],
        }}
        viewModeEnabled
        theme={colorMode}
      />
    </Box>
  );
};
