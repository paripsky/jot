import { Box } from '@jot/ui';
import { useEffect, useRef } from 'react';

import { customJotItems } from '@/context/jots';

type CustomJotViewProps = {
  type: string;
  data: string;
};

export const CustomJotView: React.FC<CustomJotViewProps> = ({ data, type }) => {
  const customJotItem = customJotItems[type];
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!customJotItem || !containerRef.current) return;
    containerRef.current.replaceChildren();
    customJotItem?.view?.({ el: containerRef.current, data });
  }, [customJotItem, data]);

  return <Box ref={containerRef} />;
};
