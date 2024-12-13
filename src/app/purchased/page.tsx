"use client";
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

// Add this helper function
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
};

const purchasedBooks = [
  {
    id: 1,
    title: "The Silent Echo",
    author: "Sarah Mitchell",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
    category: "Mystery",
    price: 299,
    description: "A thrilling mystery that will keep you on the edge of your seat.",
    duration: "12h 30m",
    purchaseDate: "2024-01-15"
  },
  {
    id: 2,
    title: "Beyond the Horizon",
    author: "James Cooper",
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e",
    category: "Science Fiction",
    price: 349,
    description: "An epic journey through space and time.",
    duration: "14h 15m",
    purchaseDate: "2024-01-10"
  }
];

export default function PurchasedPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-[1500px] mx-auto px-4 py-4">
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center p-2 -ml-2 text-[#5956E9] hover:text-[#4745BB] transition-colors"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="w-5 h-5"
              >
                <path 
                  fillRule="evenodd" 
                  d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" 
                  clipRule="evenodd" 
                />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 ml-2">Purchased Stories</h1>
          </div>
        </div>
      </div>

      <div className="pt-24 pb-12 px-4 md:px-8">
        <div className="max-w-[1500px] mx-auto">
          {purchasedBooks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">You haven&apos;t purchased any stories yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {purchasedBooks.map((book, index) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/listen/${book.id}`} className="group block transform transition-all duration-300 hover:-translate-y-2">
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
                          <span className="text-sm text-gray-500">Purchased on {formatDate(book.purchaseDate)}</span>
                          <span className="text-sm text-gray-500 transition-colors duration-300 group-hover:text-gray-700">{book.duration}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
