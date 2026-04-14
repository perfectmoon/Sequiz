import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const truncate = (str, max_length = 8) => {
  if (typeof str !== 'string') {
    return 'Guest';
  }
  if (str.length <= max_length) {
    return str;
  }
  return str.slice(0, max_length) + '...';
}