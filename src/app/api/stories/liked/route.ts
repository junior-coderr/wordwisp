import { NextResponse, NextRequest } from 'next/server';
import { Story } from '../../model/storie';
import connectDB from '../../db/connect';
import { getToken } from 'next-auth/jwt';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const stories = await Story.find({
      likes: token.sub // using sub from JWT token which contains the user ID
    })
    .select('title description coverImage genre authorName premiumStatus createdAt')
    .sort({ createdAt: -1 })
    .lean();

    return NextResponse.json({ stories });
  } catch (error) {
    console.error('Error fetching liked stories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch liked stories' },
      { status: 500 }
    );
  }
}
