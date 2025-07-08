import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { HashBasedToken } from "@/lib/unsubscribeToken";
import { subscribeTemplate } from "./template";

sgMail.setApiKey(process.env.SendGridApiKey!);

export async function POST(request: Request) {
    const { email } = await request.json();

    // Check if email already exists
    const subscribeUser = await getDoc(doc(db, "blog", "blockchainBriefing", "subscribeUsers", email));
    if (subscribeUser.exists()) {
        return NextResponse.json({ message: "Email already exists" }, { status: 400 });
    }

    // Generate secure unsubscribe token and store in user document
    const unsubscribeToken = await HashBasedToken.generateToken(email);

    const SENDGRID_API_KEY = process.env.SendGridApiKey;
    const SENDGRID_LIST_ID = process.env.SENDGRID_LIST_ID;

    if (!SENDGRID_API_KEY) {
        console.error('SendGrid API key not configured');
        return NextResponse.json(
            { error: 'Newsletter service not configured' },
            { status: 500 }
        );
    }

    // Add contact to SendGrid Marketing Campaigns
    const response = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${SENDGRID_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contacts: [
                {
                    email: email,
                }
            ],
            list_ids: SENDGRID_LIST_ID ? [SENDGRID_LIST_ID] : undefined,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('SendGrid API error:', errorData);
        return NextResponse.json(
            { error: 'Failed to subscribe to newsletter' },
            { status: 500 }
        );
    }

    // Create secure unsubscribe URL with both email and token
    const unsubscribeUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe?email=${encodeURIComponent(email)}&token=${encodeURIComponent(unsubscribeToken)}`;

    const html = subscribeTemplate(unsubscribeUrl);
    
    const msg = {
        to: email,
        from: "settlement@scottbaronassociates.com",
        subject: "Welcome to Blockchain Briefing - Stay Informed!",
        html: html,
    };

    try {
        await sgMail.send(msg);
        return NextResponse.json({ 
            message: "Email sent successfully"
        }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error sending email" }, { status: 500 });
    }
}