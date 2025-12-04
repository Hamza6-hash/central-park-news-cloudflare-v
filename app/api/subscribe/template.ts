import { liveUrl } from "@/lib/utils";

export function subscribeTemplate(unsubscribeUrl: string) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Central Park News</title>
        <style>
            body {
                background: #ffffff;
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
                border-radius: 0;
                overflow: hidden;
            }
            .header {
                background: #ffffff;
                padding: 0 0 40px 0;
                text-align: center;
                border-bottom: none;
            }
            .header img {
                max-width: 280px;
                height: auto;
            }
            .content {
                background: #e8e8e8;
                padding: 60px 80px;
                margin: 0;
            }
            .content p {
                margin: 0 0 20px 0;
                color: #333333;
                font-size: 16px;
                line-height: 1.6;
            }
            .content p:first-child {
                margin-bottom: 30px;
            }
            .brand-name {
                font-weight: 600;
                color: #333333;
            }
            .unsubscribe-link {
                color: #333333;
                text-decoration: underline;
            }
            .signature {
                margin-top: 40px;
                margin-bottom: 0;
            }
            .footer {
                background: #e8e8e8;
                text-align: center;
                color: #666666;
                font-size: 14px;
                padding: 40px 80px 60px 80px;
                margin: 0;
            }
            .footer a {
                color: #666666;
                text-decoration: none;
                margin: 0 4px;
            }
            .footer a:hover {
                text-decoration: underline;
            }
            @media (max-width: 600px) {
                .content { 
                    padding: 40px 30px; 
                }
                .footer { 
                    padding: 30px 30px 40px 30px; 
                }
                .header img {
                    max-width: 240px;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <img src="${liveUrl}/logo.png" alt="Central Park News Logo">
            </div>
            <div class="content">
                <p>Hello,</p>
                
                <p>Thanks for subscribing to <span class="brand-name">Central Park News</span> – your new source for updates and stories from Central Park and surrounding NYC areas.</p>
                
                <p>We'll send you regular updates so you never miss what's happening in the park and around the city.</p>
              
                <p class="signature">– The Central Park News Team</p>
            </div>
            <div class="footer">
                <a href="${liveUrl}">Website</a> | 
                <a href="${liveUrl}contact">Contact Email</a> | 
                <a href="${unsubscribeUrl}" class="unsubscribe-link">Unsubscribe From These Emails</a>
          
            </div>
        </div>
    </body>
    </html>
    `;
}
