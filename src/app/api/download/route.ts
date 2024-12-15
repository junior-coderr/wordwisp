export async function GET(request: Request) {
  const url = new URL(request.url);
  const audioUrl = url.searchParams.get('url');

  if (!audioUrl) {
    return new Response('Missing URL parameter', { status: 400 });
  }

  try {
    const response = await fetch(audioUrl);
    const blob = await response.blob();

    return new Response(blob, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'attachment; filename="audio.mp3"',
      },
    });
  } catch (error) {
    return new Response('Download failed', { status: 500 });
  }
}
