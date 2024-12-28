"use client"

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function QuickActionsSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
    >
      <Link href="/purchased">
        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-gradient-to-br from-white to-gray-50/80 border-2 border-transparent hover:border-[#5956E9]/20">
          <CardHeader className="p-6">
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
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <div className="space-y-1">
                <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-[#5956E9] transition-colors">
                  Purchased Stories
                </CardTitle>
                <CardDescription className="text-sm text-gray-500 group-hover:text-gray-600">
                  Access your collection of bought stories and audiobooks
                </CardDescription>
              </div>
            </div>
            <div className="mt-4 flex items-center text-[#5956E9] text-sm font-medium">
              <span className="group-hover:mr-2 transition-all">View Library</span>
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

      <Link href="/help">
        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-gradient-to-br from-white to-gray-50/80 border-2 border-transparent hover:border-[#5956E9]/20">
          <CardHeader className="p-6">
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
