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

export function hexToCoordinates(hexString: string): string {
  // Convert hex to buffer
  const buffer: Buffer = Buffer.from(hexString, 'hex');

  // PostGIS WKB (Well-Known Binary) format:
  // Byte 0:    Byte order (01 = little-endian)
  // Bytes 1-4: Geometry type (01000020 = POINT with SRID)
  // Bytes 5-8: SRID (E6100000 = 4326)
  // Bytes 9-16: Longitude (8 bytes, double) - STARTS AT OFFSET 9
  // Bytes 17-24: Latitude (8 bytes, double) - STARTS AT OFFSET 17

  const longitude: number = buffer.readDoubleLE(9);
  const latitude: number = buffer.readDoubleLE(17);

  return `${latitude}, ${longitude}`;
}
