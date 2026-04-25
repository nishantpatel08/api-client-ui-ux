import { memo, Fragment } from 'react';
import { cn } from '../../utils/classNames';
import './Breadcrumbs.css';

interface BreadcrumbsProps {
  segments: readonly string[];
}

function BreadcrumbsComponent({ segments }: BreadcrumbsProps) {
  if (segments.length === 0) return null;

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumbs">
      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1;
        return (
          <Fragment key={`${segment}-${index}`}>
            <span
              className={cn(
                'breadcrumbs__item',
                isLast && 'breadcrumbs__item--last',
              )}
            >
              {segment}
            </span>
            {!isLast ? <span className="breadcrumbs__sep"> › </span> : null}
          </Fragment>
        );
      })}
    </nav>
  );
}

export const Breadcrumbs = memo(BreadcrumbsComponent);
