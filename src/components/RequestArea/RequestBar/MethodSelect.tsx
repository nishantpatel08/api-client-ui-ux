import { memo, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';
import type { HttpMethod } from '../../../types';
import { HTTP_METHODS } from '../../../types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '../../../utils/classNames';
import './MethodSelect.css';

interface MethodSelectProps {
  value: HttpMethod;
  onChange: (method: HttpMethod) => void;
}

function MethodSelectComponent({ value, onChange }: MethodSelectProps) {
  const handleSelect = useCallback(
    (method: HttpMethod) => onChange(method),
    [onChange],
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="method-select__trigger"
          aria-label={`HTTP method: ${value}`}
        >
          <span
            className="method-select__value"
            data-method={value}
          >
            {value}
          </span>
          <ChevronDown className="method-select__chevron" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={4}
        className="method-select__menu"
      >
        {HTTP_METHODS.map((method) => (
          <DropdownMenuItem
            key={method}
            onSelect={() => handleSelect(method)}
            className={cn(
              'method-select__item',
              method === value && 'method-select__item--active',
            )}
          >
            <span
              className="method-select__item-label"
              data-method={method}
            >
              {method}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const MethodSelect = memo(MethodSelectComponent);
