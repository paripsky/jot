import React, { useRef } from 'react';

export type UseResizeProps = {
  enabled?: boolean;
  handle?: HTMLElement;
  size: number;
  onResize: (size: number) => void;
};

export const useResize = ({ enabled = true, handle, size, onResize }: UseResizeProps) => {
  const initialY = useRef(0);

  const onPointerDown = (e: React.PointerEvent) => {
    if (!handle || !enabled) return;
    handle.setPointerCapture(e.pointerId);
    initialY.current = e.clientY;
    handle.onpointermove = onPointerMove;
  };

  const onPointerMove = (event: MouseEvent) => {
    const deltaY = event.clientY - initialY.current;
    onResize(size - deltaY);
  };

  function onPointerUp(e: React.PointerEvent) {
    if (!handle || !enabled) return;
    handle.releasePointerCapture(e.pointerId);
    handle.onpointermove = null;
  }

  return {
    handleProps: {
      onPointerDown,
      onPointerUp,
      cursor: 'ns-resize',
      transition: '250ms background',
      _hover: { bg: 'neutral.500' },
    },
  };
};
