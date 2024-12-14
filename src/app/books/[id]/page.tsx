"use client";
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';

const sampleAudios = [
  "https://www2.cs.uic.edu/~i101/SoundFiles/StarWars60.wav",
  "https://www2.cs.uic.edu/~i101/SoundFiles/gettysburg10.wav",
  "https://www2.cs.uic.edu/~i101/SoundFiles/taunt.wav",
  "https://www2.cs.uic.edu/~i101/SoundFiles/CantinaBand60.wav"
];

const books = [
  {
    id: 1,
    title: "The Silent Echo",
    author: "Sarah Mitchell",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
    category: "Mystery",
    price: 299,
    description: "A thrilling mystery that will keep you on the edge of your seat.",
    audioUrl: sampleAudios[Math.floor(Math.random() * sampleAudios.length)],
    duration: "12h 30m"
  },
  // ... add more books with similar structure
];

export default function BooksPage() {
  const [isPlaying, setIsPlaying] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();

  const book = books[0]; // For now, showing first book. You should use dynamic routing for multiple books

  const handlePlayPause = async (bookId: number) => {
    if (isPlaying === bookId) {
      audioRef.current?.pause();
      setIsPlaying(null);
    } else {
      setIsLoading(true);
      audioRef.current?.pause();
      if (audioRef.current) {
        audioRef.current.src = book.audioUrl;
        try {
          await audioRef.current.play();
          setIsPlaying(bookId);
        } catch (error) {
          console.error('Error playing audio:', error);
        }
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Enhanced Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b shadow-sm">
        <div className="max-w-[1500px] mx-auto px-6 py-5 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#5956E9] hover:text-[#4745BB] transition-all hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">Back to Books</span>
          </button>
        </div>
      </div>

      <div className="pt-28 pb-16 px-6 md:px-8">
        <div className="max-w-[1500px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Enhanced Image Column */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:w-1/3"
            >
              <div className="aspect-[3/4] relative rounded-2xl overflow-hidden shadow-2xl group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10" />
                <Image
                  src={book.image}
                  alt={book.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              </div>
            </motion.div>

            {/* Modified Details Column */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:w-2/3 space-y-8"
            >
              <div className="space-y-3">
                <span className="inline-block px-4 py-1.5 rounded-full bg-purple-100 text-purple-800 text-sm font-medium">
                  {book.category}
                </span>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">{book.title}</h1>
                <p className="text-xl text-gray-600">by <span className="text-gray-900 font-medium">{book.author}</span></p>
              </div>

              <div className="border-t border-b py-8 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-[#5956E9]">₹{book.price}</span>
                  <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-600 font-medium">{book.duration}</span>
                  </div>
                </div>
                
                <p className="text-gray-700 text-lg leading-relaxed">{book.description}</p>
              </div>

              {/* Simplified Preview Section */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Audio Preview</h2>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full flex items-center justify-center gap-3 text-lg h-14 border-gray-200"
                  onClick={() => handlePlayPause(book.id)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading...
                    </>
                  ) : isPlaying === book.id ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
                      </svg>
                      Stop Preview
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                      </svg>
                      Play Audio Preview
                    </>
                  )}
                </Button>
              </div>

              <Button 
                size="lg" 
                className="w-full bg-[#5956E9] hover:bg-[#4745BB] text-lg h-16 rounded-xl shadow-lg shadow-[#5956E9]/25 hover:scale-[1.02] transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2">
                  <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                </svg>
                Purchase Audiobook
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      <audio ref={audioRef} className="hidden" />
    </div>
  );
}
