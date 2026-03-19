import { NextResponse } from "next/server";
import { HashBasedToken } from "@/lib/unsubscribeToken";
import {
  getSubscribeUserByEmail,
  markSubscribeUserTokenUsed,
  deleteSubscribeUser,
} from "@/lib/services";

export async function POST(request: Request) {
  try {
    const { email, token } = await request.json();

    if (!email || !token) {
      return NextResponse.json(
        { error: "Email and token are required" },
        { status: 400 }
      );
    }

    const verification = await HashBasedToken.verifyToken(email, token);

    if (!verification.valid) {
      return NextResponse.json(
        {
          error: verification.error || "Invalid or expired unsubscribe token",
          details: "The unsubscribe link may have expired or been used already",
        },
        { status: 400 }
      );
    }

    await HashBasedToken.markTokenAsUsed(email);

    const userExists = await getSubscribeUserByEmail(email);
    let removedFromDatabase = false;

    if (userExists) {
      await deleteSubscribeUser(email);
      removedFromDatabase = true;
    }

    const SENDGRID_API_KEY = process.env.SendGridApiKey;
    let removedFromSendGrid = false;

    if (SENDGRID_API_KEY) {
      try {
        const searchResponse = await fetch(
          "https://api.sendgrid.com/v3/marketing/contacts/search/emails",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${SENDGRID_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ emails: [email] }),
          }
        );

        if (searchResponse.ok) {
          const searchData = await searchResponse.json();
          if (searchData.result?.length > 0) {
            const contactId = searchData.result[0].contact.id;
            const deleteResponse = await fetch(
              `https://api.sendgrid.com/v3/marketing/contacts?ids=${contactId}`,
              {
                method: "DELETE",
                headers: { Authorization: `Bearer ${SENDGRID_API_KEY}` },
              }
            );
            if (deleteResponse.ok) removedFromSendGrid = true;
          }
        }
      } catch (sendGridError) {
        console.error("SendGrid API error:", sendGridError);
      }
    }

    return NextResponse.json({
      message: "Successfully unsubscribed from all future emails",
      email,
      details: {
        removedFromDatabase,
        removedFromMailingList: removedFromSendGrid,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return NextResponse.json(
      {
        error: "Failed to process unsubscribe request",
        message: "An internal error occurred. Please try again or contact support.",
      },
      { status: 500 }
    );
  }
}
