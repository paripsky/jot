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
import React, { KeyboardEvent, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { BsMicFill } from 'react-icons/bs';
import { Navigate, useParams } from 'react-router-dom';

import IconPicker from '@/components/IconPicker';
import {
  defaultJotItemType,
  getDefaultValueForType,
  Jot as JotType,
  JotItem,
  JotItemData,
  JotItemTypes,
  jotItemTypesIcons,
  useJots,
} from '@/context/jots';
import useKey from '@/hooks/useKey';
import generateID from '@/utils/id';
import logger from '@/utils/logger';

import { JotListItem } from './components/JotListItem';

const JotEditor = React.lazy(() => import('@/pages/JotPage/components/JotEditor'));

export type TypeAndDataState = {
  type: JotItemTypes;
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
    if (!newItemState || newData === newItemState.data) return;
    setNewItemState({ ...newItemState, data: newData });
  };

  const onChangeEdit = (newData: JotItemData) => {
    if (!editState || newData === editState.data) return;
    setEditState({ ...editState, data: newData });
  };

  const addNewItem = () => {
    if (!jot || !updateJot) return;

    const newJot = {
      ...jot,
      items: [
        ...jot.items,
        {
          id: generateID(),
          type: newItemState.type,
          data: newItemState.data,
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

  const onCancel = () => {
    setNewItemState({
      ...newItemState,
      data: getDefaultValueForType(newItemState.type),
    });
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

  const onTypeChange = (newType: JotItemTypes) => {
    if (newType === newItemState.type) return;
    setNewItemState({
      ...editState,
      data: getDefaultValueForType(newType),
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
      <Flex mt="2" zIndex={5} onKeyDownCapture={(e) => onSubmitKeyDown(e, onSubmit)}>
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
              {Object.keys(JotItemTypes).map((jotItemType) => {
                const Icon = jotItemTypesIcons[jotItemType];
                const commonProps = {
                  size: 'xs',
                  colorScheme: jotItemType === newItemState.type ? 'blue' : undefined,
                  onClick: () => onTypeChange(jotItemType as JotItemTypes),
                };
                if (Icon) {
                  return (
                    <Tooltip label={jotItemType} openDelay={500} placement="top" key={jotItemType}>
                      <IconButton icon={<Icon />} aria-label={jotItemType} {...commonProps} />
                    </Tooltip>
                  );
                }

                return (
                  <Button key={jotItemType} {...commonProps}>
                    {jotItemType}
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
                onSubmit={onSubmit}
                onCancel={onCancel}
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
