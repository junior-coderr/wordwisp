"use client"

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from 'next-auth';

export function ProfileSection({ user }: { user: User }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden">
        <div className="h-24 sm:h-32 bg-gradient-to-r from-[#5956E9] to-[#7673ff]" />
        <div className="relative px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="absolute -top-10 sm:-top-12">
            <div className="rounded-full border-3 sm:border-4 border-white overflow-hidden">
              {user?.image ? (
                <Image
                  src={user.image}
                  alt="Profile"
                  width={96}
                  height={96}
                  className="h-20 w-20 sm:h-24 sm:w-24 object-cover"
                />
              ) : (
                <div className="h-20 w-20 sm:h-24 sm:w-24 bg-gray-200 flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
          <div className="pt-12 sm:pt-16">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {user?.name}
                </h2>
                <p className="text-sm sm:text-base text-gray-500">{user?.email}</p>
              </div>
              <Badge variant="secondary" className="text-xs sm:text-sm bg-[#5956E9]/10 text-[#5956E9]">
                Free Plan
              </Badge>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
