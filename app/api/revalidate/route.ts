import { revalidatePath } from 'next/cache';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const secret = body.secret;

    if (!secret || secret !== process.env.REVALIDATION_SECRET) {
      return Response.json({ message: 'Invalid secret' }, { status: 401 });
    }

    revalidatePath('/'); // Homepage

    return Response.json({ 
      revalidated: true, 
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return Response.json({ message: 'Error revalidating' }, { status: 500 });
  }
}
