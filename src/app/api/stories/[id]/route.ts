import { NextResponse } from 'next/server';
import { Story, StoryMedia } from '../../model/storie';
import connectDB from '../../db/connect';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const story = await Story.findById(params.id)
      .select('title description coverImage genre authorName premiumStatus createdAt previewAudio')
      .lean();

    if (!story) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      );
    }

    // Get preview chapter for public access
    const storyMedia = await StoryMedia.findOne({ storyId: params.id })
      .select('chapterAudios')
      .lean();

    const firstChapter = storyMedia?.chapterAudios[0] || null;

    // Calculate total duration
    const totalDuration = storyMedia?.chapterAudios.reduce(
      (total, chapter) => total + (chapter.duration_inMinutes || 0),
      0
    ) || 0;

    // Format duration as hours and minutes
    const hours = Math.floor(totalDuration / 60);
    const minutes = totalDuration % 60;
    const formattedDuration = `${hours}h ${minutes}m`;

    return NextResponse.json({
      ...story,
      duration: formattedDuration,
      previewChapter: firstChapter ? {
        title: firstChapter.title,
        audioUrl: firstChapter.audioUrl,
        duration: firstChapter.duration_inMinutes
      } : null
    });

  } catch (error) {
    console.error('Error fetching story:', error);
    return NextResponse.json(
      { error: 'Failed to fetch story' },
      { status: 500 }
    );
  }
}
