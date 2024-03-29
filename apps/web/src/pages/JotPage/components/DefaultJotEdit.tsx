import { useColorMode } from '@jot/ui';
import { editor } from 'monaco-editor';
import { useCallback, useEffect, useRef, useState } from 'react';

import Editor from '@/components/CodeEditor';
import { JotItemData } from '@/context/jots';
import debounce from '@/utils/debounce';

export type DefaultJotEditProps = {
  data: JotItemData;
  type: string;
  onChange: (data: JotItemData) => void;
  height?: number;
};

const typeToLanguage: Record<string, string> = {
  react: 'typescript',
};

function DefaultJotEdit({ data, type, onChange, height }: DefaultJotEditProps) {
  const { colorMode } = useColorMode();
  const [monacoTheme, setMonacoTheme] = useState('dark');
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const language = typeToLanguage[type] ?? type;

  const handleEditorDidMount = (e: editor.IStandaloneCodeEditor) => {
    editorRef.current = e;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const codeChanged = useCallback(
    debounce((newCode = data) => {
      onChange(newCode);
    }, 600),
    [onChange],
  );

  useEffect(() => {
    setMonacoTheme(colorMode === 'light' ? 'vs-light' : 'dark');
  }, [colorMode]);

  return (
    <Editor
      height={height}
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
