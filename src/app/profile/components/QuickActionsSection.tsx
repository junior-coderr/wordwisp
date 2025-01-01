"use client"

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface QuickActionsSectionProps {
  userType?: string;
}

export function QuickActionsSection({ userType = 'listener' }: QuickActionsSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 auto-rows-fr" // Added auto-rows-fr
    >
      {userType === 'creator' && (
        <Link href="/authorized/upload/stories" className="h-full"> {/* Added h-full */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-gradient-to-br from-white to-gray-50/80 border-2 border-transparent hover:border-[#5956E9]/20 h-full"> {/* Added h-full */}
            <CardHeader className="p-6 h-full flex flex-col"> {/* Added h-full and flex flex-col */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-[#5956E9]/10 text-[#5956E9] group-hover:scale-110 transition-transform">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-[#5956E9] transition-colors">
                    Publish Story
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-500 group-hover:text-gray-600">
                    Share your story with the world
                  </CardDescription>
                </div>
              </div>
              <div className="mt-4 flex items-center text-[#5956E9] text-sm font-medium">
                <span className="group-hover:mr-2 transition-all">Create New</span>
                <svg 
                  className="w-4 h-4 opacity-0 -ml-4 group-hover:ml-0 group-hover:opacity-100 transition-all"
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </CardHeader>
          </Card>
        </Link>
      )}

      {/* Replace the Purchased Stories Link with Liked Stories */}
      <Link href="/liked" className="h-full">
        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-gradient-to-br from-white to-gray-50/80 border-2 border-transparent hover:border-[#5956E9]/20 h-full">
          <CardHeader className="p-6 h-full flex flex-col">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[#5956E9]/10 text-[#5956E9] group-hover:scale-110 transition-transform">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <div className="space-y-1">
                <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-[#5956E9] transition-colors">
                  Liked Stories
                </CardTitle>
                <CardDescription className="text-sm text-gray-500 group-hover:text-gray-600">
                  View your collection of favorite stories
                </CardDescription>
              </div>
            </div>
            <div className="mt-4 flex items-center text-[#5956E9] text-sm font-medium">
              <span className="group-hover:mr-2 transition-all">View Collection</span>
              <svg 
                className="w-4 h-4 opacity-0 -ml-4 group-hover:ml-0 group-hover:opacity-100 transition-all"
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          </CardHeader>
        </Card>
      </Link>

      <Link href="/help" className="h-full">
        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-gradient-to-br from-white to-gray-50/80 border-2 border-transparent hover:border-[#5956E9]/20 h-full"> {/* Added h-full */}
          <CardHeader className="p-6 h-full flex flex-col"> {/* Added h-full and flex flex-col */}
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[#5956E9]/10 text-[#5956E9] group-hover:scale-110 transition-transform">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="space-y-1">
                <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-[#5956E9] transition-colors">
                  Help & Support
                </CardTitle>
                <CardDescription className="text-sm text-gray-500 group-hover:text-gray-600">
                  Get assistance, FAQs, and contact support
                </CardDescription>
              </div>
            </div>
            <div className="mt-4 flex items-center text-[#5956E9] text-sm font-medium">
              <span className="group-hover:mr-2 transition-all">Get Help</span>
              <svg 
                className="w-4 h-4 opacity-0 -ml-4 group-hover:ml-0 group-hover:opacity-100 transition-all"
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          </CardHeader>
        </Card>
      </Link>
    </motion.div>
  );
}
