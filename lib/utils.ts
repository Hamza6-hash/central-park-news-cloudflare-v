import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const subscribtionFormSchema = () => {

  return z.object({
    email: z.string().email(),
  })
}

export const contactFormSchema = () => {

  return z.object({
    name: z.string().min(3),
    email: z.string().email(),
    message: z.string()
  })
}
