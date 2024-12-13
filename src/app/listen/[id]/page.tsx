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
  Volume2 
} from 'lucide-react';

export default function ListenPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Mock data - replace with real data
  const story = {
    title: "The Silent Echo",
    author: "Sarah Mitchell",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
    chapter: "Chapter 1: The Beginning",
    // Using a public domain audio sample from archive.org
    audioUrl: "https://www2.cs.uic.edu/~i101/SoundFiles/CantinaBand60.wav"
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
          audioRef.current.currentTime = newTime;
          setProgress(value[0]);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#5956E9] to-[#393790] p-4 md:p-8">
      {/* Updated Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-8"
      >
        <Button
          variant="ghost"
          className="text-white hover:bg-white/20 hover:text-white transition-all group flex items-center text-lg"
          onClick={() => router.back()}
        >
          <ChevronLeft className="w-8 h-8 mr-2 group-hover:scale-110 transition-transform" />
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
            {/* Loading UI */}
            <div className="relative w-64 h-80 rounded-2xl overflow-hidden shadow-2xl bg-white/10 animate-pulse" />
            <div className="text-center space-y-4 w-full max-w-sm">
              <div className="h-8 bg-white/10 rounded animate-pulse" />
              <div className="h-6 bg-white/10 rounded animate-pulse w-3/4 mx-auto" />
              <div className="h-6 bg-white/10 rounded animate-pulse w-1/2 mx-auto" />
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 w-full mt-8">
              <div className="h-2 bg-white/10 rounded animate-pulse mb-8" />
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-white/10 animate-pulse" />
              </div>
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          {/* Existing content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-center gap-8 mb-12"
          >
            <div className="relative w-64 h-80 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/30">
              <Image src={story.cover} alt={story.title} fill className="object-cover" />
            </div>
            <div className="text-white text-center md:text-left">
              <h1 className="text-4xl font-bold mb-2">{story.title}</h1>
              <p className="text-xl text-white/80 mb-4">{story.author}</p>
              <h2 className="text-2xl font-semibold text-white/90">{story.chapter}</h2>
            </div>
          </motion.div>

          {/* Player Controls */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-6"
          >
            {/* Progress Bar with cursor pointer */}
            <div className="mb-6">
              <div className="cursor-pointer">
                <Slider
                  value={[progress]}
                  max={100}
                  step={0.1}
                  onValueChange={handleSliderChange}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                />
              </div>
              <div className="flex justify-between text-white/80 text-sm mt-2">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Main Controls */}
            <div className="flex items-center justify-center gap-8">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 transition-colors hover:scale-105"
                onClick={() => {
                  if (audioRef.current) audioRef.current.currentTime -= 10;
                }}
              >
                <RotateCcw className="w-10 h-10" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="w-20 h-20 rounded-full bg-white/20 hover:bg-white/30 transition-all hover:scale-105 text-white hover:text-white"
                onClick={togglePlayPause}
              >
                {isPlaying ? (
                  <Pause className="w-12 h-12" />
                ) : (
                  <Play className="w-12 h-12" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 transition-colors hover:scale-105"
                onClick={() => {
                  if (audioRef.current) audioRef.current.currentTime += 10;
                }}
              >
                <RotateCw className="w-10 h-10" />
              </Button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2 mt-6">
              <Volume2 className="w-7 h-7 text-white" />
              <Slider
                value={[volume * 100]}
                max={100}
                onValueChange={(value) => setVolume(value[0] / 100)}
                className="w-32"
              />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
