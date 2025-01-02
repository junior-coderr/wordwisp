import { motion } from 'framer-motion';

const BookIcon = () => {
  const books = [
    { delay: 0.5, rotate: -15, color: "from-purple-600/40 to-purple-800/40" },
    { delay: 0.7, rotate: 0, color: "from-indigo-600/40 to-indigo-800/40" },
    { delay: 0.9, rotate: 15, color: "from-blue-600/40 to-blue-800/40" },
  ];

  return (
    <div className="w-48 h-48 md:w-64 md:h-64 mx-auto mt-12 relative">
      {books.map((book, index) => (
        <motion.div
          key={index}
          initial={{ y: -200, opacity: 0 }}
          animate={{ 
            y: 0, 
            opacity: 1,
          }}
          transition={{
            type: "spring",
            damping: 12,
            stiffness: 100,
            delay: book.delay,
          }}
          className="absolute inset-0"
        >
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: book.rotate }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 150,
              delay: book.delay
            }}
            className="w-full h-full relative"
          >
            {/* Book */}
            <div className={`absolute inset-0 bg-gradient-to-br ${book.color} rounded-lg backdrop-blur-sm border border-white/20 shadow-2xl`}>
              {/* Spine effect */}
              <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-black/20 to-transparent" />
              
              {/* Page edge effect */}
              <div className="absolute right-0 top-2 bottom-2 w-1 bg-gradient-to-l from-white/40 to-transparent" />
              
              {/* Simple decorative lines */}
              <div className="absolute inset-0 p-6">
                <div className="w-full h-1 bg-white/10 rounded mb-3" />
                <div className="w-2/3 h-1 bg-white/10 rounded" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

export default BookIcon;
