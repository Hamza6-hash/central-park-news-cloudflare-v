import { NextResponse } from 'next/server';
import { sitemapGenerator } from '@/lib/sitemapGenerator';

const CACHE_DURATION = 3600; 
const MAX_SITEMAPS = 100; 

export async function GET(request: Request) {
  const startTime = Date.now();
  
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '0');
    
    // Validate page parameter
    if (page < 0 || page > MAX_SITEMAPS) {
      return new NextResponse('Invalid page parameter', { status: 400 });
    }
    
    // Get sitemap from background generator
    const sitemapContent = await sitemapGenerator.getSitemap(page);
    
    if (!sitemapContent) {
      return new NextResponse('Sitemap not available', { status: 404 });
    }
    
    return new NextResponse(sitemapContent, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': `public, max-age=${CACHE_DURATION}`,
        'X-Generation-Time': `${Date.now() - startTime}ms`,
        'X-Sitemap-Page': page.toString(),
      },
    });
    
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { 
      status: 500,
      headers: {
        'X-Generation-Time': `${Date.now() - startTime}ms`,
      }
    });
  }
}