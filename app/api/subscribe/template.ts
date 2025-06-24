export function subscribeTemplate(unsubscribeUrl: string) {
  return `
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
                    <p>Not your thing? No hard feelings—<a href="${unsubscribeUrl}" style="color:#1e3d5a;text-decoration:underline;">unsubscribe here</a>. Otherwise, buckle up for alpha!</p>
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
}
