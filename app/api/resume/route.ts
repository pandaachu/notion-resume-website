import { NextResponse } from 'next/server'
import { getResumeData } from '../../../lib/notion'

export async function GET() {
  try {
    const resumeData = await getResumeData()
    console.log("🚀 ~ GET ~ resumeData:", resumeData)
    
    return NextResponse.json(resumeData, {
      headers: {
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400'
      }
    })
  } catch (error) {
    console.error('Error fetching resume data:', error)
    
    return NextResponse.json(
      { error: 'Failed to fetch resume data' },
      { status: 500 }
    )
  }
}