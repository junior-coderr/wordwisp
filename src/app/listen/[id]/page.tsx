"use client";
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

export default function ListenPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  // Update chapters data to include audioUrl
  const chapters = [
    { 
      title: "Chapter 1: The Beginning", 
      duration: "15:30", 
      active: true,
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    { 
      title: "Chapter 2: The Discovery", 
      duration: "12:45", 
      active: false,
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    },
    { 
      title: "Chapter 3: The Journey", 
      duration: "18:20", 
      active: false,
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
    },
    { 
      title: "Chapter 4: The Challenge", 
      duration: "14:15", 
      active: false,
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
    },
    { 
      title: "Chapter 5: The Resolution", 
      duration: "16:40", 
      active: false,
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
    },
  ];

  // Story data
  const story = {
    title: "The Silent Echo",
    author: "Sarah Mitchell",
    cover: "https://storycover.blob.core.windows.net/covers/Beyond%20the%20Shadows%20Book%20Cover.webp",
    chapter: "Chapter 1: The Beginning",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  };

  // States
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isLoading, setIsLoading] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0); // Add this state
  const [isChaptersOpen, setIsChaptersOpen] = useState(false); // Add this state
  const [currentChapterText, setCurrentChapterText] = useState(chapters[0].title);
  const [currentAudioUrl, setCurrentAudioUrl] = useState(chapters[0].audioUrl);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isAudioLoading, setIsAudioLoading] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

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

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

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

  const handleSliderChange = (value: number[]) => {
    if (audioRef.current) {
      const duration = audioRef.current.duration;
      if (isFinite(duration) && duration > 0) {
        const newTime = (value[0] / 100) * duration;
        if (isFinite(newTime)) {
          setIsSeeking(true);
          setProgress(value[0]);
          setCurrentTime(newTime);
          
          // If audio is not loaded at this point, we need to load it
          if (audioRef.current.readyState < 3) {
            setIsBuffering(true);
          }

          audioRef.current.currentTime = newTime;
          
          // If audio was playing, continue playing after seek
          if (isPlaying) {
            audioRef.current.play().catch(console.error);
          }
        }
      }
    }
  };

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

  // Add chapter selection handler
  const handleChapterSelect = async (index: number) => {
    const wasPlaying = isPlaying;
    setCurrentChapterIndex(index);
    setCurrentChapterText(chapters[index].title);
    setCurrentAudioUrl(chapters[index].audioUrl);
    
    // Reset player state
    setProgress(0);
    setCurrentTime(0);
    
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      // Maintain play state during chapter change
      setIsPlaying(wasPlaying);
    }
    
    setIsChaptersOpen(false);
  };

  // Add function to handle next chapter
  const playNextChapter = () => {
    const nextChapterIndex = currentChapterIndex + 1;
    if (nextChapterIndex < chapters.length) {
      handleChapterSelect(nextChapterIndex);
      setIsPlaying(true); // Keep playing state for next chapter
    } else {
      setIsPlaying(false);
      toast.info("You've reached the end of the story!");
    }
  };

  // Add ended event listener to audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      playNextChapter();
    };

    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentChapterIndex]); // Add currentChapterIndex as dependency

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

  // Update audio loading effect
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5956E9] via-[#4745BD] to-[#393790] p-4 md:p-8 relative">
      {/* Background blur effect using cover image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10 blur-3xl"
        style={{ backgroundImage: `url(${story.cover})` }}
      />

      <div className="relative z-10">
        {/* Updated Back Button with smoother hover */}
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

        {isInitialLoading ? (
          <div className="max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-8"
            >
              {/* Enhanced Loading UI with pulse animation */}
              <div className="relative w-64 h-80 rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 animate-pulse" />
                <div className="absolute inset-0 backdrop-blur-sm" />
              </div>
              <div className="text-center space-y-4 w-full max-w-sm">
                <div className="h-8 bg-gradient-to-r from-white/20 to-white/10 rounded animate-pulse" />
                <div className="h-6 bg-gradient-to-r from-white/15 to-white/5 rounded animate-pulse w-3/4 mx-auto" />
                <div className="h-6 bg-gradient-to-r from-white/10 to-white/5 rounded animate-pulse w-1/2 mx-auto" />
              </div>
            </motion.div>
          </div>
        ) : (
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
                          border border-white/20 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <List className="w-5 h-5" />
                    <span className="font-medium">Chapters</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isChaptersOpen ? 'rotate-180' : ''}`} />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] md:max-w-[600px] w-[95vw] bg-gradient-to-br from-[#5956E9]/95 via-[#4745BD]/95 to-[#393790]/95 border-white/20 text-white backdrop-blur-lg p-0">
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
                          <span className="text-sm opacity-60 ml-2 flex-shrink-0">{chapter.duration}</span>
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
