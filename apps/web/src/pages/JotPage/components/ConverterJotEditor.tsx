import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useColorMode,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

import Editor from '../../../components/CodeEditor';

export type ConverterJotData = {
  title: string;
  from: string;
  to: string;
};

export type ConverterJotEditorProps = {
  data: unknown;
  onChange: (newData: unknown) => void;
};

export const defaultConverterData = {
  title: 'My Converter',
  from: `(from) => {
    return from;
}`,
  to: `(to) => {
    return to;
}`,
};

const ConverterJotEditor: React.FC<ConverterJotEditorProps> = ({ data, onChange }) => {
  const { title, from, to } = (data as ConverterJotData) || defaultConverterData;
  const { colorMode } = useColorMode();
  const [monacoTheme, setMonacoTheme] = useState('dark');

  useEffect(() => {
    setMonacoTheme(colorMode === 'light' ? 'vs-light' : 'dark');
  }, [colorMode]);

  const onFormChange = (change: Partial<ConverterJotData>) => {
    onChange({
      title,
      from,
      to,
      ...change,
    });
  };

  return (
    <Flex flexDirection="column" w="full">
      <FormControl>
        <FormLabel htmlFor="name">Title</FormLabel>
        <Input
          id="title"
          placeholder="Title"
          value={title}
          onChange={(e) =>
            onFormChange({
              title: e.target.value,
            })
          }
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="name">From</FormLabel>
        <Editor
          height="150px"
          options={{
            lineNumbers: 'off',
            minimap: { enabled: false },
          }}
          language="javascript"
          theme={monacoTheme}
          defaultValue={from}
          onChange={(e) =>
            onFormChange({
              from: e || defaultConverterData.from,
            })
          }
        />
        <FormErrorMessage>err</FormErrorMessage>
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="name">To</FormLabel>
        <Editor
          height="150px"
          options={{
            lineNumbers: 'off',
            minimap: { enabled: false },
          }}
          language="javascript"
          theme={monacoTheme}
          defaultValue={to}
          onChange={(e) =>
            onFormChange({
              to: e || defaultConverterData.to,
            })
          }
        />
        <FormErrorMessage>err</FormErrorMessage>
      </FormControl>
    </Flex>
  );
};

export default ConverterJotEditor;
