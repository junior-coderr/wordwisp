"use client";
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion'; // Add this import
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import LoginModal from '@/components/LoginModal'; // Add this import
import { useRouter, useSearchParams } from 'next/navigation';

const categories = [
  { id: 'all', label: 'All' },
  { id: 'motivational', label: 'Motivational' },
  { id: 'stories', label: 'Stories' },
  { id: 'horror', label: 'Horror' },
  { id: 'romance', label: 'Romance' },
  { id: 'mystery', label: 'Mystery' }
];

const allBooks = [
  {
    id: 1,
    title: "The Silent Echo",
    author: "Sarah Mitchell",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
    category: "Mystery",
    price: 299,
    description: "A thrilling mystery that will keep you on the edge of your seat.",
    duration: "12h 30m"
  },
  {
    id: 2,
    title: "Beyond the Horizon",
    author: "James Cooper",
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e",
    category: "Mystery",
    price: 349,
    description: "An epic journey through space and time.",
    duration: "14h 15m"
  },
  {
    id: 3,
    title: "Whispers of the Past",
    author: "Emily Carter",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
    category: "Mystery",
    price: 399,
    description: "A captivating tale set in the Victorian era.",
    duration: "10h 45m"
  },
  {
    id: 4,
    title: "The Last Frontier",
    author: "Michael Brown",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    category: "Mystery",
    price: 299,
    description: "An exhilarating adventure in the wild.",
    duration: "11h 20m"
  },
  {
    id: 5,
    title: "Echoes of Eternity",
    author: "Laura White",
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765",
    category: "Mystery",
    price: 349,
    description: "A magical journey through a mystical land.",
    duration: "13h 50m"
  },
  {
    id: 6,
    title: "Mind Over Matter",
    author: "Robert Johnson",
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73",
    category: "Motivational",
    price: 299,
    description: "Transform your mindset and achieve your goals.",
    duration: "8h 45m"
  },
  {
    id: 7,
    title: "Haunted Hills",
    author: "Patricia Blake",
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73",
    category: "Horror",
    price: 329,
    description: "A spine-chilling tale of supernatural encounters.",
    duration: "10h 15m"
  },
  {
    id: 8,
    title: "Love in Paris",
    author: "Sophie Martin",
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e",
    category: "Romance",
    price: 279,
    description: "A romantic journey through the city of love.",
    duration: "9h 30m"
  },
];

export default function LibraryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('genre') || 'all');
  const [filteredBooks, setFilteredBooks] = useState(allBooks);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLanguageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('Hindi');
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);

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

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredBooks(allBooks);
    } else {
      setFilteredBooks(allBooks.filter(book => 
        book.category.toLowerCase() === selectedCategory.toLowerCase()
      ));
    }
  }, [selectedCategory]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-[1500px] mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
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
            </Link>

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
                    className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#5956E9]/50 hover:border-[#5956E9] transition-colors focus:outline-none"
                  >
                    <Image
                      src={session.user?.image || '/default-avatar.png'}
                      alt="Profile"
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
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
                        <Link
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
                        </Link>
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
            <button
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
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
                        <Image
                          src={session.user?.image || '/default-avatar.png'}
                          alt="Profile"
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full border-2 border-[#5956E9]/50"
                        />
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
          {filteredBooks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-gray-500 text-lg">No books found in this category.</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              <AnimatePresence mode="wait">
                {filteredBooks.map((book, index) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      transition: { 
                        duration: 0.2,
                        delay: index * 0.05
                      }
                    }}
                    exit={{ 
                      opacity: 0,
                      x: -20,
                      transition: { duration: 0.15 }
                    }}
                  >
                    <Link href={`/books/${book.id}`} className="group block transform transition-all duration-300 hover:-translate-y-2">
                      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group-hover:shadow-[#5956E9]/20">
                        <div className="aspect-[3/4] relative overflow-hidden">
                          <Image
                            src={book.image}
                            alt={book.title}
                            fill
                            className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-2"
                          />
                        </div>
                        <div className="p-4 space-y-2">
                          <div className="space-y-1">
                            <span className="text-sm text-purple-600 transition-colors duration-300 group-hover:text-[#5956E9]">{book.category}</span>
                            <h2 className="font-semibold text-lg text-gray-900 line-clamp-1 transition-colors duration-300 group-hover:text-[#5956E9]">
                              {book.title}
                            </h2>
                            <p className="text-gray-600 text-sm transition-colors duration-300 group-hover:text-gray-800">by {book.author}</p>
                          </div>
                          <div className="flex items-center justify-between pt-2">
                            <span className="font-bold text-[#5956E9] transition-all duration-300 group-hover:scale-110">₹{book.price}</span>
                            <span className="text-sm text-gray-500 transition-colors duration-300 group-hover:text-gray-700">{book.duration}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
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
