// send-email helper

import { NextRequest } from "next/server";

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, "").slice(0, 500);
};

export const getClientIp = (req: NextRequest): string => {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
  return ip;
};

// export const toEmail = "newstrix@blackacre.company";
export const toEmail = "passplay62@gmail.com";
export const fromEmail = "newstrix@blackacre.company";