"use client"

import { signOut } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';

export function SignOutButton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <Button
        onClick={() => signOut()}
        variant="outline"
        className="w-full p-6 justify-center text-red-600 hover:text-red-700 hover:bg-red-50 border-2 border-red-100 hover:border-red-200 transition-all group"
      >
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M16.5 3.75a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5V15a.75.75 0 0 0-1.5 0v3.75a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V5.25a3 3 0 0 0-3-3h-6ZM5.78 8.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 0 0 0 1.06l3 3a.75.75 0 0 0 1.06-1.06l-1.72-1.72H15a.75.75 0 0 0 0-1.5H4.06l1.72-1.72a.75.75 0 0 0 0-1.06Z" clipRule="evenodd" />
          </svg>
          <span className="font-medium text-base">Sign Out</span>
        </div>
      </Button>
    </motion.div>
  );
}
