import { getServerSession } from 'next-auth';
import authOptions  from '../api/auth/[...nextauth]/option';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";
import { BackButton } from '../profile/components/BackButton';
import LikedStoriesClient from './LikedStoriesClient';
import dbConnect from '@/app/api/db/connect';
import User from '@/app/api/model/user';
import {Story} from '../api/model/storie';

async function getLikedStories(email: string) {
  await dbConnect();
  
  try {
    const user = await User.findOne({ email: email });
    if (!user) return [];

    const stories = await Story.find({
      '_id': { $in: user.likedStories }
    }).select('title coverImage authorName premiumStatus');

    return stories;
  } catch (error) {
    console.error('Error fetching liked stories:', error);
    return [];
  }
}

export default async function LikedStoriesPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/');
  }

  const stories = await getLikedStories(session.user.email);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <BackButton />
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Liked Stories
            </h1>
          </div>
        </div>

        <LikedStoriesClient initialStories={stories} />
      </div>
    </div>
  );
}
