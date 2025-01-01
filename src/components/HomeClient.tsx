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
import {  signOut } from 'next-auth/react'; // Add this import at the top


interface Book {
  title: string;
  author: string;
  image: string;
  category: string;
  id: string;  // Add id to the interface
}

interface HomeClientProps {
  books: any[];
  session: any;
}

const HomeClient = ({ books, session }: HomeClientProps) => {
  // const { data: session } = useSession(); // Add this line
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest('.profile-dropdown')) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
    { text: "Library", delay: 0, onClick: () => {
      router.push('/library');
      setIsMobileMenuOpen(false);
    } },
    { text: "Profile", delay: 0, onClick: () => {
      router.push('/profile');
      setIsMobileMenuOpen(false);
    } }
  ];

  return (
    <div>
            
      {/* Header */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isScrolled ? 'bg-[#5956E9]/80 backdrop-blur-sm' : 'bg-transparent'
      }`}>
        <div className="max-w-[1500px] mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-8 h-8">
                <svg
                  className="w-8 h-8 text-white transform transition-transform duration-300 group-hover:scale-110"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    className="transition-all duration-300"
                    d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" 
                    stroke="currentColor" 
                    strokeWidth="1.5"
                  />
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    d="M8 9.5c0-.828.672-1.5 1.5-1.5.828 0 1.5.672 1.5 1.5v5c0 .828-.672 1.5-1.5 1.5-.828 0-1.5-.672-1.5-1.5v-5zM13 9.5c0-.828.672-1.5 1.5-1.5.828 0 1.5.672 1.5 1.5v5c0 .828-.672 1.5-1.5 1.5-.828 0-1.5-.672-1.5-1.5v-5z"
                    fill="currentColor"
                  />
                  <motion.circle
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                    cx="12"
                    cy="12"
                    r="2"
                    fill="currentColor"
                  />
                </svg>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="absolute -right-1 -top-1 w-3 h-3 bg-white rounded-full border-2 border-[#5956E9]"
                />
              </div>
              <div className="hidden sm:flex flex-col">
                <h1 className="text-2xl font-bold text-white leading-none">Wordwisp</h1>
                <span className="text-[10px] text-white/60 tracking-wider">AUDIO STORIES</span>
              </div>
            </Link>

            {/* Rest of the existing header content */}
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

            {session ? (
              <div className="hidden md:flex items-center gap-4 relative profile-dropdown">
                <button
                  onClick={() => setProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/50 hover:border-white transition-colors focus:outline-none flex items-center justify-center bg-white/10"
                >
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt="Profile"
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg
                      className="w-6 h-6 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>

                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-lg ring-1 ring-black/5 z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{session.user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                      </div>
                      <div className="px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                        onClick={() => {
                          router.push('/profile');
                          setProfileDropdownOpen(false);
                        }}
                      >
                        <svg
                          className="w-4 h-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                        </svg>
                        Profile
                      </div>
                      <button
                        onClick={() => signOut()}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:opacity-80 flex items-center gap-2"
                      >
                        <svg
                          className="w-4 h-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path fillRule="evenodd" d="M16.5 3.75a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5V15a.75.75 0 0 0-1.5 0v3.75a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V5.25a3 3 0 0 0-3-3h-6a3 3 0 0 0-3 3V9A.75.75 0 1 0 9 9V5.25a1.5 1.5 0 0 1 1.5-1.5h6ZM5.78 8.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 0 0 0 1.06l3 3a.75.75 0 0 0 1.06-1.06l-1.72-1.72H15a.75.75 0 0 0 0-1.5H4.06l1.72-1.72a.75.75 0 0 0 0-1.06Z" clipRule="evenodd" />
                        </svg>
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
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
            )}

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
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section ref={heroRef} className="min-h-[700px] h-screen flex items-center justify-center relative pt-20 md:pt-24">
          <div className="w-full text-center px-4 py-20 space-y-8 md:space-y-12 lg:space-y-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white leading-[1.1] md:leading-[1.2] tracking-tight mb-8 md:mb-12 max-w-[18ch] mx-auto"
            >
              Stories That{' '}
              <span className="bg-gradient-to-r from-white to-purple-200 text-transparent bg-clip-text whitespace-nowrap">
                Whisper to You
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl sm:text-2xl md:text-3xl font-medium text-white/90 mt-8 md:mt-12 max-w-3xl mx-auto px-4"
            >
              Listen to your favorite stories come to life through immersive narration
            </motion.p>
            
            <BookIcon />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="mt-16 md:mt-20 flex justify-center items-center"
            >
              <Link href="/library">
                <Button 
                  variant="secondary" 
                  className="px-8 py-6 text-lg md:text-xl font-semibold flex items-center gap-3 hover:scale-105 transition-transform"
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
        <section ref={exploreRef} className="min-h-screen w-full px-4 py-24 md:py-32 relative bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16 md:mb-24 space-y-6"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#5956E9] mb-6">
                Popular Stories
              </h2>
              <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto px-4">
                Discover our collection of bestselling audiobooks that have captured hearts worldwide
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-16">
              {books.map((book, index) => (
                <Link href={`/listen/${book.id}`} key={book.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-all duration-300 cursor-pointer group shadow-lg"
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
                    <div className="mt-4 space-y-2">
                      <span className="text-gray-500 text-sm md:text-base">{book.category}</span>
                      <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mt-2">{book.title}</h3>
                      <p className="text-gray-600 text-lg">{book.author}</p>
                      <Button variant="ghost" className="w-full mt-6 text-[#5956E9] border border-[#5956E9]/20 hover:bg-[#5956E9]/10 py-6">
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
                    </div>
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
              {session && (
                <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/50 flex items-center justify-center bg-white/10">
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt="Profile"
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg
                        className="w-7 h-7 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{session.user?.name}</p>
                    <p className="text-white/70 text-sm truncate">{session.user?.email}</p>
                  </div>
                </div>
              )}
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
                {session ? (
                  <Button 
                    variant="secondary" 
                    className="flex gap-2 w-full justify-center text-red-600 hover:text-red-700" 
                    onClick={() => signOut()}
                  >
                    <svg
                      className="w-4 h-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M16.5 3.75a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5V15a.75.75 0 0 0-1.5 0v3.75a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V5.25a3 3 0 0 0-3-3h-6a3 3 0 0 0-3 3V9A.75.75 0 1 0 9 9V5.25a1.5 1.5 0 0 1 1.5-1.5h6ZM5.78 8.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 0 0 0 1.06l3 3a.75.75 0 0 0 1.06-1.06l-1.72-1.72H15a.75.75 0 0 0 0-1.5H4.06l1.72-1.72a.75.75 0 0 0 0-1.06Z" clipRule="evenodd" />
                    </svg>
                    Logout
                  </Button>
                ) : (
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
                )}
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
  )
}

export default HomeClient
