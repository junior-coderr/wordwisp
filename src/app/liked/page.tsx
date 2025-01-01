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
      <div className="max-w-7xl mx-auto">
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="border-b border-gray-200 pb-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BackButton />
              </div>
              <h1 className="ml-4 text-2xl font-semibold leading-6 text-gray-900">
                Liked Stories
              </h1>
            </div>
          </div>
          
          <div className="mt-6">
            <LikedStoriesClient initialStories={stories} />
          </div>
        </div>
      </div>
    </div>
  );
}
