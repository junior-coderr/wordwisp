import AudioPlayer from "./AudioPlayer";
import connectDB from "@/app/api/db/connect";
import { Story, StoryMedia } from "@/app/api/model/storie";
import { getServerSession } from "next-auth";
import authOptions  from "@/app/api/auth/[...nextauth]/option";
import { redirect, notFound } from "next/navigation";
import {ListenerTrack} from "../../api/model/storie"; // Assuming ListenerTrack is imported from the correct path

let chapters = [
];

// Story metadata configuration
let story = {
  title: '',
  author: '',
  cover: '',
};

export default async function ListenPage({ params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    await connectDB();

    // Validate story exists first
    const story2 = await Story.findById(params.id)
      .select('title description coverImage genre authorName premiumStatus createdAt previewAudio')
      .lean();

    if (!story2) {
      notFound();
    }

    // If premium content and no session, redirect to login
    if (story2.premiumStatus && !session?.user?.email) {
      redirect("/sign-in");
    }

    // Track listen only if user is logged in
    if (session?.user?.email) {
      try {
        const existingListener = await ListenerTrack.findOne({
          storyId: params.id,
          userEmail: session.user.email
        });

        if (!existingListener) {
          await Promise.all([
            Story.findByIdAndUpdate(params.id, { $inc: { listens: 1 } }),
            ListenerTrack.create({
              storyId: params.id,
              userEmail: session.user.email
            })
          ]);
        }
      } catch (error) {
        console.error('Failed to track listen:', error);
      }
    }

    story = {
      title: story2.title,
      author: story2.authorName,
      cover: story2.coverImage,
    };

    // Fetch chapters data
    const storyMedia = await StoryMedia.findOne({ storyId: params.id })
      .select('chapterAudios')
      .lean();

    if (!storyMedia?.chapterAudios?.length) {
      throw new Error('No chapters found for this story');
    }

    chapters = storyMedia.chapterAudios.map((chapter, index) => ({
      title: chapter.title,
      duration: chapter.duration_inMinutes,
      active: index === 0,
      audioUrl: chapter.audioUrl,
    }));

    return <AudioPlayer story={story} chapters={chapters} />;
    
  } catch (error) {
    if (error instanceof Error) {
      // throw new Error(`Failed to load story`);
      console.error('Failed to load story:', error);
    }
    throw new Error('Failed to load story');
  }
}
