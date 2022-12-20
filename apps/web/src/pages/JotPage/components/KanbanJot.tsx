import { Box, Editable, EditableInput, EditablePreview, Flex } from '@chakra-ui/react';
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import React, { useMemo } from 'react';

export type Todo = {
  id: string;
  title: string;
};

export type KanbanJotData = Record<
  string,
  {
    name: string;
    items: Todo[];
  }
>;

export type KanbanJotProps = {
  data: unknown;
  onChange: (newData: unknown) => void;
};

export function parse(file: string) {
  const lines = file.split('\n');
  let category: string | null = null;
  const todos = lines.reduce<
    Record<
      string,
      {
        name: string;
        items: Todo[];
      }
    >
  >((acc, line) => {
    if (line.trim() === '') return acc;
    if (line.startsWith('#')) {
      category = line.split('#')[1].trim();
      acc[category] = {
        name: category,
        items: [],
      };

      return acc;
    }

    if (!category) {
      throw new Error('Assign a category before adding items');
    }

    acc[category] = {
      ...(acc[category] || {}),
      name: category,
      items: [
        ...(acc[category]?.items || []),
        {
          id: line,
          title: line,
        },
      ],
    };

    return acc;
  }, {});
  return todos;
}

export function stringify(todos: KanbanJotData) {
  return Object.entries(todos).reduce((acc, [, column]) => {
    return `${acc}\n# ${column.name}\n${column.items.map((todo) => `${todo.title}`).join('\n')}\n`;
  }, '');
}

const onDragEnd = (
  result: DropResult,
  columns: KanbanJotData,
  onChange: KanbanJotProps['onChange'],
) => {
  if (!result.destination) return;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    onChange(
      stringify({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      }),
    );
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    onChange(
      stringify({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      }),
    );
  }
};

const KanbanJot: React.FC<KanbanJotProps> = ({ data, onChange }) => {
  const columns = useMemo(() => parse(data as string), [data]);

  return (
    <Flex gap="2" overflow="auto" h="fit-content">
      <DragDropContext onDragEnd={(result) => onDragEnd(result, columns, onChange)}>
        {Object.entries(columns).map(([columnId, column]) => (
          <Flex key={columnId} flexDirection="column" bg="neutral.700" p="2" minWidth="3xs">
            <Box mb="2">
              <Editable defaultValue={column.name}>
                <EditablePreview />
                <EditableInput />
              </Editable>
            </Box>
            <Flex flexDirection="column" gap="2">
              <Droppable droppableId={columnId} key={columnId}>
                {(provided, snapshot) => (
                  <Box
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    bg={snapshot.isDraggingOver ? 'neutral.600' : 'neutral.700'}
                    style={{
                      // background: snapshot.isDraggingOver
                      //   ? 'lightblue'
                      //   : 'lightgrey',
                      padding: 4,
                      // width: 250,
                      minHeight: 500,
                    }}
                  >
                    {column.items.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                          <Box
                            key={item.id}
                            // bg="neutral.600"
                            p="2"
                            borderBottom="4px solid"
                            borderBottomColor={columnId === 'Todo' ? 'success.600' : 'warning.600'}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            bg={snapshot.isDragging ? 'neutral.700' : 'neutral.800'}
                            style={{
                              userSelect: 'none',
                              padding: 16,
                              margin: '0 0 8px 0',
                              minHeight: '50px',
                              // backgroundColor: snapshot.isDragging
                              //   ? '#263B4A'
                              //   : '#456C86',
                              // color: 'white',
                              ...provided.draggableProps.style,
                            }}
                          >
                            {item.title}
                          </Box>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Flex>
          </Flex>
        ))}
      </DragDropContext>
    </Flex>
  );
};

export default KanbanJot;
