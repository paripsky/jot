import { useColorMode } from '@chakra-ui/react';
import { editor } from 'monaco-editor';
import { useEffect, useRef, useState } from 'react';

import Editor from '@/components/CodeEditor';
import { JotItemData } from '@/context/jots';

export type DefaultJotEditProps = {
  data: JotItemData;
  type: string;
  onChange: (data: JotItemData) => void;
};

const typeToLanguage: Record<string, string> = {
  react: 'typescript',
};

function DefaultJotEdit({ data, type, onChange }: DefaultJotEditProps) {
  const { colorMode } = useColorMode();
  const [monacoTheme, setMonacoTheme] = useState('dark');
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const language = typeToLanguage[type] ?? type;

  const handleEditorDidMount = (e: editor.IStandaloneCodeEditor) => {
    editorRef.current = e;
  };

  const codeChanged = (newCode = data) => {
    onChange(newCode);
  };

  useEffect(() => {
    setMonacoTheme(colorMode === 'light' ? 'vs-light' : 'dark');
  }, [colorMode]);

  return (
    <Editor
      height="150px"
      options={{
        lineNumbers: 'off',
        minimap: { enabled: false },
      }}
      language={language}
      theme={monacoTheme}
      onChange={codeChanged}
      value={data as string}
      onMount={handleEditorDidMount}
    />
  );
}

export default DefaultJotEdit;
