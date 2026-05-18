'use client';

import { SortField } from '@/algorithms/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getFieldLabel } from '@/utils/helpers';

interface FieldSelectorProps {
  selected: SortField;
  onSelect: (field: SortField) => void;
  disabled?: boolean;
}

const fields: SortField[] = ['price', 'sold_quantity', 'available_quantity'];

export function FieldSelector({
  selected,
  onSelect,
  disabled = false,
}: FieldSelectorProps) {
  return (
    <div className="flex gap-2 flex-wrap justify-center">
      {fields.map((field) => (
        <Button
          key={field}
          variant={selected === field ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSelect(field)}
          disabled={disabled}
          className={cn(
            selected === field && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
          )}
        >
          {getFieldLabel(field)}
        </Button>
      ))}
    </div>
  );
}
