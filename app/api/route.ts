import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SendGridApiKey!);

export async function POST(request: Request) {
    const { email } = await request.json();

    // check if the exists already in the subscribe user collection inside /blog/blockchainBriefing/subscribeUsers
    // const subscribeUser = await getDoc(doc(db, "blog", "blockchainBriefing", "subscribeUsers", email));
    // if (subscribeUser.exists()) {
    //     return NextResponse.json({ message: "Email already exists" }, { status: 400 });
    // }

    // add the email to the subscribe user collection
    // await setDoc(doc(db, "blog", "blockchainBriefing", "subscribeUsers", email), {
    //     email: email,
    //     createdAt: new Date(),
    // });

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
            // Removed custom_fields for now
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

    
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Blockchain Briefing</title>
        <style>
            body {
                background: #f4f4f4;
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
            }
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background: #fff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 10px rgba(0,0,0,0.07);
            }
            .header {
                background: #181818;
                padding: 24px 0 12px 0;
                text-align: center;
            }
            .header img {
                max-width: 120px;
                height: auto;
            }
            .content {
                padding: 32px 24px 24px 24px;
            }
            .card {
                border-left: 5px solid #1e3d5a; 
                background: #fafbfc;
                padding: 24px 20px;
                margin-top: 16px;
                border-radius: 6px;
            }
            .card p {
                margin: 0 0 12px 0;
                color: #333;
                font-size: 15px;
            }
            .card strong {
                color: #181818;
            }
            .cta-btn {
                display: inline-block;
                background: #1e3d5a;
                color: #fff !important;
                text-decoration: none;
                padding: 12px 28px;
                border-radius: 4px;
                font-weight: bold;
                margin: 18px 0 0 0;
                font-size: 16px;
                text-align: center;
            }
            .footer {
                text-align: center;
                color: #888;
                font-size: 13px;
                padding: 24px 0 12px 0;
            }
            .footer a {
                color: #1e3d5a;
                text-decoration: none;
                margin: 0 8px;
            }
            @media (max-width: 600px) {
                .content, .card { padding: 16px 8px; }
                .header { padding: 16px 0 8px 0; }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <img src="${process.env.NEXT_PUBLIC_SITE_URL}/blockchain-logo.png" alt="Blockchain Briefing Logo">
            </div>
            <div class="content">
                <p>Hello,</p>
                <div class="card">
                    <p>Welcome to Blockchain Briefing! You've just joined a community of crypto enthusiasts, developers, and investors who stay ahead of the curve with our daily/weekly insights on:</p>
                    <p><strong>🔹 Bitcoin & Ethereum trends<br>
                    🔹 DeFi protocols and airdrops<br>
                    🔹 NFTs and metaverse updates<br>
                    🔹 Regulatory shifts and Web3 innovations</strong></p>
                    <p>Not your thing? No hard feelings—<a href="#" style="color:#1e3d5a;text-decoration:underline;">unsubscribe here</a>. Otherwise, buckle up for alpha!</p>
                    <p style="margin-top:18px;"><em>To decentralization,<br>The Blockchain Briefing Team</em></p>
                </div>
            </div>
            <div class="footer">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}">Website</a> | 
                <a href="mailto:contact@blockchainbriefing.com">Contact Email</a>
            </div>
        </div>
    </body>
    </html>
    `;
    
    const msg = {
        to: email,
        from: "settlement@scottbaronassociates.com",
        subject: "Welcome to Blockchain Briefing - Stay Informed!",
        html: html,
    }

    try {
        await sgMail.send(msg);
        return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error sending email" }, { status: 500 });
    }
}