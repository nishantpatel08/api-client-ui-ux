import { memo, useCallback, type ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './dialog';
import { cn } from '../../utils/classNames';

interface ConfirmDialogProps {
  open: boolean;
  title: ReactNode;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
}

const BUTTON_BASE =
  'inline-flex h-8 items-center justify-center rounded-md px-3 text-[13px] font-medium outline-none transition-colors focus-visible:ring-1 focus-visible:ring-[var(--color-ring)]';

function ConfirmDialogComponent({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
  onOpenChange,
}: ConfirmDialogProps) {
  const handleConfirm = useCallback(() => {
    onConfirm();
    onOpenChange(false);
  }, [onConfirm, onOpenChange]);

  const handleCancel = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showClose={false}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>
        <DialogFooter>
          <button
            type="button"
            onClick={handleCancel}
            className={cn(
              BUTTON_BASE,
              'border border-[var(--color-border)] bg-transparent text-[var(--color-foreground)] hover:bg-white/5',
            )}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            autoFocus
            className={cn(
              BUTTON_BASE,
              destructive
                ? 'bg-[var(--color-destructive)] text-[var(--color-destructive-foreground)] hover:opacity-90'
                : 'bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:opacity-90',
            )}
          >
            {confirmLabel}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const ConfirmDialog = memo(ConfirmDialogComponent);
