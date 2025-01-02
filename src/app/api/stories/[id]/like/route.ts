import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import authOptions  from '@/app/api/auth/[...nextauth]/option';
import { Story } from '@/app/api/model/storie';
import User from '@/app/api/model/user';
import connectDB from '@/app/api/db/connect';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const storyId = params.id;
    const isLiked = user.likedStories?.includes(storyId);

    if (isLiked) {
      // Unlike the story
      await User.findByIdAndUpdate(user._id, {
        $pull: { likedStories: storyId }
      });
    } else {
      // Like the story
      await User.findByIdAndUpdate(user._id, {
        $addToSet: { likedStories: storyId }
      });
    }

    return NextResponse.json({ 
      success: true, 
      liked: !isLiked 
    });

  } catch (error) {
    console.error('Error in like handler:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ liked: false });
    }

    await connectDB();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ liked: false });
    }

    const isLiked = user.likedStories?.includes(params.id) || false;
    return NextResponse.json({ liked: isLiked });

  } catch (error) {
    console.error('Error in like status check:', error);
    return NextResponse.json({ liked: false });
  }
}
