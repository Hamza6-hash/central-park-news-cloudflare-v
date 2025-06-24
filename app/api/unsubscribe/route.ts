import { NextResponse } from "next/server";
import { HashBasedToken } from "@/lib/unsubscribeToken";
import { doc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

export async function POST(request: Request) {
    try {
        const { email, token } = await request.json();

        // Validate required parameters
        if (!email || !token) {
            return NextResponse.json(
                { error: 'Email and token are required' },
                { status: 400 }
            );
        }

        console.log(`Processing unsubscribe request for email: ${email}`);

        // Verify the secure hash-based token
        const verification = await HashBasedToken.verifyToken(email, token);
        
        if (!verification.valid) {
            console.error('Token verification failed:', verification.error);
            return NextResponse.json(
                { 
                    error: verification.error || 'Invalid or expired unsubscribe token',
                    details: 'The unsubscribe link may have expired or been used already'
                },
                { status: 400 }
            );
        }

        // Mark token as used immediately (prevent reuse attacks)
        await HashBasedToken.markTokenAsUsed(email);

        // Step 1: Remove from Firebase subscriber collection
        const userDoc = doc(db, "blog", "blockchainBriefing", "subscribeUsers", email);
        const userExists = await getDoc(userDoc);
        
        let removedFromFirebase = false;
        if (userExists.exists()) {
            await deleteDoc(userDoc);
            removedFromFirebase = true;
            console.log(`Removed ${email} from Firebase`);
        } else {
            console.log(`Email ${email} not found in Firebase subscribers`);
        }

        // Step 2: Remove from SendGrid
        const SENDGRID_API_KEY = process.env.SendGridApiKey;
        let removedFromSendGrid = false;
        
        if (SENDGRID_API_KEY) {
            try {
                console.log(`Searching for ${email} in SendGrid...`);
                
                // Search for contact by email
                const searchResponse = await fetch('https://api.sendgrid.com/v3/marketing/contacts/search/emails', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        emails: [email]
                    }),
                });

                if (searchResponse.ok) {
                    const searchData = await searchResponse.json();
                    
                    if (searchData.result && searchData.result.length > 0) {
                        const contactId = searchData.result[0].contact.id;
                        console.log(`Found contact ID: ${contactId} for ${email}`);

                        // Delete contact from SendGrid completely
                        const deleteResponse = await fetch(`https://api.sendgrid.com/v3/marketing/contacts?ids=${contactId}`, {
                            method: 'DELETE',
                            headers: {
                                'Authorization': `Bearer ${SENDGRID_API_KEY}`,
                            },
                        });

                        if (deleteResponse.ok) {
                            removedFromSendGrid = true;
                            console.log(`Successfully deleted ${email} from SendGrid`);
                        } else {
                            const errorData = await deleteResponse.json();
                            console.error('SendGrid deletion failed:', errorData);
                        }
                    } else {
                        console.log(`Contact ${email} not found in SendGrid`);
                    }
                } else {
                    const searchError = await searchResponse.json();
                    console.error('SendGrid search failed:', searchError);
                }
            } catch (sendGridError) {
                console.error('SendGrid API error:', sendGridError);
                // Don't fail the entire request if SendGrid fails
            }
        } else {
            console.warn('SendGrid API key not configured');
        }

        // Step 3: Optional - Add to global suppression list (prevents accidental re-adds)
        if (SENDGRID_API_KEY) {
            try {
                const suppressResponse = await fetch('https://api.sendgrid.com/v3/asm/suppressions/global', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        recipient_emails: [email]
                    }),
                });

                if (suppressResponse.ok) {
                    console.log(`Added ${email} to global suppression list`);
                } else {
                    console.error('Failed to add to suppression list:', await suppressResponse.text());
                }
            } catch (suppressError) {
                console.error('Suppression list error:', suppressError);
            }
        }

        // Return success response
        return NextResponse.json({ 
            message: 'Successfully unsubscribed from all future emails',
            email: email,
            details: {
                removedFromDatabase: removedFromFirebase,
                removedFromMailingList: removedFromSendGrid,
                timestamp: new Date().toISOString()
            }
        }, { status: 200 });

    } catch (error) {
        console.error('Unsubscribe error:', error);
        return NextResponse.json(
            { 
                error: 'Failed to process unsubscribe request',
                message: 'An internal error occurred. Please try again or contact support.'
            },
            { status: 500 }
        );
    }
}