import { memo } from 'react';
import type { CodeLine, Token } from '../../types';
import './CodeView.css';

interface CodeViewProps {
  lines: CodeLine[];
}

function TokenSpan({ token }: { token: Token }) {
  return <span className={`tok-${token.kind}`}>{token.value}</span>;
}

function CodeLineRow({ line }: { line: CodeLine }) {
  if (line.length === 0) {
    return <span className="code-line"> </span>;
  }
  return (
    <span className="code-line">
      {line.map((token, i) => (
        <TokenSpan key={i} token={token} />
      ))}
    </span>
  );
}

function CodeViewComponent({ lines }: CodeViewProps) {
  return (
    <>
      <div className="line-numbers" aria-hidden="true">
        {lines.map((_, i) => (
          <div key={i} className="line-numbers__line">
            {i + 1}
          </div>
        ))}
      </div>
      <div className="code-view" role="presentation">
        {lines.map((line, i) => (
          <CodeLineRow key={i} line={line} />
        ))}
      </div>
    </>
  );
}

export const CodeView = memo(CodeViewComponent);
