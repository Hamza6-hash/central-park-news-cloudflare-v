import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const authFormSchema = (type: string) => {
  const isSignIn = type === 'sign-in';
  const isOptional = z.string().optional();

  return z.object({
    // sign up
    firstName: isSignIn ? isOptional : z.string().min(3),
    lastName: isSignIn ? isOptional : z.string().min(3),
    address1: isSignIn ? isOptional : z.string().max(50),
    city: isSignIn ? isOptional : z.string().max(50),
    state: isSignIn ? isOptional : z.string().max(2).min(2),
    postalCode: isSignIn ? isOptional : z.string().min(3).max(6),
    dateOfBirth: isSignIn ? isOptional : z.string().min(3),
    ssn: isSignIn ? isOptional : z.string().min(3),
    // both
    email: z.string().email(),
    password: z.string().min(8),
  })
}
