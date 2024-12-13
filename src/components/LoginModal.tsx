import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from 'framer-motion'; // Add this import

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isManualLogin, setIsManualLogin] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const resetStates = () => {
    setIsManualLogin(false);
    setIsSignUp(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>

            <h2 className="text-2xl font-bold text-center mb-6">
              {isSignUp ? "Create Account" : "Login to Wordwisp"}
            </h2>

            <AnimatePresence mode="wait">
              {!isManualLogin ? (
                <motion.div
                  key="social-login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2 h-12"
                    onClick={() => {/* Implement Google login */}}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="text-gray-700">Continue with Google</span>
                  </Button>

                  <div className="text-center">
                    <span className="text-gray-500">or</span>
                  </div>

                  <Button 
                    variant="outline"
                    className="w-full h-12"
                    onClick={() => setIsManualLogin(true)}
                  >
                    Continue with Email
                  </Button>
                </motion.div>
              ) : (
                <motion.form
                  key={isSignUp ? "signup-form" : "login-form"}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                  onSubmit={(e) => e.preventDefault()}
                >
                  {isSignUp && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5956E9]"
                        placeholder="Enter your full name"
                      />
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5956E9]"
                      placeholder="Enter your email"
                    />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: isSignUp ? 0.3 : 0.2 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5956E9]"
                      placeholder="Enter your password"
                    />
                  </motion.div>

                  {isSignUp && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5956E9]"
                        placeholder="Confirm your password"
                      />
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: isSignUp ? 0.5 : 0.3 }}
                  >
                    <Button className="w-full bg-[#5956E9] hover:bg-[#4644c7]">
                      {isSignUp ? "Create Account" : "Login"}
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full mt-2"
                      onClick={() => setIsManualLogin(false)}
                    >
                      Back to login options
                    </Button>
                  </motion.div>

                  <div className="text-center text-sm text-gray-500">
                    {isSignUp ? (
                      <p>
                        Already have an account?{" "}
                        <button
                          className="text-[#5956E9] hover:underline"
                          onClick={() => setIsSignUp(false)}
                        >
                          Login here
                        </button>
                      </p>
                    ) : (
                      <p>
                        Dont have an account?{" "}
                        <button
                          className="text-[#5956E9] hover:underline"
                          onClick={() => setIsSignUp(true)}
                        >
                          Create one
                        </button>
                      </p>
                    )}
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}