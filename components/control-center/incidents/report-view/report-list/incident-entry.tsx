'use client';

import { Button } from '@/components/ui/button';

interface IncidentButtonProps {
  id: string;
  isSelected?: boolean;
  onClick?: (id: string) => void;
}

export function IncidentEntry({
  id,
  isSelected = false,
  onClick,
}: IncidentButtonProps) {
  return (
    <Button
      variant={isSelected ? 'default' : 'outline'}
      onClick={() => onClick?.(id)}
    >
      {id}
    </Button>
  );
}

export default IncidentEntry;
