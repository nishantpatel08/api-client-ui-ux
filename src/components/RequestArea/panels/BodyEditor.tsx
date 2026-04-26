import { memo, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';
import type { RequestBodyMode } from '../../../types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MonacoBlock } from '../editor/MonacoBlock';
import '../editor/monacoBlock.css';
import './BodyEditor.css';

interface BodyEditorProps {
  mode: RequestBodyMode;
  value: string;
  onChange: (value: string) => void;
  onModeChange: (mode: RequestBodyMode) => void;
}

const MODE_LABELS: Record<RequestBodyMode, string> = {
  none: 'No Body',
  json: 'JSON',
  text: 'Text',
  xml: 'XML',
};

const MODES: RequestBodyMode[] = ['none', 'json', 'text', 'xml'];

function getLanguage(mode: RequestBodyMode): string {
  switch (mode) {
    case 'json':
      return 'json';
    case 'xml':
      return 'xml';
    default:
      return 'plaintext';
  }
}

function BodyEditorComponent({
  mode,
  value,
  onChange,
  onModeChange,
}: BodyEditorProps) {
  const handleBeautify = useCallback(() => {
    if (mode !== 'json') return;
    try {
      const parsed = JSON.parse(value);
      onChange(JSON.stringify(parsed, null, 2));
    } catch {
      // ignore invalid JSON
    }
  }, [mode, onChange, value]);

  const handleSelect = useCallback(
    (next: RequestBodyMode) => onModeChange(next),
    [onModeChange],
  );

  return (
    <div className="body-editor">
      <div className="body-editor__toolbar">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" className="body-editor__mode">
              <span>{MODE_LABELS[mode]}</span>
              <ChevronDown className="body-editor__mode-icon" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            sideOffset={4}
            className="body-editor__mode-menu"
          >
            {MODES.map((m) => (
              <DropdownMenuItem
                key={m}
                onSelect={() => handleSelect(m)}
              >
                {MODE_LABELS[m]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {mode === 'json' ? (
          <button
            type="button"
            className="body-editor__beautify"
            onClick={handleBeautify}
          >
            Beautify
          </button>
        ) : null}
      </div>

      {mode === 'none' ? (
        <div className="body-editor__empty">This request has no body.</div>
      ) : (
        <div className="body-editor__editor">
          <MonacoBlock
            value={value}
            language={getLanguage(mode)}
            onChange={onChange}
          />
        </div>
      )}
    </div>
  );
}

export const BodyEditor = memo(BodyEditorComponent);
