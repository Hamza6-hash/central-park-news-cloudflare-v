import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const authFormSchema = () => {

  return z.object({
    contactNumber: z.number().min(3),
    email: z.string().email(),
  })
}
