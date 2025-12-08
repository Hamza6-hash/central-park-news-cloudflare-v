import { NextRequest, NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";
import { adminDb } from "@/lib/firebaseAdmin";
import { contactAdminEmailTemplate } from "./templet";
import {
  fromEmail,
  getClientIp,
  sanitizeInput,
  toEmail,
  validateEmail,
} from "@/lib/email";

sgMail.setApiKey(process.env.SendGridApiKey!);

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

const COOLDOWN_MINUTES = 5;
const COOLDOWN_MS = COOLDOWN_MINUTES * 60 * 1000;

const checkCooldown = async (
  email: string,
  ip: string
): Promise<{ allowed: boolean; remainingSeconds?: number }> => {
  try {
    const now = new Date();
    const contactsRef = adminDb
      .collection("blog")
      .doc("centralparkNews")
      .collection("contacts");

    // Query for recent submissions by email
    const emailQuery = await contactsRef
      .where("email", "==", email)
      .where("expiresAt", ">", now)
      .limit(1)
      .get();

    if (!emailQuery.empty) {
      const doc = emailQuery.docs[0];
      const expiresAt = doc.data().expiresAt.toDate();
      const remaining = Math.ceil((expiresAt.getTime() - now.getTime()) / 1000);
      return { allowed: false, remainingSeconds: remaining };
    }

    // Query for recent submissions by IP
    const ipQuery = await contactsRef
      .where("ip", "==", ip)
      .where("expiresAt", ">", now)
      .limit(1)
      .get();

    if (!ipQuery.empty) {
      const doc = ipQuery.docs[0];
      const expiresAt = doc.data().expiresAt.toDate();
      const remaining = Math.ceil((expiresAt.getTime() - now.getTime()) / 1000);
      return { allowed: false, remainingSeconds: remaining };
    }

    return { allowed: true };
  } catch (error) {
    console.error("Error checking cooldown:", error);
    return { allowed: true };
  }
};

const createAdminEmail = (data: ContactFormData) => {
  const subject = `Central Park News Contact`;
  const htmlContent = contactAdminEmailTemplate(data);
  return { subject, htmlContent };
};

const saveSubmissionToDb = async (data: ContactFormData, ip: string) => {
  try {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + COOLDOWN_MS);

    const contactsRef = adminDb
      .collection("blog")
      .doc("centralparkNews")
      .collection("contacts");

    // Query for existing submission by email
    const existingQuery = await contactsRef
      .where("email", "==", data.email)
      .limit(1)
      .get();

    if (!existingQuery.empty) {
      // Update existing document
      const docId = existingQuery.docs[0].id;
      await contactsRef.doc(docId).update({
        name: sanitizeInput(data.name),
        message: sanitizeInput(data.message),
        ip,
        submittedAt: now,
        expiresAt,
        updatedAt: new Date(),
      });
    } else {
      // Create new document
      await contactsRef.add({
        name: sanitizeInput(data.name),
        email: data.email,
        message: sanitizeInput(data.message),
        ip,
        submittedAt: now,
        expiresAt,
        createdAt: new Date(),
      });
    }
  } catch (error) {
    console.error("Error saving submission to DB:", error);
    // Don't throw - we still want to send the email
  }
};

export async function POST(req: NextRequest) {
  try {
    const body: ContactFormData = await req.json();
    const clientIp = getClientIp(req);

    // Validate required fields first
    if (!body.name || body.name.trim().length === 0) {
      return NextResponse.json(
        { message: "Name is required." },
        { status: 400 }
      );
    }

    if (!body.email || !validateEmail(body.email)) {
      return NextResponse.json(
        { message: "Invalid email address." },
        { status: 400 }
      );
    }

    if (!body.message || body.message.trim().length < 10) {
      return NextResponse.json(
        { message: "Message must be at least 10 characters." },
        { status: 400 }
      );
    }

    // Check cooldown in Firebase
    const cooldownCheck = await checkCooldown(body.email, clientIp);

    if (!cooldownCheck.allowed) {
      const mins = Math.ceil((cooldownCheck.remainingSeconds || 60) / 60);
      return NextResponse.json(
        {
          message: `Please wait ${mins} minute(s) before submitting again.`,
          remainingSeconds: cooldownCheck.remainingSeconds,
        },
        { status: 429 }
      );
    }

    const { subject, htmlContent } = createAdminEmail(body);

    // Send email to admin
    await sgMail.send({
      to: toEmail,
      from: fromEmail,
      subject,
      html: htmlContent,
      replyTo: body.email,
    });

    // Save or update submission in Firebase (with cooldown expiry)
    await saveSubmissionToDb(body, clientIp);

    return NextResponse.json(
      { message: "Message sent successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);

    return NextResponse.json(
      { message: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
