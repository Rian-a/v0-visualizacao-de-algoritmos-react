'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface DatasetSizeProps {
  value: number;
  onChange: (size: number) => void;
  disabled?: boolean;
}

const sizes = [10, 20, 30, 50];

export function DatasetSize({ value, onChange, disabled = false }: DatasetSizeProps) {
  return (
    <div className="flex items-center gap-2">
      <Label className="text-sm whitespace-nowrap">Elementos:</Label>
      <Select
        value={value.toString()}
        onValueChange={(v) => onChange(Number(v))}
        disabled={disabled}
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Quantidade" />
        </SelectTrigger>
        <SelectContent>
          {sizes.map((size) => (
            <SelectItem key={size} value={size.toString()}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
