import { memo, useMemo } from 'react';
import type { CodeLine } from '../../types';
import { cn } from '../../utils/classNames';
import './Minimap.css';

interface MinimapProps {
  lines: CodeLine[];
}

function getLineLength(line: CodeLine): number {
  let length = 0;
  for (const token of line) length += token.value.length;
  return length;
}

const WIDTH_BUCKETS = [20, 30, 40, 50, 60, 70, 80] as const;

function pickWidthBucket(length: number): number {
  const index = Math.min(
    WIDTH_BUCKETS.length - 1,
    Math.max(0, Math.floor(length / 10)),
  );
  return WIDTH_BUCKETS[index];
}

function MinimapComponent({ lines }: MinimapProps) {
  const bars = useMemo(
    () =>
      lines.map((line) => {
        const length = getLineLength(line);
        return {
          width: pickWidthBucket(length),
          isCode: length > 20,
        };
      }),
    [lines],
  );

  return (
    <div className="minimap" aria-hidden="true">
      <div className="minimap__viewport" />
      {bars.map((bar, i) => (
        <div
          key={i}
          className={cn(
            'minimap__line',
            bar.isCode && 'minimap__line--code',
            `minimap__line--w${bar.width}`,
          )}
        />
      ))}
    </div>
  );
}

export const Minimap = memo(MinimapComponent);
