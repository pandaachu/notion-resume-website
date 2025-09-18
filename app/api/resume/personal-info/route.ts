import { NextResponse } from 'next/server';
import * as notionService from '@/lib/notion/service';

export async function GET() {
  try {
    const personalInfo = await notionService.getPersonalInfo();

    return NextResponse.json(personalInfo, {
      headers: {
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error fetching personal info:', error);
    return NextResponse.json({ error: 'Failed to fetch personal info' }, { status: 500 });
  }
}
