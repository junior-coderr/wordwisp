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
  Loader2 // Add this import
} from 'lucide-react';
import { toast } from "sonner"; // Add this import if you're using sonner for notifications

export default function ListenPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isLoading, setIsLoading] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fixed test audio data
  const story = {
    title: "The Silent Echo",
    author: "Sarah Mitchell",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
    chapter: "Chapter 1: The Beginning",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    // audioUrl: "https://webnew.blob.core.windows.net/preuploadedaudio/audio2.mp3"
  };
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    // Reset loading state when audio source changes
    setIsLoading(true);
    
    // Create new audio element to preload
    const audio = new Audio(story.audioUrl);
    
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
  }, [story.audioUrl]);

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

      const encodedUrl = encodeURIComponent(story.audioUrl);
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
          src={story.audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={() => {
            if (audioRef.current && isFinite(audioRef.current.duration)) {
              setDuration(audioRef.current.duration);
            }
          }}
        />

        {isLoading ? (
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
              <div className="relative w-72 h-96 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/30 group transition-transform duration-300 ">
                <Image 
                  src={story.cover} 
                  alt={story.title} 
                  fill 
                  className="object-cover transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
              </div>
              
              {/* Enhanced Text Content */}
              <div className="text-white text-center md:text-left">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80"
                >
                  {story.title}
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-2xl text-white/80 mb-6"
                >
                  {story.author}
                </motion.p>
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl font-semibold text-white/90"
                >
                  {story.chapter}
                </motion.h2>
              </div>
            </motion.div>

            {/* Enhanced Player Controls */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20"
            >
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="cursor-pointer">
                  <Slider
                    value={[progress]}
                    max={100}
                    step={0.1}
                    onValueChange={handleSliderChange}
                    className="cursor-pointer hover:opacity-90 transition-opacity"
                  />
                </div>
                <div className="flex justify-between text-white/90 text-sm mt-3 font-medium">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Main Controls with enhanced hover effects */}
              <div className="flex items-center justify-center gap-12 relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white/90 hover:text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
                  onClick={() => {
                    if (audioRef.current) audioRef.current.currentTime -= 10;
                  }}
                >
                  <RotateCcw className="w-10 h-10" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="w-24 h-24 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 hover:scale-105 text-white hover:text-white shadow-lg flex items-center justify-center"
                  onClick={togglePlayPause}
                  disabled={isBuffering}
                >
                  {isBuffering ? (
                    <Loader2 className="w-14 h-14 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-14 h-14" />
                  ) : (
                    <Play className="w-14 h-14" style={{ marginLeft: '4px' }} />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white/90 hover:text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
                  onClick={() => {
                    if (audioRef.current) audioRef.current.currentTime += 10;
                  }}
                >
                  <RotateCw className="w-10 h-10" />
                </Button>
              </div>

              {/* Volume Control and Download Button */}
              <div className="flex items-center justify-between mt-8 px-4">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-6 h-6 text-white/90" />
                  <Slider
                    value={[volume * 100]}
                    max={100}
                    onValueChange={(value) => setVolume(value[0] / 100)}
                    className="w-40"
                  />
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white/90 hover:text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 group"
                  onClick={handleDownload}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <Download className="w-6 h-6 group-hover:translate-y-1 transition-transform" />
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
