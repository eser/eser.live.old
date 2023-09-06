import { type ClassValue, clsx } from "clsx";
import { twMerge } from "npm:tailwind-merge@1.14.0";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};
