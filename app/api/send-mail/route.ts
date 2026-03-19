import { NextRequest, NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";
import { contactAdminEmailTemplate } from "./templet";
import {
  fromEmail,
  getClientIp,
  sanitizeInput,
  toEmail,
  validateEmail,
} from "@/lib/email";
import { checkContactCooldown, saveContactSubmission } from "@/lib/services";

sgMail.setApiKey(process.env.SendGridApiKey!);

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

const COOLDOWN_MINUTES = 1;
const COOLDOWN_MS = COOLDOWN_MINUTES * 60 * 1000;

const createAdminEmail = (data: ContactFormData) => {
  const subject = `Central Park News Contact`;
  const htmlContent = contactAdminEmailTemplate(data);
  return { subject, htmlContent };
};

export async function POST(req: NextRequest) {
  try {
    const body: ContactFormData = await req.json();
    const clientIp = getClientIp(req);

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

    const cooldownCheck = await checkContactCooldown(body.email, clientIp);

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

    await sgMail.send({
      to: toEmail,
      from: fromEmail,
      subject,
      html: htmlContent,
      replyTo: body.email,
    });

    const now = new Date();
    const expiresAt = new Date(now.getTime() + COOLDOWN_MS);
    await saveContactSubmission(
      sanitizeInput(body.name),
      body.email,
      sanitizeInput(body.message),
      clientIp,
      expiresAt
    );

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
