import { sanitizeInput } from "@/lib/email";

interface ContactEmailData {
  name: string;
  email: string;
  message: string;
}

export function contactAdminEmailTemplate(data: ContactEmailData) {
  return `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission - Central Park News</title>
    <style>
        body {
            background: #e8e8e8;
            margin: 0;
            padding: 40px 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            background: #f5f5f5;
            padding: 30px 0;
            text-align: center;
        }
        .header img {
            max-width: 220px;
            height: auto;
        }
        .content {
            padding: 40px 50px;
        }
        .info-top {
            margin-bottom: 25px;
            font-size: 15px;
        }
        .info-top p {
            margin: 4px 0;
        }
        .label {
            font-weight: 600;
            color: #6b6b6b;
        }
        .message-title {
            font-size: 16px;
            font-weight: 600;
            margin: 10px 0;
            color: #6b6b6b;
        }
        .message-box {
            background: #f9f9f9;
            padding: 15px 18px;
            border-left: 4px solid #6b6b6b;
            border-radius: 4px;
            white-space: pre-wrap;
            font-size: 15px;
            line-height: 1.6;
        }

        @media (max-width: 600px) {
            .content { padding: 30px 25px; }
            .header img { max-width: 200px; }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <img src="${
              process.env.NEXT_PUBLIC_SITE_URL
            }logo.png" alt="Central Park News logo" title="Contact form email header">
        </div>

        <div class="content">
            <div class="info-top">
                <p><span class="label">Name:</span> ${sanitizeInput(
                  data.name
                )}</p>
                <p><span class="label">Email:</span> <a href="mailto:${
                  data.email
                }">${data.email}</a></p>
                <p><span class="label">Date:</span> ${new Date().toLocaleString()}</p>
            </div>
            <p class="message-title">Message:</p>
            <div class="message-box">
                ${sanitizeInput(data.message)}
            </div>

        </div>
    </div>
</body>
</html>

  `;
}