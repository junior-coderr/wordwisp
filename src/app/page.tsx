"use client";
import { Inter } from 'next/font/google';
import Image from 'next/image'; // Add this import
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackgroundShapes from '@/components/BackgroundShapes';
import BookIcon from '@/components/BookIcon';
import Link from 'next/link'; // Add this import at the top
import LoginModal from '@/components/LoginModal';
import { useRouter } from 'next/navigation'; // Add this import at the top

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const exploreRef = useRef<HTMLElement>(null);
  const router = useRouter();
  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    setIsMobileMenuOpen(false); // Close mobile menu when navigating
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
    setIsMobileMenuOpen(false); // Close mobile menu if open
  };

  const menuItems = [
    { text: "Home", delay: 0.1, onClick: () => scrollToSection(heroRef) },
    { text: "Books", delay: 0.2, onClick: () => scrollToSection(exploreRef) },
    { text: "Purchased", delay: 0.3, onClick: () => {
      router.push('/purchased');
      setIsMobileMenuOpen(false);
    } }
  ];

  const books = [
    {
      title: "The Silent Echo",
      author: "Sarah Mitchell",
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=2348&auto=format&fit=crop",
      category: "Mystery"
    },
    {
      title: "Beyond the Horizon",
      author: "James Carter",
      image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=2487&auto=format&fit=crop",
      category: "Adventure"
    },
    {
      title: "Midnight Dreams",
      author: "Elena Ross",
      image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=2487&auto=format&fit=crop",
      category: "Fantasy"
    }
  ];

  return (
    <div className={`bg-[#5956E9] ${inter.className}`}>
      <BackgroundShapes />
      
      {/* Header */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isScrolled ? 'bg-[#5956E9]/80 backdrop-blur-sm' : 'bg-transparent'
      }`}>
        <div className="max-w-[1500px] mx-auto">
          <header className="flex justify-between items-center p-4">
            <div className="flex items-center gap-2">
              <svg
                className="w-8 h-8 text-white"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 6C2 4.89543 2.89543 4 4 4H20C21.1046 4 22 4.89543 22 6V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6Z"
                  className="stroke-current"
                  strokeWidth="1.5"
                />
                <path
                  d="M12 8V16M9 8.5V15.5M15 8.5V15.5M6 9V15M18 9V15"
                  className="stroke-current"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="2"
                  className="fill-current"
                />
                <path
                  d="M7 4C7 2.89543 7.89543 2 9 2H15C16.1046 2 17 2.89543 17 4V4H7V4Z"
                  className="fill-current"
                />
              </svg>
              <h1 onClick={()=>scrollToSection(heroRef)} className="text-2xl font-bold text-white bg-gradient-to-r from-white to-purple-200 text-transparent bg-clip-text select-none cursor-pointer">Wordwisp</h1>
            </div>
            
            <nav className="hidden md:flex gap-8">
              {menuItems.map((item) => (
                <button 
                  key={item.text}
                  onClick={item.onClick}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  {item.text}
                </button>
              ))}
            </nav>

            <Button variant="secondary" className="hidden md:flex gap-2" onClick={handleLoginClick}>
              <svg
                className="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z" clipRule="evenodd" />
              </svg>
              Login
            </Button>

            <Button 
              variant="ghost" 
              className="md:hidden text-white hover:bg-transparent focus:bg-transparent active:bg-transparent"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <div className="relative w-6 h-6">
                <span className={`absolute w-6 h-0.5 bg-white transform transition-all duration-300 ease-in-out ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-0' : 'translate-y-2'
                }`}></span>
                <span className={`absolute w-6 h-0.5 bg-white transform transition-all duration-300 ease-in-out ${
                  isMobileMenuOpen ? 'opacity-0' : 'translate-y-3'
                }`}></span>
                <span className={`absolute w-6 h-0.5 bg-white transform transition-all duration-300 ease-in-out ${
                  isMobileMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-4'
                }`}></span>
              </div>
            </Button>
          </header>
        </div>
      </div>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section ref={heroRef} className="min-h-[800px] h-screen flex items-center justify-center relative">
          <div className="w-full text-center px-4 py-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white leading-tight tracking-tight"
            >
              Stories That<br className="sm:hidden" />
              <span className="bg-gradient-to-r from-white to-purple-200 text-transparent bg-clip-text"> Whisper to You</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl sm:text-2xl md:text-3xl font-medium text-white/90 mt-6 sm:mt-8 max-w-3xl mx-auto"
            >
              Listen to your favorite stories come to life through immersive narration
            </motion.p>
            
            <BookIcon />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="mt-12 flex justify-center items-center"
            >
              <Link href="/library">
                <Button 
                  variant="secondary" 
                  className="px-8 py-6 mt-4 text-lg font-semibold flex items-center gap-2 hover:scale-105 transition-transform"
                >
                  <svg
                    className="w-6 h-6 text-purple-600"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M11.47 1.72a.75.75 0 011.06 0l3 3a.75.75 0 01-1.06 1.06l-1.72-1.72V7.5h-1.5V4.06L9.53 5.78a.75.75 0 01-1.06-1.06l3-3zM11.25 7.5V15a.75.75 0 001.5 0V7.5h3.75a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9a3 3 0 013-3h3.75z" />
                  </svg>
                  Explore Stories
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Explore Section */}
        <section ref={exploreRef} className="min-h-screen w-full px-4 py-16 relative bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-[#5956E9] mb-4">
                Popular Stories
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Discover our collection of bestselling audiobooks that have captured hearts worldwide
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {books.map((book, index) => (
                <Link href={`/listen/${index+1}`} key={book.title}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-gray-50 rounded-2xl p-4 hover:bg-gray-100 transition-all duration-300 cursor-pointer group shadow-lg"
                  >
                    <div className="aspect-[3/4] rounded-xl overflow-hidden mb-4 relative">
                      <Image
                        src={book.image}
                        alt={book.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={index === 0}
                      />
                    </div>
                    <span className="text-gray-500 text-sm">{book.category}</span>
                    <h3 className="text-xl font-semibold text-gray-900 mt-2">{book.title}</h3>
                    <p className="text-gray-600">{book.author}</p>
                    <Button variant="ghost" className="w-full mt-4 text-[#5956E9] border border-[#5956E9]/20 hover:bg-[#5956E9]/10">
                      <svg
                        className="w-5 h-5 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 3.75a6.715 6.715 0 00-3.722 1.118.75.75 0 11-.828-1.25 8.25 8.25 0 0113.1 6.615c0 3.592-4.377 8.267-8.55 8.267-4.173 0-8.55-4.675-8.55-8.267A8.25 8.25 0 0114.25 4.607a.75.75 0 11.326 1.464A6.715 6.715 0 0012 3.75zM5.25 12c0 2.726 3.397 6.767 6.75 6.767 3.353 0 6.75-4.041 6.75-6.767 0-3.725-2.988-6.75-6.75-6.75S5.25 8.275 5.25 12zM12 9a3 3 0 100 6 3 3 0 000-6z" />
                      </svg>
                      Listen Now
                    </Button>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer Text */}
      <footer className="w-full py-8 text-center text-white/60 text-sm">
        Made with ❤️ by Pratik
      </footer>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-[#5956E9] p-4 md:hidden z-40 pt-20 border-t border-white/10"
          >
            <nav className="flex flex-col gap-4">
              {menuItems.map((item) => (
                <motion.button
                  key={item.text}
                  onClick={item.onClick}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: item.delay }}
                  className="text-white hover:text-gray-200 transition-colors text-left"
                >
                  {item.text}
                </motion.button>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: 0.4 }}
              >
                <Button variant="secondary" className="flex gap-2 w-full justify-center" onClick={handleLoginClick}>
                  <svg
                    className="w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z" clipRule="evenodd" />
                  </svg>
                  Login
                </Button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </div>
  );
}
