import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function convertImageToBase64(file:File) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = function(e) {
      resolve(e?.target?.result)
    };
    reader.readAsDataURL(file);
  })
}