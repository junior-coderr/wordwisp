"use client"

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface BackButtonProps {
  className?: string;
}

export const BackButton = ({ className = '' }: BackButtonProps) => {
  const router = useRouter();

  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={() => router.back()}
      className={`mb-4 sm:mb-6 inline-flex items-center gap-1.5 sm:gap-2 text-gray-600 hover:text-[#5956E9] transition-colors text-sm sm:text-base ${className}`}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      <span className="font-medium">Back</span>
    </motion.button>
  );
}
