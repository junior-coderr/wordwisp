"use client"

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from 'next-auth';

const getInitials = (name: string | null | undefined) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getRandomColor = (name: string | null | undefined) => {
  const colors = [
    'from-[#5956E9] to-[#4845c7]',    // Primary theme
    'from-[#6E6BE9] to-[#5754E9]',    // Lighter variant
    'from-[#4A47E9] to-[#3532E9]',    // Darker variant
    'from-[#7C79EA] to-[#6967EA]',    // Softer variant
    'from-[#5956E9] to-[#7674EA]',    // Gradient up
    'from-[#5956E9] to-[#4341EA]',    // Gradient down
  ];
  
  if (!name) return colors[0];
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
};

interface ProfileSectionProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    userType?: string;
    totalEarnings?: number;
    totalSales?: number;
  };
}

export function ProfileSection({ user }: ProfileSectionProps) {
  const isCreator = user.userType === 'creator';
  const initials = getInitials(user.name);
  const gradientColor = getRandomColor(user.name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="p-0"> {/* Remove padding from CardHeader */}
          <div className="h-24 sm:h-32 bg-gradient-to-r from-[#5956E9] to-[#4845c7]" />
        </CardHeader>
        <div className="relative px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="absolute -top-10 sm:-top-12">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || 'Profile'}
                width={96}
                height={96}
                className="rounded-full border-4 border-white h-20 w-20 sm:h-24 sm:w-24"
              />
            ) : (
              <div className={`rounded-full border-4 border-white h-20 w-20 sm:h-24 sm:w-24 flex items-center justify-center bg-gradient-to-br ${gradientColor}`}>
                <span className="text-white text-2xl sm:text-3xl font-bold">
                  {initials}
                </span>
              </div>
            )}
          </div>
          <div className="pt-12 sm:pt-16">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {user?.name}
                </h2>
                {isCreator && (
                  <div className="inline-flex items-center px-2 py-1 rounded-full bg-[#5956E9]/10 text-[#5956E9] text-xs">
                    <svg 
                      className="w-3 h-3 mr-1" 
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                    Creator
                  </div>
                )}
              </div>
              <Badge variant="secondary" className="text-xs sm:text-sm bg-[#5956E9]/10 text-[#5956E9]">
                Free Plan
              </Badge>
            </div>
            <p className="text-sm sm:text-base text-gray-500 mt-1">{user?.email}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
