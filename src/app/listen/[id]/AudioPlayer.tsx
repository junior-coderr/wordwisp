"use client";

// Import necessary dependencies
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft,
  RotateCcw, 
  RotateCw, 
  Play, 
  Pause, 
  Volume2,
  Download, // Add this import
  Loader2, // Add this import
  List, // Add this import
  ChevronDown // Add this import
} from 'lucide-react';
import { toast } from "sonner"; // Add this import if you're using sonner for notifications
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"; // Add this import


interface AudioPlayerProps {
  story: {
    title: string;
    author: string;
    cover: string;
    description: string;
    genre: string;
  };
  chapters: Array<{
    title: string;
    duration: number;
    audioUrl: string;
    active: boolean;
  }>;
}

export default function AudioPlayer({ story, chapters }: AudioPlayerProps) {
  const router = useRouter();

  // Player state management
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);

  // Loading and interaction states
  const [isLoading, setIsLoading] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isAudioLoading, setIsAudioLoading] = useState(false);

  // Chapter management states
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [isChaptersOpen, setIsChaptersOpen] = useState(false);
  const [currentChapterText, setCurrentChapterText] = useState(chapters[0].title);
  const [currentAudioUrl, setCurrentAudioUrl] = useState(chapters[0].audioUrl);

  // Audio element reference
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [seekTargetTime, setSeekTargetTime] = useState<number | null>(null);
  const seekingRef = useRef(false);
  const pendingSeekRef = useRef<number | null>(null);
  const hasReachedEnd = useRef(false);

  // Volume control effect
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Audio loading and duration setup effect
  useEffect(() => {
    // Reset loading state when audio source changes
    setIsLoading(true);
    
    // Create new audio element to preload
    const audio = new Audio(currentAudioUrl);
    
    
    audio.addEventListener('loadeddata', () => {
      // Once audio is loaded, update duration and remove loading state
      if (isFinite(audio.duration)) {
        setDuration(audio.duration);
        setIsLoading(false);
      }
    });

    audio.addEventListener('error', () => {
      setIsLoading(false);
      // Optionally handle error state here
    });

    // Clean up
    return () => {
      audio.remove();
    };
  }, [currentAudioUrl]);

  // Buffering state management effect
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => setIsBuffering(false);
    const handleCanPlay = () => setIsBuffering(false);

    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, []);

  // Player control functions
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Time formatting helper
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Progress tracking functions
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      
      // Only update if we have valid numbers
      if (isFinite(currentTime) && isFinite(duration) && duration > 0) {
        setCurrentTime(currentTime);
        setProgress((currentTime / duration) * 100);
      }
    }
  };

  // Add this utility function for handling seeks
  const performSeek = async (targetTime: number) => {
    if (!audioRef.current) return;
    
    try {
      setIsBuffering(true);
      setIsSeeking(true);
      seekingRef.current = true;
      
      // Check if audio is ready for seeking
      if (audioRef.current.readyState < 2) {
        pendingSeekRef.current = targetTime;
        // Force reload if needed (helps with incognito mode)
        audioRef.current.load();
        return;
      }

      audioRef.current.currentTime = targetTime;
      
      // If audio was playing, ensure it continues
      if (isPlaying) {
        try {
          await audioRef.current.play();
        } catch (error) {
          console.error('Error resuming playback:', error);
          setIsPlaying(false);
        }
      }
    } catch (error) {
      console.error('Seeking failed:', error);
      toast.error('Failed to seek to position');
    } finally {
      seekingRef.current = false;
      setIsSeeking(false);
      setIsBuffering(false);
    }
  };

  // Seeking functionality
  const handleSliderChange = (value: number[]) => {
    if (!audioRef.current || !isFinite(duration)) return;
    
    const newTime = (value[0] / 100) * duration;
    if (!isFinite(newTime)) return;

    setProgress(value[0]);
    setCurrentTime(newTime);
    setSeekTargetTime(newTime);
    
    // Debounce actual seeking to prevent rapid fire events
    const timeoutId = setTimeout(() => {
      performSeek(newTime);
    }, 100);

    return () => clearTimeout(timeoutId);
  };

  // Seeking state management effect
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleSeeked = () => {
      setIsSeeking(false);
      setIsBuffering(false);
    };

    const handleSeeking = () => {
      setIsBuffering(true);
    };

    const handleCanPlayThrough = () => {
      setIsBuffering(false);
      if (isPlaying) {
        audio.play().catch(console.error);
      }
    };

    audio.addEventListener('seeked', handleSeeked);
    audio.addEventListener('seeking', handleSeeking);
    audio.addEventListener('canplaythrough', handleCanPlayThrough);

    return () => {
      audio.removeEventListener('seeked', handleSeeked);
      audio.removeEventListener('seeking', handleSeeking);
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
    };
  }, [isPlaying]);

  // Download functionality
  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      const encodedUrl = encodeURIComponent(currentAudioUrl);
      const response = await fetch(`/api/download?url=${encodedUrl}`);
      
      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${story.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp3`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Download completed!');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download audio');
    } finally {
      setIsDownloading(false);
    }
  };

  // Modify handleChapterSelect to include setIsChaptersOpen
  const handleChapterSelect = async (index: number) => {
    hasReachedEnd.current = false; // Reset end state when changing chapters
    const wasPlaying = isPlaying;
    setIsPlaying(false);
    setCurrentChapterIndex(index);
    setCurrentChapterText(chapters[index].title);
    setCurrentAudioUrl(chapters[index].audioUrl);
    setIsChaptersOpen(false); // Close the chapters dialog
    
    // Reset player state
    setProgress(0);
    setCurrentTime(0);
    setSeekTargetTime(null);
    pendingSeekRef.current = null;
    
    // Wait for new audio to load
    if (audioRef.current) {
      try {
        await new Promise((resolve) => {
          const handleCanPlay = () => {
            audioRef.current?.removeEventListener('canplay', handleCanPlay);
            resolve(true);
          };
          audioRef.current.addEventListener('canplay', handleCanPlay);
        });
        
        if (wasPlaying) {
          setIsPlaying(true);
          await audioRef.current.play();
        }
      } catch (error) {
        console.error('Error switching chapters:', error);
        toast.error('Failed to switch chapter');
      }
    }
  };

  // Auto-play next chapter functionality
  const playNextChapter = () => {
    if (hasReachedEnd.current) return; // Prevent multiple calls at end
    
    const nextChapterIndex = currentChapterIndex + 1;
    if (nextChapterIndex < chapters.length) {
      handleChapterSelect(nextChapterIndex);
      setIsPlaying(true); // Keep playing state for next chapter
    } else {
      hasReachedEnd.current = true;
      setIsPlaying(false);
      // Reset to the end of the last chapter
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = audioRef.current.duration;
      }
      toast.info("You've reached the end of the story!");
    }
  };

  // Chapter end detection effect
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (!hasReachedEnd.current) {
        playNextChapter();
      }
    };

    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentChapterIndex]);

  // Initial audio loading effect
  useEffect(() => {
    const audio = new Audio(chapters[0].audioUrl);
    audio.addEventListener('loadeddata', () => {
      if (isFinite(audio.duration)) {
        setDuration(audio.duration);
        setIsInitialLoading(false);
      }
    });

    audio.addEventListener('error', () => {
      setIsInitialLoading(false);
      toast.error('Failed to load audio');
    });

    return () => audio.remove();
  }, []);

  // Audio loading state management
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadStart = () => setIsAudioLoading(true);
    const handleCanPlay = () => {
      setIsAudioLoading(false);
      setIsBuffering(false);
      // If we were playing before chapter change, resume playing
      if (isPlaying) {
        audio.play().catch(console.error);
      }
    };
    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => {
      setIsBuffering(false);
      setIsAudioLoading(false);
    };

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
    };
  }, [isPlaying]);

  // Add this new effect to handle audio loading state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadStart = () => {
      setIsBuffering(true);
      setIsAudioLoading(true);
    };

    const handleLoadedData = () => {
      setIsBuffering(false);
      setIsAudioLoading(false);
    };

    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => setIsBuffering(false);
    const handleSeeking = () => setIsBuffering(true);
    const handleSeeked = () => {
      setIsSeeking(false);
      setIsBuffering(false);
    };

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('seeking', handleSeeking);
    audio.addEventListener('seeked', handleSeeked);

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('seeking', handleSeeking);
      audio.removeEventListener('seeked', handleSeeked);
    };
  }, []);

  // Enhance the audio loading effect
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleCanPlay = () => {
      // Handle pending seeks after load
      if (pendingSeekRef.current !== null) {
        const targetTime = pendingSeekRef.current;
        pendingSeekRef.current = null;
        performSeek(targetTime);
      }
      setIsBuffering(false);
      setIsAudioLoading(false);
    };

    const handleLoadedMetadata = () => {
      if (seekTargetTime !== null) {
        performSeek(seekTargetTime);
        setSeekTargetTime(null);
      }
    };

    const handleError = (e: ErrorEvent) => {
      console.error('Audio loading error:', e);
      setIsBuffering(false);
      setIsAudioLoading(false);
      toast.error('Error loading audio');
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('error', handleError);
    };
  }, [seekTargetTime]);

  return (
    // Main layout container with gradient background
    <div className="min-h-screen bg-gradient-to-br from-[#5956E9] via-[#4745BD] to-[#393790] p-4 md:p-8 relative">
      {/* Background blur effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10 blur-3xl"
        style={{ backgroundImage: `url(${story.cover})` }}
      />

      {/* Main content container */}
      <div className="relative z-10">
        {/* Navigation and controls */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12"
        >
          <Button
            variant="ghost"
            className="text-white/90 hover:text-white hover:bg-white/20 transition-all duration-300 group flex items-center text-lg"
            onClick={() => router.back()}
          >
            <ChevronLeft className="w-8 h-8 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Back
          </Button>
        </motion.div>

        <audio
          ref={audioRef}
          src={currentAudioUrl}
          onTimeUpdate={handleTimeUpdate}
          preload="metadata"
          onLoadedMetadata={() => {
            if (audioRef.current && isFinite(audioRef.current.duration)) {
              setDuration(audioRef.current.duration);
              setIsLoading(false);
            }
          }}
          onError={() => {
            setIsLoading(false);
            toast.error('Failed to load audio');
          }}
        />

        {/* Loading state UI */}
        {isInitialLoading ? (
          <div className="max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-12"
            >
              {/* Book info skeleton */}
              <div className="flex flex-col md:flex-row items-center gap-12">
                {/* Cover skeleton */}
                <div className="relative w-64 md:w-72 h-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 animate-pulse" />
                  <div className="absolute inset-0 backdrop-blur-sm" />
                </div>
                
                {/* Text content skeleton */}
                <div className="text-center md:text-left space-y-6 flex-1">
                  {/* Title skeleton */}
                  <div className="h-12 bg-white/10 rounded-lg w-3/4 animate-pulse" />
                  {/* Author skeleton */}
                  <div className="h-8 bg-white/10 rounded-lg w-1/2 animate-pulse" />
                  {/* Chapter title skeleton */}
                  <div className="h-10 bg-white/10 rounded-lg w-2/3 animate-pulse" />
                </div>
              </div>

              {/* Chapters button skeleton */}
              <div className="h-14 bg-white/10 rounded-xl animate-pulse backdrop-blur-sm" />

              {/* Player controls skeleton */}
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-4 md:p-6 space-y-6">
                {/* Progress bar skeleton */}
                <div className="space-y-4">
                  <div className="h-2 bg-white/10 rounded-full animate-pulse" />
                  <div className="flex justify-between">
                    <div className="h-4 w-12 bg-white/10 rounded animate-pulse" />
                    <div className="h-4 w-12 bg-white/10 rounded animate-pulse" />
                  </div>
                </div>

                {/* Next chapter indicator skeleton */}
                <div className="h-4 bg-white/10 rounded w-48 mx-auto animate-pulse" />

                {/* Controls skeleton */}
                <div className="flex items-center justify-center gap-8">
                  <div className="h-10 w-10 rounded-full bg-white/10 animate-pulse" />
                  <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-white/10 animate-pulse" />
                  <div className="h-10 w-10 rounded-full bg-white/10 animate-pulse" />
                </div>

                {/* Volume and download skeleton */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="h-5 w-5 rounded bg-white/10 animate-pulse" />
                    <div className="h-2 w-32 bg-white/10 rounded-full animate-pulse" />
                  </div>
                  <div className="h-8 w-8 rounded bg-white/10 animate-pulse" />
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          // Main player UI
          <div className="max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row items-center gap-12 mb-16"
            >
              {/* Enhanced Book Cover */}
              <div className="relative w-64 md:w-72 h-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/30 group transition-transform duration-300 hover:scale-[1.02] hover:shadow-3xl">
                <Image 
                  src={story.cover} 
                  alt={story.title} 
                  fill 
                  className="object-cover transition-transform duration-500 group-hover:brightness-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
              </div>
              
              {/* Enhanced Text Content */}
              <div className="text-white text-center md:text-left">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80"
                >
                  {story.title}
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-xl md:text-2xl text-white/80 mb-4 md:mb-6"
                >
                  {story.author}
                </motion.p>
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl md:text-3xl font-semibold text-white/90"
                >
                  {currentChapterText}
                </motion.h2>
              </div>
            </motion.div>

            {/* Add Chapters Dialog */}
            <Dialog open={isChaptersOpen} onOpenChange={setIsChaptersOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full mb-6 text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300
                          border border-white/20 backdrop-blur-sm rounded-xl py-5 px-6 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <List className="w-5 h-5" />
                    <span className="font-medium">Chapters</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isChaptersOpen ? 'rotate-180' : ''}`} />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] md:max-w-[600px] mx-auto w-[calc(100vw-2rem)] bg-gradient-to-br from-[#5956E9]/95 via-[#4745BD]/95 to-[#393790]/95 border-white/20 text-white backdrop-blur-lg p-0">
                <div className="max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent p-6">
                  <h2 className="text-xl font-semibold mb-4 sticky top-0 bg-gradient-to-br from-[#5956E9] to-[#4745BD] p-2 rounded-lg">
                    Select Chapter
                  </h2>
                  <div className="space-y-2">
                    {chapters.map((chapter, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <button
                          onClick={() => handleChapterSelect(index)}
                          className={`w-full p-4 rounded-lg text-left transition-all duration-300
                                    flex items-center justify-between group
                                    ${currentChapterIndex === index 
                                      ? 'bg-white/20 text-white scale-[1.02]' 
                                      : 'hover:bg-white/10 text-white/80 hover:text-white hover:scale-[1.01]'}`}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                                          ${currentChapterIndex === index 
                                            ? 'bg-white/30' 
                                            : 'bg-white/10 group-hover:bg-white/20'}`}>
                              {index + 1}
                            </div>
                            <span className="font-medium truncate">{chapter.title}</span>
                          </div>
                          <span className="text-sm opacity-60 ml-2 flex-shrink-0">
                            {`${Math.floor(chapter.duration)}:${Math.round((chapter.duration % 1) * 60).toString().padStart(2, '0')}`}
                          </span>
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Enhanced Player Controls */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-xl rounded-3xl p-4 md:p-6 shadow-2xl border border-white/20"
            >
              {/* Progress Bar */}
              <div className="mb-4 md:mb-6">
                <div className="cursor-pointer">
                  <Slider
                    value={[progress]}
                    max={100}
                    step={0.1}
                    onValueChange={handleSliderChange}
                    className="cursor-pointer hover:opacity-90 transition-opacity"
                  />
                </div>
                <div className="flex justify-between text-white/80 text-xs md:text-sm mt-2 font-medium px-0.5">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Add next chapter indicator */}
              <div className="text-white/60 text-sm text-center mb-2">
                {currentChapterIndex < chapters.length - 1 ? (
                  <span>Up next: {chapters[currentChapterIndex + 1].title}</span>
                ) : (
                  <span>Last chapter</span>
                )}
              </div>

              {/* Main Controls with enhanced hover effects */}
              <div className="flex items-center justify-center gap-4 md:gap-8 relative mb-4 md:mb-6">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
                  onClick={() => {
                    if (audioRef.current) audioRef.current.currentTime -= 10;
                  }}
                >
                  <RotateCcw className="w-7 h-7 md:w-9 md:h-9" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 hover:scale-105 text-white hover:text-white shadow-lg flex items-center justify-center backdrop-blur-sm"
                  onClick={togglePlayPause}
                  disabled={isBuffering || isAudioLoading}
                >
                  {isBuffering || isAudioLoading ? (
                    <Loader2 className="w-8 h-8 md:w-12 md:h-12 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-8 h-8 md:w-12 md:h-12" />
                  ) : (
                    <Play className="w-8 h-8 md:w-12 md:h-12 ml-1" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
                  onClick={() => {
                    if (audioRef.current) audioRef.current.currentTime += 10;
                  }}
                >
                  <RotateCw className="w-7 h-7 md:w-9 md:h-9" />
                </Button>
              </div>

              {/* Volume Control and Download Button */}
              <div className="flex items-center justify-between px-1 sm:px-2 md:px-3">
                <div className="flex items-center gap-2 md:gap-3 flex-1 max-w-[180px]">
                  <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-white/80 flex-shrink-0 hover:text-white/100 transition-colors" />
                  <div className="flex-1 min-w-[80px]">
                    <Slider
                      value={[volume * 100]}
                      max={100}
                      onValueChange={(value) => setVolume(value[0] / 100)}
                      className="w-full hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 group ml-2 sm:ml-3 w-8 h-8 sm:w-9 sm:h-9"
                  onClick={handleDownload}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-y-0.5 transition-transform" />
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

