import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import authOptions from "@/app/api/auth/[...nextauth]/option";
import { Story, StoryMedia } from '../model/storie';
import User from '../model/user';
import { uploadToBlob, generateBlobName } from '@/lib/azure-storage';
import { uploadToGoogleCloud } from '@/lib/google-storage';
import connectDB from '../db/connect';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const authorName = session.user.name || 'Anonymous';
    const formData = await req.formData();
    
    // Upload cover image to Azure Blob
    const coverFile = formData.get('cover') as File;
    const coverBuffer = Buffer.from(await coverFile.arrayBuffer());
    const coverBlobName = generateBlobName(coverFile.name);
    const coverUrl = await uploadToBlob('story-covers', coverBlobName, coverBuffer, coverFile.name);

    // Upload preview audio to Google Cloud
    const previewFile = formData.get('previewAudio') as File;
    const previewBuffer = Buffer.from(await previewFile.arrayBuffer());
    const previewUrl = await uploadToGoogleCloud(
      previewFile.name,
      previewBuffer,
      previewFile.type || 'audio/mpeg'
    );

    // Create the story document
    const story = await Story.create({
      title: formData.get('storyTitle'),
      description: formData.get('description'),
      premiumStatus: formData.get('premiumStatus') === 'true',
      genre: formData.get('genre'),
      coverImage: coverUrl,
      previewAudio: previewUrl,
      author: session.user.email,
      authorName: authorName,
      noOfChapters: parseInt(formData.get('noOfChapters') as string),
    });

    // Upload chapter audios to Google Cloud
    const chapterAudios = [];
    const numChapters = parseInt(formData.get('noOfChapters') as string);

    for (let i = 0; i < numChapters; i++) {
      const chapterAudioFile = formData.get(`chapter${i}Audio`) as File;
      const chapterBuffer = Buffer.from(await chapterAudioFile.arrayBuffer());
      const audioUrl = await uploadToGoogleCloud(
        chapterAudioFile.name,
        chapterBuffer,
        chapterAudioFile.type || 'audio/mpeg'
      );

      const duration = parseFloat(formData.get(`chapter${i}Duration`) as string) || 0;

      chapterAudios.push({
        title: formData.get(`chapter${i}Title`),
        order: i + 1,
        audioUrl: audioUrl,
        duration_inMinutes: duration
      });
    }

    await StoryMedia.create({
      storyId: story._id,
      chapterAudios
    });

    // Update user's storiesUploaded array and stats
    await User.findOneAndUpdate(
      { email: session.user.email },
      {
      $push: { storiesUploaded: story._id },
      $set: { userType: 'creator' } // Ensure user is marked as creator
      }
    );

    return NextResponse.json({ 
      message: 'Story uploaded successfully',
      storyId: story._id 
    });

  } catch (error) {
    console.error('Error uploading story:', error);
    return NextResponse.json(
      { error: 'Error uploading story' }, 
      { status: 500 }
    );
  }
}
