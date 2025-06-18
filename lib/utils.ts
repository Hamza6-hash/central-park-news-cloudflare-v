import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// List of popular email service providers
const VALID_EMAIL_DOMAINS = [
  // Major global providers
  'gmail.com',
  'yahoo.com',
  'outlook.com',
  'hotmail.com',
  'live.com',
  'msn.com',
  'aol.com',
  'icloud.com',
  'me.com',
  'mac.com',
  'protonmail.com',
  'tutanota.com',
  'zoho.com',
  'yandex.com',
  'mail.ru',
  'gmx.com',
  'web.de',
  'orange.fr',
  'free.fr',
  'laposte.net',
  'rediffmail.com',
  'indiatimes.com',
  'hindustantimes.com',
  'ndtv.com',
  'zeenews.com',
  'thehindu.com',
  'business-standard.com',
  'bsnl.in',
  'airtelmail.com',
  'vodafone-sms.com',
  'idea.in',
  'tataindicom.com',
  'relianceada.com'
];

// Function to validate email domain
const isValidEmailDomain = (email: string): boolean => {
  const domain = email.split('@')[1]?.toLowerCase();
  return VALID_EMAIL_DOMAINS.includes(domain);
};

export const subscribtionFormSchema = () => {
  return z.object({
    email: z
      .string()
      .email("Please enter a valid email address")
      .refine(
        (email) => isValidEmailDomain(email),
        "Please use a valid email service provider (Gmail, Yahoo, Outlook, etc.)"
      ),
  });
};

export const contactFormSchema = () => {
  return z.object({
    name: z.string().min(3),
    email: z.string().email(),
    message: z.string(),
  });
};

export const formatedDate = (date: any, formatString: string = 'MMM dd, yyyy'): string => {
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
    
    // Convert to lowercase
    let slug = title.toLowerCase();
    
    // Remove special characters and replace spaces with hyphens
    slug = slug.replace(/[^a-z0-9]+/g, '-');
    
    // Remove leading/trailing hyphens
    slug = slug.replace(/^-+|-+$/g, '');
    
    // Limit to first 5-7 words
    const words = slug.split('-');
    if (words.length > 7) {
        slug = words.slice(0, 7).join('-');
    }
    
    // Append ID if provided (for duplicate titles)
    if (id) {
        slug = `${slug}-${id}`;
    }
    
    return slug;
};
