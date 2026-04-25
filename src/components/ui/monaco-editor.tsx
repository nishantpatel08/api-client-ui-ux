import { memo } from 'react';
import Editor from '@monaco-editor/react';

interface MonacoEditorProps {
  value: string;
  language: string;
  readOnly?: boolean;
  onChange?: (value: string) => void;
}

function MonacoEditorComponent({
  value,
  language,
  readOnly = false,
  onChange,
}: MonacoEditorProps) {
  return (
    <div className="monaco-editor-shell">
      <Editor
        language={language}
        value={value}
        theme="vs-dark"
        width="100%"
        height="100%"
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          lineNumbersMinChars: 3,
          roundedSelection: false,
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          readOnly,
          automaticLayout: true,
        }}
        onChange={(next) => onChange?.(next ?? '')}
      />
    </div>
  );
}

export const MonacoEditor = memo(MonacoEditorComponent);
