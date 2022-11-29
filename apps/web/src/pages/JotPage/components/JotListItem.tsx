import {
  CheckIcon,
  CloseIcon,
  CopyIcon,
  DeleteIcon,
  DragHandleIcon,
  EditIcon,
} from '@chakra-ui/icons';
import { Box, Flex, IconButton, Spinner, Tooltip, useToast } from '@chakra-ui/react';
import { Reorder, useDragControls } from 'framer-motion';
import React, { KeyboardEvent, Suspense, useCallback, useEffect, useRef } from 'react';

import { JotItem, JotItemData, JotItemTypes } from '@/context/jots';
import type { TypeAndDataState } from '@/pages/JotPage/JotPage';

const Jot = React.lazy(() => import('@/pages/JotPage/components/Jot'));
const JotEditor = React.lazy(() => import('@/pages/JotPage/components/JotEditor'));

export type JotListItemProps = {
  item: JotItem;
  isEditing: boolean;
  onSubmitKeyDown: (e: KeyboardEvent, handler: () => void) => void;
  onSubmitEdit: () => void;
  editState: TypeAndDataState | null;
  onChangeEdit: (newData: JotItemData) => void;
  onCancelEdit: () => void;
  enterEditMode: (item: JotItem) => void;
  editItem: (newItem: JotItem) => void;
  removeJotItem: (jotItemId: string) => void;
  hovering: JotItem | null;
  onHover: (item: JotItem) => void;
  dragging: JotItem | null;
  onDragStart: (item: JotItem) => void;
  onDragStop: () => void;
};

export const JotListItem: React.FC<JotListItemProps> = ({
  item,
  isEditing,
  onSubmitKeyDown,
  onSubmitEdit,
  editState,
  onChangeEdit,
  onCancelEdit,
  enterEditMode,
  editItem,
  removeJotItem,
  hovering,
  onHover,
  dragging,
  onDragStart,
  onDragStop,
}) => {
  const controls = useDragControls();
  const toast = useToast();
  const dragHandleRef = useRef<HTMLButtonElement | null>(null);
  const { id, type, data } = item;
  const isHovering = hovering === item;
  const isDragging = dragging === item;
  const isOtherItemDragging = !!dragging;

  const onDragHandlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragHandleRef.current) return;
    dragHandleRef.current.setPointerCapture(e.pointerId);
    controls.start(e);
    onDragStart(item);
  };

  const onDragHandlePointerUp = useCallback(() => {
    if (!dragHandleRef.current) return;
    onDragStop();
  }, [onDragStop]);

  // this is needed as onPointerUp on the drag handle doesn't catch all pointer up events (out of window for example)
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointerup', onDragHandlePointerUp, { once: true });
    }
  }, [isDragging, onDragHandlePointerUp]);

  return (
    <Reorder.Item key={id} value={item} dragListener={false} dragControls={controls}>
      <Flex
        position="relative"
        key={id}
        id={id}
        justifyContent="space-between"
        p="2"
        m="2"
        onMouseEnter={() => !isOtherItemDragging && onHover(item)}
        onKeyDownCapture={(e) => {
          if (!isEditing) return;
          onSubmitKeyDown(e, onSubmitEdit);
        }}
        outline={isEditing ? '1px solid' : undefined}
      >
        <Box mr="2" visibility={isHovering && !isEditing ? 'visible' : 'hidden'}>
          <IconButton
            ref={dragHandleRef}
            title="Reorder Item"
            size="xs"
            icon={<DragHandleIcon />}
            aria-label="Reorder item"
            onPointerDown={onDragHandlePointerDown}
          />
        </Box>
        <Box w="full" onDoubleClick={() => !isEditing && enterEditMode(item)}>
          {isEditing ? (
            <Suspense fallback={<Spinner />}>
              <JotEditor
                data={editState?.data}
                type={type}
                onChange={onChangeEdit}
                onSubmit={onSubmitEdit}
                onCancel={onCancelEdit}
              />
            </Suspense>
          ) : (
            <Jot
              id={id}
              type={type}
              data={data}
              onChange={(newData: unknown) => editItem({ ...item, data: newData })}
            />
          )}
        </Box>
        <Flex
          ml="2"
          gap="2"
          position={isEditing ? 'relative' : 'absolute'}
          top={isEditing ? 'auto' : '-7'}
          right="0"
          p="2"
          display={isEditing || isDragging || isHovering ? 'flex' : 'none'}
        >
          {isEditing ? (
            <>
              <Tooltip label="Save Item" placement="top" openDelay={500}>
                <IconButton
                  size="xs"
                  icon={<CheckIcon />}
                  aria-label="Save item"
                  onClick={onSubmitEdit}
                />
              </Tooltip>
              <Tooltip label="Cancel" placement="top" openDelay={500}>
                <IconButton
                  size="xs"
                  icon={<CloseIcon />}
                  aria-label="Cancel"
                  onClick={onCancelEdit}
                />
              </Tooltip>
            </>
          ) : (
            <>
              <Tooltip label="Edit item" placement="top" openDelay={500}>
                <IconButton
                  size="xs"
                  icon={<EditIcon />}
                  aria-label="Edit item"
                  onClick={() => enterEditMode(item)}
                />
              </Tooltip>
              <Tooltip label="Copy item" placement="top" openDelay={500}>
                <IconButton
                  size="xs"
                  icon={<CopyIcon />}
                  aria-label="Copy item"
                  onClick={() => {
                    let { data } = item;
                    if (item.type === JotItemTypes.excalidraw) {
                      // for excalidraw, copy the elements to the clipboard so that they can be pasted in excalidraw
                      data = {
                        type: 'excalidraw/clipboard',
                        elements: data,
                        files: {},
                      } as never;
                    }
                    navigator.clipboard.writeText(
                      typeof data === 'string' ? data : JSON.stringify(data, null, 2),
                    );
                    toast({
                      title: 'Copied item to clipboard',
                      position: 'top-right',
                      status: 'success',
                      isClosable: true,
                      duration: 1500,
                    });
                  }}
                />
              </Tooltip>
              <Tooltip label="Delete item" placement="top" openDelay={500}>
                <IconButton
                  size="xs"
                  icon={<DeleteIcon />}
                  aria-label="Delete item"
                  onClick={() => removeJotItem(id)}
                />
              </Tooltip>
            </>
          )}
        </Flex>
      </Flex>
    </Reorder.Item>
  );
};
