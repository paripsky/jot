import { LinkIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  ButtonGroup,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Heading,
  IconButton,
  Spinner,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { Reorder } from 'framer-motion';
import React, {
  KeyboardEvent,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { BsMicFill } from 'react-icons/bs';
import { Navigate, useParams } from 'react-router-dom';

import IconPicker from '@/components/IconPicker';
import { jotItemTypes } from '@/constants/jotItemTypes';
import {
  customJotItems,
  defaultJotItemType,
  getDefaultValueForType,
  Jot as JotType,
  JotItem,
  JotItemData,
  useJots,
} from '@/context/jots';
import useKey from '@/hooks/useKey';
import { readFile } from '@/utils/fileReader';
import generateID from '@/utils/id';
import logger from '@/utils/logger';

import DefaultJotEdit from './components/DefaultJotEdit';
import { JotListItem } from './components/JotListItem';

export type TypeAndDataState = {
  type: string;
  data: JotItemData;
};

function JotPage() {
  const { jotId } = useParams();
  const [editing, setEditing] = useState<JotItem | false>(false);
  const { updateJot, getJot } = useJots();
  const jotItemsContainerRef = useRef<HTMLDivElement | null>(null);
  const [editState, setEditState] = useState<TypeAndDataState | null>(null);
  const [jot, setJot] = useState<JotType | null | undefined>(undefined);
  const [newItemState, setNewItemState] = useState<TypeAndDataState>(() => ({
    type: defaultJotItemType,
    data: getDefaultValueForType(defaultJotItemType),
  }));
  const { key: newItemKey, resetKey: resetNewItemKey } = useKey();
  const [hovering, setHovering] = useState<JotItem | null>(null);
  const [dragging, setDragging] = useState<JotItem | null>(null);
  const jotItemTypesWithCustom = useMemo(() => ({ ...jotItemTypes, ...customJotItems }), []);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      if (!jotItemsContainerRef.current) return;
      jotItemsContainerRef.current.scrollTo({
        top: jotItemsContainerRef.current.scrollHeight,
        // behavior: 'smooth',
      });
    });
  }, []);

  const onChange = (newData: JotItemData) => {
    setNewItemState((newItemState) => {
      if (!newItemState || newData === newItemState.data) return newItemState;

      return { ...newItemState, data: newData };
    });
  };

  const onChangeEdit = (newData: JotItemData) => {
    if (!editState || newData === editState.data) return;
    setEditState({ ...editState, data: newData });
  };

  const addNewItem = (item = newItemState) => {
    if (!jot || !updateJot) return;
    const now = new Date().toISOString();

    const newJot = {
      ...jot,
      items: [
        ...jot.items,
        {
          id: generateID(),
          type: item.type,
          data: item.data,
          createdAt: now,
          updatedAt: now,
        },
      ],
    };
    setJot(newJot);
    updateJot(newJot);
    scrollToBottom();
  };

  const editItem = (newItem: JotItem) => {
    if (!jot || !updateJot) return;

    const newJot = {
      ...jot,
      items: jot.items.map((item) => (item.id === newItem.id ? newItem : item)),
    };
    setJot(newJot);
    updateJot(newJot);
  };

  const onReorderJotItems = (items: JotItem[]) => {
    if (!jot || !updateJot) return;

    const newJot = {
      ...jot,
      items,
    };
    setJot(newJot);
    updateJot(newJot);
  };

  const onSubmit = () => {
    if (!newItemState.data) return;
    addNewItem();
    setNewItemState({
      ...newItemState,
      data: getDefaultValueForType(newItemState.type),
    });
    resetNewItemKey();
  };

  const onCancelEdit = () => {
    setEditing(false);
    setEditState(null);
  };

  const onSubmitEdit = () => {
    if (!(editState?.data && editing)) return;
    editItem({
      ...editing,
      data: editState.data,
    });

    setEditing(false);
    setEditState(null);
  };

  const onSubmitKeyDown = (e: KeyboardEvent, handler: () => void) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handler();
    }
  };

  const onTypeChange = (newType: string) => {
    if (newType === newItemState.type) return;
    const defaultValue = getDefaultValueForType(newType);
    const dataWasString = typeof newItemState.data === 'string';
    const dataWillBeString = typeof defaultValue === 'string';
    setNewItemState({
      data: dataWasString && dataWillBeString ? newItemState.data : defaultValue,
      type: newType,
    });
  };

  const enterEditMode = (item: JotItem) => {
    setEditState({ ...editState, data: item.data, type: item.type });
    setEditing(item);
  };

  const updateJotName = (name: string) => {
    if (!jot || !updateJot) return;

    const newJot = {
      ...jot,
      name,
    };
    updateJot(newJot);
    setJot(newJot);
  };

  const updateJotIcon = (icon: string) => {
    if (!jot || !updateJot) return;

    const newJot = {
      ...jot,
      icon,
    };
    updateJot(newJot);
    setJot(newJot);
  };

  const removeJotItem = (jotItemId: string) => {
    if (!jot || !updateJot) return;

    const newJot = {
      ...jot,
      items: jot.items.filter((item) => item.id !== jotItemId),
    };
    setJot(newJot);
    updateJot(newJot);
  };

  const onPaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    const clipboardItems = e.clipboardData.items;
    const items = Array.from(clipboardItems).filter((item) => {
      // Filter the image items only
      return item.type.indexOf('image') !== -1;
    });
    if (items.length === 0) {
      return;
    }

    const item = items[0];
    // Get the blob of image
    const blob = item.getAsFile();
    if (!blob) return;
    const image = await readFile(blob);
    addNewItem({
      type: jotItemTypes.image.id,
      data: image,
    });
  };

  const onJotItemDragStop = useCallback(() => setDragging(null), [setDragging]);

  useEffect(() => {
    if (!(getJot && jotId)) return;

    getJot(jotId)
      .then((jot) => {
        setJot(jot);
        scrollToBottom();
        return jot;
      })
      .catch(logger.error);
  }, [jotId, getJot, scrollToBottom]);

  if (jot === undefined) return <Spinner />;

  if (jot === null || !jotId) return <Navigate to="/" replace />;

  const JotEditor = jotItemTypes[newItemState.type].edit ?? DefaultJotEdit;

  return (
    <Flex flexDirection="column" h="full">
      <Flex mb="2">
        <Heading as="h5" display="flex" alignItems="center" size="sm" w="full">
          {jot.icon && (
            <IconPicker value={jot.icon} onChange={updateJotIcon} placement="bottom-end" />
          )}
          <Editable defaultValue={jot.name} key={jot.id} onSubmit={updateJotName}>
            <EditablePreview />
            <EditableInput />
          </Editable>
        </Heading>
        <ButtonGroup justifyContent="end" size="sm" w="full" pr="2" pt="2">
          <IconButton size="sm" title="Share" aria-label="Share Jot" icon={<LinkIcon />} />
        </ButtonGroup>
      </Flex>
      <Flex flex="1" flexDirection="column" overflow="auto" ref={jotItemsContainerRef} pt="3">
        <Reorder.Group axis="y" values={jot.items} onReorder={onReorderJotItems}>
          {jot.items.map((item) => (
            <JotListItem
              key={item.id}
              item={item}
              onSubmitKeyDown={onSubmitKeyDown}
              onSubmitEdit={onSubmitEdit}
              editState={editState}
              onChangeEdit={onChangeEdit}
              onCancelEdit={onCancelEdit}
              enterEditMode={enterEditMode}
              editItem={editItem}
              isEditing={editing === item}
              removeJotItem={removeJotItem}
              hovering={hovering}
              onHover={(item) => setHovering(item)}
              dragging={dragging}
              onDragStart={(item) => setDragging(item)}
              onDragStop={onJotItemDragStop}
            />
          ))}
        </Reorder.Group>
      </Flex>
      <Flex
        mt="2"
        zIndex={5}
        onPasteCapture={onPaste}
        onKeyDownCapture={(e) => onSubmitKeyDown(e, onSubmit)}
      >
        <Flex
          w="full"
          flexDirection="column"
          mt="2"
          borderRadius="5"
          outline="1px solid"
          outlineColor="neutral.600"
          p="2"
        >
          <Flex>
            <ButtonGroup variant="outline" isAttached>
              {Object.values(jotItemTypesWithCustom).map((jotItemType) => {
                const Icon = jotItemType.icon;
                const commonProps = {
                  size: 'xs',
                  colorScheme: jotItemType.id === newItemState.type ? 'blue' : undefined,
                  onClick: () => onTypeChange(jotItemType.id),
                };
                if (Icon) {
                  return (
                    <Tooltip
                      label={jotItemType.name}
                      openDelay={500}
                      placement="top"
                      key={jotItemType.id}
                    >
                      <IconButton icon={<Icon />} aria-label={jotItemType.name} {...commonProps} />
                    </Tooltip>
                  );
                }

                return (
                  <Button key={jotItemType.id} {...commonProps}>
                    {jotItemType.name}
                  </Button>
                );
              })}
            </ButtonGroup>
          </Flex>
          <Box mt="2" w="full">
            <Suspense fallback={<Spinner />}>
              <JotEditor
                key={newItemKey}
                data={newItemState.data}
                type={newItemState.type}
                onChange={onChange}
              />
            </Suspense>
          </Box>
          <Flex mt="2" justifyContent="flex-end" gap="2">
            <IconButton size="xs" icon={<BsMicFill />} aria-label="Use voice" />
            <Text fontSize="xs" alignSelf="center" color="neutral.400">
              Ctrl + Enter
            </Text>
            <Button size="xs" onClick={onSubmit} disabled={!newItemState.data}>
              Submit
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default JotPage;
