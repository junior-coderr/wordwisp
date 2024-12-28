"use client"

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function AccountActionsSection() {
  const [isVerificationDialogOpen, setIsVerificationDialogOpen] = useState(false);
  const [isCreatorDialogOpen, setIsCreatorDialogOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="space-y-4 sm:space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 font-display">Account Actions</h3>
        <div className="h-px flex-1 bg-gradient-to-r from-[#5956E9]/20 to-transparent ml-4" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Verify Account Dialog */}
        <Dialog open={isVerificationDialogOpen} onOpenChange={setIsVerificationDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full h-auto p-4 sm:p-6 justify-start bg-white hover:bg-gray-50/80 border-2 hover:border-[#5956E9]/30 transition-all group"
            >
              <div className="flex flex-col items-start gap-3 sm:gap-4">
                <div className="p-2.5 sm:p-3 rounded-xl bg-[#5956E9]/10 text-[#5956E9] group-hover:scale-110 transition-transform">
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
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div className="space-y-0.5 sm:space-y-1 text-left">
                  <h4 className="font-semibold text-base sm:text-lg text-gray-900">Verify Account</h4>
                  <p className="text-xs sm:text-sm text-gray-500">Get verified to unlock premium features</p>
                </div>
              </div>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle>Verify Your Account</DialogTitle>
              <DialogDescription>
                Complete verification to unlock all features and build trust with your audience.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsVerificationDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-[#5956E9] hover:bg-[#4845c7]">
                Start Verification
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Become Creator Dialog */}
        <Dialog open={isCreatorDialogOpen} onOpenChange={setIsCreatorDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full h-auto p-4 sm:p-6 justify-start bg-white hover:bg-gray-50/80 border-2 hover:border-[#5956E9]/30 transition-all group"
            >
              <div className="flex flex-col items-start gap-3 sm:gap-4">
                <div className="p-2.5 sm:p-3 rounded-xl bg-[#5956E9]/10 text-[#5956E9] group-hover:scale-110 transition-transform">
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
                      d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                    />
                  </svg>
                </div>
                <div className="space-y-0.5 sm:space-y-1 text-left">
                  <h4 className="font-semibold text-base sm:text-lg text-gray-900">Become a Creator</h4>
                  <p className="text-xs sm:text-sm text-gray-500">Start sharing your stories and earn</p>
                </div>
              </div>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle>Become a Creator</DialogTitle>
              <DialogDescription>
                Share your stories with the world and earn from your creativity.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreatorDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-[#5956E9] hover:bg-[#4845c7]">
                Start Creating
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </motion.div>
  );
}
