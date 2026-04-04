import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertTime(time: string) {
  const date = new Date(time);
  const formatted = date.toISOString().split('.')[0];
  return formatted;
}
