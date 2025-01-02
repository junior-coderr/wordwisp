import { NextResponse, NextRequest } from 'next/server';
import { Story } from '../../model/storie';
import connectDB from '../../db/connect';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const genre = searchParams.get('genre');
    
    await connectDB();

    const query = genre && genre !== 'all' ? { genre } : {};
    
    const [stories, totalStories] = await Promise.all([
      Story.find(query)
        .select('title description coverImage genre authorName premiumStatus createdAt')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Story.countDocuments(query)
    ]);

    return NextResponse.json({
      stories,
      totalPages: Math.ceil(totalStories / limit),
      currentPage: page,
      totalStories
    });
  } catch (error) {
    console.error('Error fetching stories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stories' },
      { status: 500 }
    );
  }
}
