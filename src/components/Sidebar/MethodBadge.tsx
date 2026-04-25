import { memo } from 'react';
import type { HttpMethod } from '../../types';

interface MethodBadgeProps {
  method: HttpMethod;
}

function MethodBadgeComponent({ method }: MethodBadgeProps) {
  return (
    <span
      className="method-badge"
      data-method={method}
      aria-label={`HTTP method ${method}`}
    >
      {method}
    </span>
  );
}

export const MethodBadge = memo(MethodBadgeComponent);
