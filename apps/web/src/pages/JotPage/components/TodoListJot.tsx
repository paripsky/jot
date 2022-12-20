import {
  Box,
  Button,
  Checkbox,
  Input,
  InputGroup,
  InputRightElement,
  List,
  ListItem,
} from '@chakra-ui/react';
import React, { useMemo, useState } from 'react';

export type TodoListJotProps = {
  data: unknown;
  onChange: (newData: unknown) => void;
};

export type Todo = {
  id: string;
  title: string;
  isDone: boolean;
};

const donePrefix = '[x]';
const notDonePrefix = '[]';

const parse = (items: string): Todo[] => {
  return items.split('\n').map((line, index) => {
    const isDone = line.startsWith(donePrefix);

    return {
      id: index.toString(),
      isDone,
      title: line.replaceAll(donePrefix, '').replaceAll(notDonePrefix, '').trim(),
    };
  });
};

const stringify = (items: Todo[]): string => {
  return items
    .map((item) => `${item.isDone ? donePrefix : notDonePrefix} ${item.title.trim()}`)
    .join('\n');
};

const TodoListJot: React.FC<TodoListJotProps> = ({ data, onChange }) => {
  const list = useMemo(() => parse(data as string), [data]);
  const [text, setText] = useState('');

  const addItem = () => {
    onChange(stringify([...list, { id: list.length.toString(), title: text, isDone: false }]));
  };

  return (
    <List>
      <Box mb="2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addItem();
            setText('');
          }}
        >
          <InputGroup size="sm" w="sm">
            <Input value={text} onChange={(e) => setText(e.target.value)} />
            <InputRightElement mr="1">
              <Button size="xs" onClick={addItem}>
                Add
              </Button>
            </InputRightElement>
          </InputGroup>
        </form>
      </Box>
      {list.map((item) => (
        <ListItem key={item.id}>
          <Checkbox
            colorScheme="primary"
            isChecked={item.isDone}
            onChange={(e) =>
              onChange(
                stringify(
                  list.map((it) =>
                    it === item
                      ? {
                          ...it,
                          isDone: e.target.checked,
                        }
                      : it,
                  ),
                ),
              )
            }
          >
            {item.title}
          </Checkbox>
        </ListItem>
      ))}
    </List>
  );
};

export default TodoListJot;
