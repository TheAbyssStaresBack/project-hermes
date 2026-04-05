'use client';

import { Button } from '@/components/ui/button';
import { convertTime } from '@/lib/utils';

interface IncidentButtonProps {
  id: string;
  isSelected?: boolean;
  onClick?: (id: string) => void;
}

function idToDate(id: string): string | null {
  return convertTime(id);
}

export function IncidentEntry({
  id,
  isSelected = false,
  onClick,
}: IncidentButtonProps) {
  return (
    <Button
      variant={isSelected ? 'default' : 'outline'}
      className="w-full"
      onClick={() => onClick?.(id)}
    >
      {idToDate(id)}
    </Button>
  );
}

export default IncidentEntry;
