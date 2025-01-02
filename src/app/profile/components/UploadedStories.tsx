'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Story } from "@/app/api/model/storie";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { MoreVertical, Edit, Trash2, Eye, Share2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useRouter, useSearchParams } from 'next/navigation';
import { Badge } from "@/components/ui/badge"; // Add this import

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

// Replace sheetVariants with popupVariants
const popupVariants = {
  hidden: { 
    opacity: 0,
    scale: 0.95
  },
  visible: { 
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      duration: 0.3,
      bounce: 0.2
    }
  },
  exit: { 
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2
    }
  }
};

// Add a new helper function to format date consistently
const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

interface UploadedStoriesProps {
  stories: Story[];
  isLoading?: boolean;
}

const StoryGrid = ({ items, showDetails = false }: { items: Story[], showDetails?: boolean }) => (
  <motion.div
    className="grid grid-cols-1 gap-4"
    variants={containerVariants}
    initial="hidden"
    animate="show"
  >
    {items.map((story) => (
      <motion.div key={story._id} variants={itemVariants}>
        <div className="bg-white rounded-lg overflow-hidden shadow-sm border">
          <div className="flex gap-4 p-4">
            <div className="relative w-[120px] h-[160px] flex-shrink-0">
              <Image
                src={story.coverImage}
                alt={story.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 truncate">
                    {story.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Published {new Date(story.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" /> View Story
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" /> Edit Story
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share2 className="h-4 w-4 mr-2" /> Share Story
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" /> Delete Story
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {showDetails && (
                <div className="mt-3 space-y-2">
                  <p className="text-sm text-gray-600 line-clamp-2">{story.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-[#5956E9]">
                      {story.isPremium ? `$${story.price}` : 'Free'}
                    </span>
                    <span className="text-gray-500">
                      {story.totalListens || 0} listens
                    </span>
                    <span className="text-gray-500">
                      {story.totalLikes || 0} likes
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    ))}
  </motion.div>
);

// Update the DetailedStoryCard component
const DetailedStoryCard = ({ story }: { story: Story }) => (
  <motion.div variants={itemVariants} className="bg-white rounded-lg overflow-hidden border shadow-sm">
    <div className="flex flex-col">
      <div className="relative h-[200px]">
        <Image
          src={story.coverImage}
          alt={story.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {/* Add status badge */}
        {/* <Badge 
          variant={story.premiumStatus ? "default" : "secondary"} 
          className="absolute top-4 left-4"
        >
          {story.premiumStatus ? 'Premium' : 'Free'}
        </Badge> */}
        <div className="absolute top-4 right-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="bg-white/90 backdrop-blur-sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="h-4 w-4 mr-2" /> View Story
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" /> Edit Story
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="h-4 w-4 mr-2" /> Share Story
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" /> Delete Story
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg text-gray-900">{story.title}</h3>
          <p className="text-sm text-gray-500">
            Published {formatDate(story.createdAt)}
          </p>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">{story.description}</p>
        <div className="pt-3 border-t space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant={story.premiumStatus ? "default" : "outline"}>
                {story.premiumStatus ? 'Premium' : 'Free'}
              </Badge>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {story.totalListens || 0}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {story.totalLikes || 0}
              </span>
            </div>
          </div>
          <Link href={`/stories/${story._id}`} className="block">
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </motion.div>
);

export function UploadedStories({ stories, isLoading }: UploadedStoriesProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDrawerOpen = searchParams.get('view') === 'all-stories';

  const handleOpenChange = (open: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (open) {
      params.set('view', 'all-stories');
    } else {
      params.delete('view');
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const previewStories = stories?.slice(0, 3);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
          <CardTitle>
              <span className="text-lg font-semibold text-gray-900">

                Your Uploaded Stories
                </span>
              </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-[300px] w-full rounded-lg" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (!stories?.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>
              <span className="text-lg font-semibold text-gray-900">

                Your Uploaded Stories
                </span>
              </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">You haven't uploaded any stories yet.</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
              <span className="text-xl font-semibold text-gray-900">

                Your Uploaded Stories
                </span>
              </CardTitle>
            {stories.length > 0 && (
              <Button 
                variant="ghost" 
                onClick={() => handleOpenChange(true)}
                className="text-[#5956E9] hover:text-[#4845c7]"
              >
                View All ({stories.length})
              </Button>
            )}
          </CardHeader>
          <CardContent className="p-4"> {/* Reduced padding for mobile */}
            <motion.div
              className="grid max-[480px]:grid-cols-2 min-[480px]:grid-cols-1 gap-3 sm:gap-4" // Changed to 2 columns on mobile
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {previewStories.map((story) => (
                <motion.div key={story._id} variants={itemVariants}>
                  <Link href={`/stories/${story._id}`}>
                    {/* Mobile layout (below 480px) */}
                    <div className="block max-[480px]:block min-[480px]:hidden">
                      <div className="group relative aspect-[3/4] overflow-hidden rounded-lg">
                        <Image
                          src={story.coverImage}
                          alt={story.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          sizes="50vw"
                        />
                        <Badge 
                          variant={story.premiumStatus ? "default" : "secondary"}
                          className="absolute top-2 left-2 z-10 px-2 py-0.5 text-xs"
                        >
                          {story.premiumStatus ? 'Premium' : 'Free'}
                        </Badge>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                          <h3 className="text-white font-semibold text-sm truncate">{story.title}</h3>
                          <p className="text-white/80 text-xs truncate">
                            {formatDate(story.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Horizontal card layout (above 480px) */}
                    <div className="hidden min-[480px]:block">
                      <div className="bg-white rounded-lg overflow-hidden shadow-sm border">
                        <div className="flex gap-4 p-4">
                          <div className="relative w-[120px] h-[160px] flex-shrink-0">
                            <Image
                              src={story.coverImage}
                              alt={story.title}
                              fill
                              className="object-cover rounded-lg"
                            />
                            <Badge 
                              variant={story.premiumStatus ? "default" : "secondary"}
                              className="absolute top-2 left-2 z-10 px-2 py-0.5 text-xs"
                            >
                              {story.premiumStatus ? 'Premium' : 'Free'}
                            </Badge>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg text-gray-900 truncate">{story.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">
                              Published {formatDate(story.createdAt)}
                            </p>
                            <p className="text-sm text-gray-600 line-clamp-2 mt-2">
                              {story.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      <Sheet open={isDrawerOpen} onOpenChange={handleOpenChange}>
        <SheetContent 
          side="right" 
          className="w-full p-0 sm:max-w-full border-l-0 !duration-300" // Added duration class
          // Remove default close button
          closeButton={false}
        >
          <motion.div 
            className="h-full bg-background"
            variants={popupVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="h-full flex flex-col max-w-[1400px] mx-auto">
              <SheetHeader className="p-6 border-b sticky top-0 bg-background/95 backdrop-blur-sm z-10">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 min-w-0"> {/* Add min-w-0 to prevent text overflow */}
                    <SheetTitle className="text-2xl truncate">All Published Stories</SheetTitle>
                    <p className="text-sm text-gray-500 mt-1 truncate">
                      Total {stories.length} stories
                    </p>
                  </div>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenChange(false)}
                    className="flex-shrink-0 hover:bg-gray-100 rounded-full w-8 h-8 p-0"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </Button>
                </div>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="max-w-[1400px] mx-auto">
                  <motion.div
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                  >
                    {stories.map((story) => (
                      <DetailedStoryCard key={story._id} story={story} />
                    ))}
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </SheetContent>
      </Sheet>
    </>
  );
}
