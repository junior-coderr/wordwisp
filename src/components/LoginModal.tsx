import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { signIn, signOut, useSession } from "next-auth/react";
import { AlertCircle, Mail } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Validation schemas
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .regex(/^[a-zA-Z\s]*$/, "Name can only contain letters and spaces"),
  email: z.string()
    .email("Please enter a valid email")
    .min(1, "Email is required"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { data: session } = useSession();
  const [isManualLogin, setIsManualLogin] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      await signIn('google');
    } catch (error) {
      console.error('Google sign in error:', error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleRegister = async (data: RegisterFormValues) => {
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: data.name, 
          email: data.email, 
          password: data.password 
        }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        // Handle specific error cases
        if (responseData.code === 'EMAIL_EXISTS') {
          registerForm.setError('email', {
            type: 'manual',
            message: 'This email is already registered'
          });
        } else {
          setError(responseData.error || 'Registration failed');
        }
        return;
      }

      const loginResult = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (loginResult?.error) {
        setError(loginResult.error);
      } else if (loginResult?.ok) {
        onClose();
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (data: LoginFormValues) => {
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        onClose();
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const resetStates = () => {
    setIsManualLogin(false);
    setIsSignUp(false);
  };

  const ErrorMessage = ({ message }: { message: string }) => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md mb-4"
    >
      <div className="flex items-center">
        <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
        <p className="text-sm text-red-700">{message}</p>
      </div>
    </motion.div>
  );

  const FormError = ({ message }: { message: string }) => (
    <motion.p
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="mt-1 text-sm text-red-500 flex items-center gap-1"
    >
      <AlertCircle className="h-3 w-3" />
      <span>{message}</span>
    </motion.p>
  );

  if (session) {
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
            >
              <h2 className="text-2xl font-bold text-center mb-6">Account</h2>
              <div className="text-center mb-4">
                Signed in as {session.user?.email}
              </div>
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

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
                  className="space-y-3" // Changed from space-y-4 to space-y-3
                >
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2 h-12"
                    onClick={handleGoogleSignIn}
                    disabled={isGoogleLoading}
                  >
                    {isGoogleLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full"
                      />
                    ) : (
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
                    )}
                    <span className="text-gray-700">
                      {isGoogleLoading ? "Signing in..." : "Continue with Google"}
                    </span>
                  </Button>

                  <div className="text-center text-sm"> {/* Added text-sm to reduce height */}
                    <span className="text-gray-500">or</span>
                  </div>

                  <Button 
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 h-12"
                    onClick={() => setIsManualLogin(true)}
                  >
                    <Mail className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Continue with Email</span>
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
                  onSubmit={isSignUp ? 
                    registerForm.handleSubmit(handleRegister) : 
                    loginForm.handleSubmit(handleLogin)
                  }
                >
                  <AnimatePresence>
                    {error && <ErrorMessage message={error} />}
                  </AnimatePresence>
                  
                  {isSignUp ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="space-y-4"
                    >
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Full Name
                        </label>
                        <input
                          {...registerForm.register('name')}
                          type="text"
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5956E9] ${
                            registerForm.formState.errors.name ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter your full name"
                        />
                        <AnimatePresence>
                          {registerForm.formState.errors.name && (
                            <FormError message={registerForm.formState.errors.name.message!} />
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <input
                          {...registerForm.register('email')}
                          type="email"
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5956E9] ${
                            registerForm.formState.errors.email ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter your email"
                        />
                        <AnimatePresence>
                          {registerForm.formState.errors.email && (
                            <FormError message={registerForm.formState.errors.email.message!} />
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Password
                        </label>
                        <input
                          {...registerForm.register('password')}
                          type="password"
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5956E9] ${
                            registerForm.formState.errors.password ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter your password"
                        />
                        <AnimatePresence>
                          {registerForm.formState.errors.password && (
                            <FormError message={registerForm.formState.errors.password.message!} />
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Confirm Password
                        </label>
                        <input
                          {...registerForm.register('confirmPassword')}
                          type="password"
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5956E9] ${
                            registerForm.formState.errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Confirm your password"
                        />
                        <AnimatePresence>
                          {registerForm.formState.errors.confirmPassword && (
                            <FormError message={registerForm.formState.errors.confirmPassword.message!} />
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ) : (
                    // Login form fields
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="space-y-4"
                    >
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <input
                          {...loginForm.register('email')}
                          type="email"
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5956E9] ${
                            loginForm.formState.errors.email ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter your email"
                        />
                        <AnimatePresence>
                          {loginForm.formState.errors.email && (
                            <FormError message={loginForm.formState.errors.email.message!} />
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Password
                        </label>
                        <input
                          {...loginForm.register('password')}
                          type="password"
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5956E9] ${
                            loginForm.formState.errors.password ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter your password"
                        />
                        <AnimatePresence>
                          {loginForm.formState.errors.password && (
                            <FormError message={loginForm.formState.errors.password.message!} />
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: isSignUp ? 0.5 : 0.3 }}
                  >
                    <Button 
                      className="w-full bg-[#5956E9] hover:bg-[#4644c7]"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        isSignUp ? "Create Account" : "Login"
                      )}
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
