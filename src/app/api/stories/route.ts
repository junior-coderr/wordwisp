import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import authOptions from "@/app/api/auth/[...nextauth]/option";
import { Story, StoryMedia } from '../model/storie';
import User from '../model/user';
import { uploadToBlob, generateBlobName } from '@/lib/azure-storage';
import { uploadToGoogleCloud } from '@/lib/google-storage';
import connectDB from '../db/connect';


interface StoryResponse {
  message: string;
  storyId: string;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const formData = await req.formData();
    
    // Validate required fields
    const requiredFields = ['storyTitle', 'description', 'genre', 'noOfChapters'];
    for (const field of requiredFields) {
      if (!formData.get(field)) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const authorName = session.user.name || 'Anonymous';
    
    // Validate and sanitize file names before upload
    const coverFile = formData.get('cover') as File;
    if (!coverFile?.name) {
      throw new Error('Invalid cover file name');
    }

    const coverBuffer = Buffer.from(await coverFile.arrayBuffer());
    const coverBlobName = generateBlobName(coverFile.name);
    const coverUrl = await uploadToBlob('story-covers', coverBlobName, coverBuffer, coverFile.name);

    const previewFile = formData.get('previewAudio') as File;
    if (!previewFile?.name) {
      throw new Error('Invalid preview audio file name');
    }

    const previewBuffer = Buffer.from(await previewFile.arrayBuffer());
    const previewUrl = await uploadToGoogleCloud(
      previewFile.name,
      previewBuffer,
      previewFile.type || 'audio/mpeg'
    );
    
    if (!isValidUrl(previewUrl)) {
      throw new Error('Invalid preview audio URL generated');
    }

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

    // Validate chapter data
    const numChapters = parseInt(formData.get('noOfChapters') as string);
    if (isNaN(numChapters) || numChapters < 1) {
      return NextResponse.json(
        { error: 'Invalid number of chapters' },
        { status: 400 }
      );
    }

    // Upload chapter audios to Google Cloud
    const chapterAudios = [];

    for (let i = 0; i < numChapters; i++) {
      const chapterAudioFile = formData.get(`chapter${i}Audio`) as File;
      if (!chapterAudioFile?.name) {
        throw new Error(`Invalid chapter ${i} audio file name`);
      }

      const chapterBuffer = Buffer.from(await chapterAudioFile.arrayBuffer());
      const audioUrl = await uploadToGoogleCloud(
        chapterAudioFile.name,
        chapterBuffer,
        chapterAudioFile.type || 'audio/mpeg'
      );

      if (!isValidUrl(audioUrl)) {
        throw new Error(`Invalid URL generated for chapter ${i + 1}`);
      }

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

    const response: StoryResponse = { 
      message: 'Story uploaded successfully',
      storyId: story._id.toString()
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Upload error details:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Error uploading story',
        details: error instanceof Error ? error.stack : undefined
      }, 
      { status: 500 }
    );
  }
}

// Add URL validation helper
function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === 'https:' && 
           url.hostname === 'storage.googleapis.com' &&
           url.pathname.length > 1;
  } catch {
    return false;
  }
}
