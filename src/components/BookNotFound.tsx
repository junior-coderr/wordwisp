
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { AlertCircle } from 'lucide-react';

export default function BookNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-gray-900">Story Not Found</h1>
          <p className="text-gray-600">
            The story you're looking for doesn't exist or has been removed.
          </p>
        </div>
        <Link href="/library">
          <Button className="bg-[#5956E9] hover:bg-[#4745BB]">
            Back to Library
          </Button>
        </Link>
      </div>
    </div>
  );
}