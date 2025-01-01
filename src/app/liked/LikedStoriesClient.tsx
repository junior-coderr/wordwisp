'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from "@/components/ui/badge";

interface Story {
  _id: string;
  title: string;
  coverImage: string;
  authorName: string;
  premiumStatus: boolean;
}

export default function LikedStoriesClient({ initialStories }: { initialStories: Story[] }) {
  if (initialStories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No liked stories yet.</p>
        <Link 
          href="/library" 
          className="text-[#5956E9] hover:underline inline-flex items-center gap-2 mt-4"
        >
          Browse Library
          <svg 
            className="w-4 h-4" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {initialStories.map((story, index) => (
        <motion.div
          key={story._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Link href={`/books/${story._id}`}>
            <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
              <div className="aspect-[3/4] relative">
                <Image
                  src={story.coverImage}
                  alt={story.title}
                  fill
                  className="object-cover"
                />
                <Badge 
                  variant={story.premiumStatus ? "default" : "secondary"}
                  className="absolute top-3 right-3"
                >
                  {story.premiumStatus ? 'Premium' : 'Free'}
                </Badge>
              </div>
              <div className="p-4">
                <h2 className="font-semibold text-gray-900 mb-1">{story.title}</h2>
                <p className="text-sm text-gray-500">by {story.authorName}</p>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
