import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const subscribtionFormSchema = () => {
  return z.object({
    email: z.string().email(),
  });
};

export const contactFormSchema = () => {
  return z.object({
    name: z.string().min(3),
    email: z.string().email(),
    message: z.string(),
  });
};

export const formatedDate = (date: any, formatString: string) => {
  if (typeof date === "object" && date && "seconds" in date) {
    const dateObject = new Date(
      date.seconds * 1000 + date.nanoseconds / 1000000
    );
    return format(dateObject, formatString);
  }
  return format(new Date(date), formatString);
};
