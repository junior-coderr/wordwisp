import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '../../db/connect';
import { Story } from '../../model/storie';
import authOptions from '../../auth/[...nextauth]/option';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const stories = await Story.find({
      likes: session.user.email
    }).sort({ createdAt: -1 });

    return NextResponse.json({ stories });
  } catch (error) {
    console.error('Error fetching liked stories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch liked stories' },
      { status: 500 }
    );
  }
}
