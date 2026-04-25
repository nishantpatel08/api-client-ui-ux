import { memo } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppDispatch } from '@/store/hooks';
import { updateRequestMethod, updateRequestUrl } from '@/store/slices/workspaceSlice';
import { HTTP_METHODS, type HttpMethod } from '@/types';
import type { RequestTabDraft } from '@/types/workspace';

interface RequestBarProps {
  request: RequestTabDraft;
}

function RequestBarComponent({ request }: RequestBarProps) {
  const dispatch = useAppDispatch();

  const setMethod = (method: HttpMethod) => {
    dispatch(updateRequestMethod({ requestId: request.requestId, method }));
  };

  return (
    <div className="request-bar">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="request-bar__method-trigger">
            <span className="request-bar__method-text">{request.method}</span>
            <ChevronDown size={14} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="request-bar__method-menu" align="start">
          {HTTP_METHODS.map((method) => (
            <DropdownMenuItem key={method} onClick={() => setMethod(method)}>
              {method}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Input
        value={request.url}
        onChange={(event) =>
          dispatch(
            updateRequestUrl({
              requestId: request.requestId,
              url: event.target.value,
            }),
          )
        }
        className="request-bar__url-input"
        aria-label="Request URL"
      />

      <Button className="request-bar__send-button">Send</Button>
    </div>
  );
}

export const RequestBar = memo(RequestBarComponent);
