import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns/format";
import { twMerge } from "tailwind-merge";
import { object, string } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export const subscribtionFormSchema = () => {
  return object({
    email: string().email("Please enter a valid email address")
  });
};

export const contactFormSchema = () => {
  return object({
    name: string().min(3, "Name must be at least 3 characters long"),
    email: string().email(),
    message: string()
      .min(1, "Message cannot be empty")
      .max(500, "Message cannot exceed 500 characters"),
  });
};

export const formatedDate = (date: any, formatString: string = 'MMMM dd, yyyy'): string => {
  if (!date) return '';

  try {
    let dateToFormat: Date | null = null;

    // If it's a Firestore timestamp
    if (date.toDate) {
      dateToFormat = date.toDate();
    }
    // If it's a string that can be parsed to a date
    else if (typeof date === 'string') {
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        dateToFormat = parsedDate;
      }
    }
    // If it's already a Date object
    else if (date instanceof Date) {
      dateToFormat = date;
    }

    // Only format if we have a valid date
    if (dateToFormat && !isNaN(dateToFormat.getTime())) {
      return format(dateToFormat, formatString);
    }

    return '';
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

export const generateSlug = (title: string, id?: string): string => {
    if (!title) return '';
    let slug = title.toLowerCase();
    slug = slug.replace(/[^a-z0-9]+/g, '-');
    
    slug = slug.replace(/^-+|-+$/g, '');
    
    const words = slug.split('-');
    if (words.length > 7) {
        slug = words.slice(0, 7).join('-');
    }
    if (id) {
        slug = `${slug}-${id}`;
    }
    
    return slug;
};

