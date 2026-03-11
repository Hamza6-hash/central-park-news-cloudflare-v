import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns/format";
import { twMerge } from "tailwind-merge";
import { object, string } from "zod";
import { stripMarkdown } from "./query";

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

export function formatDateToISO(date: any): string {
  if (!date) return new Date().toISOString();
  
  if (date.seconds) {
    return new Date(date.seconds * 1000).toISOString();
  }
  
  // If it's already a string, try to parse it
  if (typeof date === 'string') {
    const parsed = new Date(date);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  }
  
  // If it's a Date object
  if (date instanceof Date) {
    return date.toISOString();
  }
  
  return new Date().toISOString();
}


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

/**
 * Creates concise anchor text for SEO optimization
 * Limits to 60 characters or 8 words maximum for better SEO
 * @param text - The full text to truncate
 * @param maxLength - Maximum character length (default: 60)
 * @param maxWords - Maximum word count (default: 8)
 * @returns Concise anchor text optimized for SEO
 */
export const getConciseAnchorText = (
    text: string, 
    maxLength: number = 60, 
    maxWords: number = 8
): string => {
    if (!text) return "Read article";
    const words = text.split(' ');
    
    // If text is already within limits, return as is
    if (words.length <= maxWords && text.length <= maxLength) return text;
    
    // Take first N words
    const firstWords = words.slice(0, maxWords).join(' ');
    
    // If first words are within length limit, return them
    if (firstWords.length <= maxLength) return firstWords;
    
    // Otherwise truncate at character limit with ellipsis
    return text.substring(0, maxLength - 3) + '...';
};

/**
 * Calculate reading time in minutes for an article
 * Average reading speed: 200 words per minute
 * @param content - The article content (text)
 * @returns Reading time in minutes (minimum 1)
 */
export const calculateReadingTime = (content: string): number => {
    if (!content) return 1;
    
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    
    return Math.max(1, readingTime);
};

export const liveUrl = "https://www.centralpark.news"

export function extractFaqsFromMarkdown(content: string) {
  const faqRegex = /\*\*(.+?)\*\*\s+([\s\S]+?)(?=\n\n\*\*|$)/g;
  const faqs: { question: string; answer: string }[] = [];
  let match;

  while ((match = faqRegex.exec(content)) !== null) {
    const question = match[1].trim();
    const answer = stripMarkdown(match[2].trim());
    if (question && answer) {
      faqs.push({ question, answer });
    }
  }

  return faqs;
}