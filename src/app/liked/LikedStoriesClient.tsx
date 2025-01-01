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
  if (!initialStories?.length) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">No liked stories yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {initialStories.map((story, index) => (
        <Link href={`/books/${story._id}`} key={story._id}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative flex flex-col h-full"
          >
            <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden">
              <Image
                src={story.coverImage}
                alt={story.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              <Badge 
                variant={story.premiumStatus ? "default" : "secondary"}
                className="absolute top-2 right-2 text-xs"
              >
                {story.premiumStatus ? 'Premium' : 'Free'}
              </Badge>
            </div>
            <div className="mt-2 space-y-1">
              <h3 className="text-sm font-medium text-gray-900 group-hover:text-[#5956E9] transition-colors line-clamp-1">
                {story.title}
              </h3>
              <p className="text-xs text-gray-600">
                by {story.authorName}
              </p>
            </div>
          </motion.div>
        </Link>
      ))}
    </div>
  );
}
