import { Inter } from 'next/font/google';
import BackgroundShapes from '@/components/BackgroundShapes';
import HomeClient from '@/components/HomeClient';
import { getServerSession } from 'next-auth';
import authOptions from './api/auth/[...nextauth]/option';
import connectDB from './api/db/connect';
import { Story } from './api/model/storie';

const inter = Inter({ subsets: ['latin'] });

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  await connectDB();
  
  // Fetch top 3 most listened stories
  const popularStories = await Story
    .find({})
    .sort({ listens: -1 })
    .limit(3)
    .select('title authorName coverImage genre')
    .lean();

  // Transform the data to match the expected format
  const books = popularStories.map(story => ({
    title: story.title,
    author: story.authorName,
    image: story.coverImage,
    category: story.genre,
    id: story._id.toString()
  }));

  return (
    <div className={`bg-[#5956E9] ${inter.className}`}>
      <BackgroundShapes />
      <HomeClient books={books} session={session} />
    </div>
  );
}
