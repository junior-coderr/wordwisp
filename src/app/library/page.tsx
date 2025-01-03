"use client";
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion'; // Add this import
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import LoginModal from '@/components/LoginModal'; // Add this import
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge"; // Add this import
import { Suspense } from 'react';
// import LibraryContent from './LibraryContent';

const categories = [
  { id: 'all', label: 'All' },
  { id: 'Fiction', label: 'Fiction' },
  { id: 'Non-Fiction', label: 'Non-Fiction' },
  { id: 'Mystery', label: 'Mystery' },
  { id: 'Romance', label: 'Romance' },
  { id: 'Horror', label: 'Horror' },
  { id: 'Experience', label: 'Experience' }
];

export default function LibraryPage({
  searchParams,
}: {
  searchParams: { genre?: string };
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LibraryContent initialGenre={searchParams.genre || 'all'} />
    </Suspense>
  );
}

function LibraryContent({ initialGenre }: { initialGenre: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(initialGenre);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLanguageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('Hindi');
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest('.profile-dropdown')) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Add click outside handler for mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest('.category-dropdown')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Add click outside handler for language dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest('.language-dropdown')) {
        setLanguageDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Add this function to handle login button click
  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  // Add this new useEffect for mobile nav
  useEffect(() => {
    if (isMobileNavOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileNavOpen]);

  // Add this function to handle scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Update URL when category changes
  const handleCategoryChange = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId === 'all') {
      params.delete('genre');
    } else {
      params.set('genre', categoryId);
    }
    router.push(`/library?${params.toString()}`);
    setSelectedCategory(categoryId);
  };

  const fetchStories = async (page: number, selectedGenre: string) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
      });
      
      if (selectedGenre !== 'all') {
        params.append('genre', selectedGenre);
      }

      const response = await fetch(`/api/stories/public?${params}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setStories(data.stories);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (error) {
      toast.error('Failed to load stories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStories(currentPage, selectedCategory);
  }, [currentPage, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-[1500px] mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Replace Link with button for logo */}
            <button onClick={scrollToTop} className="flex items-center gap-2 group">
              <div className="relative w-8 h-8">
                <svg
                  className="w-8 h-8 text-[#5956E9] transform transition-transform duration-300 group-hover:scale-110"
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
                  className="absolute -right-1 -top-1 w-3 h-3 bg-[#5956E9] rounded-full border-2 border-white"
                />
              </div>
              <div className="hidden sm:flex flex-col">
                <h1 className="text-2xl font-bold text-[#5956E9] leading-none">Wordwisp</h1>
                <span className="text-[10px] text-gray-400 tracking-wider">AUDIO STORIES</span>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 flex-1 justify-end">
              <div className="flex items-center gap-3 relative">
                <div className="flex bg-gray-100 p-1 rounded-full">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.id)}
                      className={`
                        px-4 py-1.5 rounded-full text-sm 
                        transition-all duration-300
                        relative
                        ${selectedCategory === category.id
                          ? 'text-white'
                          : 'text-gray-600 hover:text-gray-900'
                        }
                      `}
                    >
                      <span className="relative z-10">{category.label}</span>
                      {selectedCategory === category.id && (
                        <motion.div
                          layoutId="activeCategory"
                          className="absolute inset-0 bg-[#5956E9] rounded-full"
                          transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Dropdown */}
              <div className="relative language-dropdown">
                <button
                  onClick={() => setLanguageDropdownOpen(!isLanguageDropdownOpen)}
                  className="px-3 py-1.5 rounded-lg text-sm bg-gray-100 text-gray-600 
                    hover:bg-gray-200 transition-colors flex items-center gap-2
                    border border-transparent focus:border-[#5956E9]/20 focus:bg-white"
                >
                  <span className="flex-1 text-left">
                    {selectedLanguage}
                  </span>
                  <motion.svg
                    className="w-4 h-4 flex-shrink-0"
                    animate={{ rotate: isLanguageDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z" />
                  </motion.svg>
                </button>

                <AnimatePresence>
                  {isLanguageDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg 
                        border border-gray-100 overflow-hidden z-50"
                      style={{ width: 'max-content', minWidth: '120px' }}
                    >
                      {[ 'Hindi'].map((language) => (
                        <motion.button
                          key={language}
                          onClick={() => {
                            setSelectedLanguage(language);
                            setLanguageDropdownOpen(false);
                          }}
                          className={`
                            w-full text-left px-4 py-2.5 text-sm
                            flex items-center gap-2 relative
                            transition-all duration-200
                            ${selectedLanguage === language
                              ? 'text-[#5956E9] bg-[#5956E9]/5 font-medium'
                              : 'text-gray-600 hover:bg-[#5956E9]/5 hover:text-[#5956E9]'
                            }
                          `}
                          whileHover={{ backgroundColor: 'rgba(89, 86, 233, 0.05)' }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {language}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile/Login Section */}
              {session ? (
                <div className="relative profile-dropdown">
                  <button
                    onClick={() => setProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#5956E9]/50 hover:border-[#5956E9] transition-colors focus:outline-none flex items-center justify-center bg-gray-100"
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
                        className="w-5 h-5 text-gray-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
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
                        {/* Add Profile link here */}
                        <Link
                          href="/profile"
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:text-[#5956E9] flex items-center gap-2"
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
                        </Link>
                        {/* <Link
                          href="/purchased"
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:text-[#5956E9] flex items-center gap-2"
                        >
                          <svg
                            className="w-4 h-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                          </svg>
                          Purchased
                        </Link> */}
                        <button
                          onClick={() => signOut()}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:opacity-80 flex items-center gap-2 border-t border-gray-100"
                        >
                          <svg
                            className="w-4 h-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path fillRule="evenodd" d="M16.5 3.75a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5V15a.75.75 0 0 0-1.5 0v3.75a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V5.25a3 3 0 0 0-3-3h-6ZM5.78 8.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 0 0 0 1.06l3 3a.75.75 0 0 0 1.06-1.06l-1.72-1.72H15a.75.75 0 0 0 0-1.5H4.06l1.72-1.72a.75.75 0 0 0 0-1.06Z" clipRule="evenodd" />
                          </svg>
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button 
                  onClick={handleLoginClick}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-[#5956E9] hover:bg-gray-50 border border-[#5956E9]/20 transition-all duration-300 text-sm font-medium hover:scale-105"
                >
                  <svg
                    className="w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z" clipRule="evenodd" />
                  </svg>
                  Login
                </button>
              )}
            </nav>

            {/* Mobile Navigation Button */}
            <div className="lg:hidden flex items-center gap-2">
              {session && (
                <>
                  {/* Add Profile link for mobile */}
                  <Link
                    href="/profile"
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <svg
                      className="w-6 h-6 text-gray-600"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                      </svg>
                  </Link>
                  {/* <Link
                    href="/purchased"
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <svg
                      className="w-6 h-6 text-gray-600"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                    </svg>
                  </Link> */}
                </>
              )}
              <button
                onClick={() => setMobileNavOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setMobileNavOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed right-0 top-0 bottom-0 w-[280px] bg-white shadow-xl z-50 lg:hidden"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="font-semibold text-lg">Menu</h2>
                  <button
                    onClick={() => setMobileNavOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  {/* Categories */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-500">Categories</h3>
                    <div className="space-y-1">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => {
                            handleCategoryChange(category.id);
                            setMobileNavOpen(false);
                          }}
                          className={`
                            w-full text-left px-3 py-2 rounded-lg text-sm
                            transition-colors relative
                            ${selectedCategory === category.id
                              ? 'text-[#5956E9] bg-[#5956E9]/5 font-medium'
                              : 'text-gray-600 hover:bg-gray-100'
                            }
                          `}
                        >
                          {category.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Language Selection */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-500">Language</h3>
                    <div className="space-y-1">
                      {['Hindi'].map((language) => (
                        <button
                          key={language}
                          onClick={() => {
                            setSelectedLanguage(language);
                            setMobileNavOpen(false);
                          }}
                          className={`
                            w-full text-left px-3 py-2 rounded-lg text-sm
                            transition-colors
                            ${selectedLanguage === language
                              ? 'text-[#5956E9] bg-[#5956E9]/5 font-medium'
                              : 'text-gray-600 hover:bg-gray-100'
                            }
                          `}
                        >
                          {language}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Mobile Profile/Login Section */}
                <div className="p-4 border-t">
                  {session ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        {session.user?.image ? (
                          <Image
                            src={session.user.image}
                            alt="Profile"
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full border-2 border-[#5956E9]/50"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full border-2 border-[#5956E9]/50 bg-gray-100 flex items-center justify-center">
                            <svg 
                              className="w-5 h-5 text-gray-600"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                              <circle cx="12" cy="7" r="4" />
                            </svg>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{session.user?.name}</p>
                          <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => signOut()}
                        className="w-full px-3 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-center"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        handleLoginClick();
                        setMobileNavOpen(false);
                      }}
                      className="w-full px-3 py-2 text-sm bg-[#5956E9] text-white rounded-lg hover:bg-[#5956E9]/90 transition-colors text-center"
                    >
                      Login
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="pt-24 pb-12 px-4 md:px-8">
        <div className="max-w-[1500px] mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {Array(12).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse h-full">
                  <div className="bg-white rounded-xl overflow-hidden h-full flex flex-col">
                    <div className="aspect-[3/4] bg-gray-200" />
                    <div className="p-4 flex-grow space-y-3">
                      <div className="h-5 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-full" />
                        <div className="h-4 bg-gray-200 rounded w-2/3" />
                      </div>
                      <div className="pt-4 mt-auto">
                        <div className="h-3 bg-gray-200 rounded w-24" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : stories.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-gray-500 text-lg">No stories found in this category.</p>
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                <AnimatePresence mode="wait">
                  {stories.map((story, index) => (
                    <motion.div
                      key={story._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link href={`/books/${story._id}`} className="group block h-full">
                        <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group-hover:shadow-[#5956E9]/20 h-full flex flex-col">
                          <div className="aspect-[3/4] relative overflow-hidden">
                            <Image
                              src={story.coverImage}
                              alt={story.title}
                              fill
                              className="object-cover transition-transform group-hover:scale-105"
                            />
                            <Badge 
                              variant={story.premiumStatus ? "default" : "secondary"}
                              className="absolute top-3 right-3 z-10"
                            >
                              {story.premiumStatus ? 'Premium' : 'Free'}
                            </Badge>
                          </div>
                          <div className="p-4 flex flex-col flex-grow">
                            <h2 className="font-semibold text-lg text-gray-900 line-clamp-1 mb-1">
                              {story.title}
                            </h2>
                            <p className="text-gray-600 text-sm mb-2">by {story.authorName}</p>
                            <p className="text-sm text-gray-500 line-clamp-2 flex-grow">
                              {story.description}
                            </p>
                            <div className="mt-4 pt-4 border-t">
                              <p className="text-xs text-gray-400">
                                {new Date(story.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <Button
                      key={i + 1}
                      variant={currentPage === i + 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add LoginModal at the bottom of the page */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </div>
  );
}
