import { memo, useCallback } from 'react';
import Editor, { loader, type OnChange, type OnMount } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';

loader.config({
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.55.1/min/vs',
  },
});

export interface MonacoBlockProps {
  value: string;
  language?: string;
  readOnly?: boolean;
  onChange?: (value: string) => void;
  placeholder?: string;
}

const defaultOptions: editor.IStandaloneEditorConstructionOptions = {
  minimap: { enabled: false },
  fontSize: 12,
  fontFamily:
    "'SFMono-Regular', 'Menlo', 'Consolas', 'Liberation Mono', monospace",
  lineNumbersMinChars: 3,
  scrollBeyondLastLine: false,
  automaticLayout: true,
  tabSize: 2,
  renderLineHighlight: 'line',
  wordWrap: 'on',
  smoothScrolling: true,
  padding: { top: 10, bottom: 10 },
  scrollbar: {
    verticalScrollbarSize: 10,
    horizontalScrollbarSize: 10,
    useShadows: false,
  },
  overviewRulerLanes: 0,
  fixedOverflowWidgets: true,
};

function MonacoBlockComponent({
  value,
  language = 'json',
  readOnly = false,
  onChange,
  placeholder,
}: MonacoBlockProps) {
  const handleChange: OnChange = useCallback(
    (next) => onChange?.(next ?? ''),
    [onChange],
  );

  const handleMount: OnMount = useCallback((editorInstance) => {
    editorInstance.updateOptions({ readOnly });
  }, [readOnly]);

  return (
    <div className="monaco-block">
      <Editor
        value={value}
        language={language}
        theme="vs-dark"
        onChange={handleChange}
        onMount={handleMount}
        options={{
          ...defaultOptions,
          readOnly,
        }}
        loading={
          <div className="monaco-block__loading">
            {placeholder ?? 'Loading editor…'}
          </div>
        }
      />
    </div>
  );
}

export const MonacoBlock = memo(MonacoBlockComponent);
