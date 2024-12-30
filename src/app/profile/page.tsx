import { getServerSession } from 'next-auth/next';
import authOptions from '@/app/api/auth/[...nextauth]/option';
import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BackButton } from './components/BackButton';
import { ProfileSection } from './components/ProfileSection';
import { QuickActionsSection } from './components/QuickActionsSection';
import { AccountActionsSection } from './components/AccountActionsSection';
import { SignOutButton } from './components/SignOutButton';
import { UploadedStories } from './components/UploadedStories';
import { Suspense } from 'react';
import connectDB from '../api/db/connect';
import User from '../api/model/user';
import { Story } from '../api/model/storie';

// Add this helper function at the top level
const convertToPlainObject = (doc: any) => {
  if (!doc) return null;
  if (Array.isArray(doc)) {
    return doc.map(item => convertToPlainObject(item));
  }
  if (typeof doc.toObject === 'function') {
    const obj = doc.toObject();
    // Remove Mongoose-specific fields
    delete obj.__v;
    delete obj._id;
    return { ...obj, id: doc._id.toString() };
  }
  return doc;
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gray-50 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
          {/* Skeleton Profile Header */}
          <Card className="overflow-hidden">
            <CardHeader>
              <Skeleton className="h-24 sm:h-32 bg-gray-200" />
            </CardHeader>
            <div className="relative px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="absolute -top-10 sm:-top-12">
                <Skeleton className="h-20 w-20 sm:h-24 sm:w-24 rounded-full" />
              </div>
              <div className="pt-12 sm:pt-16">
                <div className="flex items-center justify-between">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Skeleton className="h-6 sm:h-7 w-32 sm:w-48" />
                    <Skeleton className="h-3.5 sm:h-4 w-24 sm:w-32" />
                  </div>
                  <Skeleton className="h-5 sm:h-6 w-16 sm:w-20" />
                </div>
              </div>
            </div>
          </Card>

          {/* Skeleton Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-4 w-24 mt-1" />
              </CardHeader>
            </Card>
            <Card className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-4 w-24 mt-1" />
              </CardHeader>
            </Card>
          </div>

          {/* Skeleton Account Actions */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Skeleton className="h-7 w-40" />
              <div className="h-px flex-1 bg-gray-200 ml-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-[140px] rounded-xl" />
              <Skeleton className="h-[140px] rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  try {
    // Fetch user data including uploaded stories
    await connectDB();
    
    // Use Promise.all to fetch data concurrently
    const [userDoc, uploadedStoriesDocs] = await Promise.all([
      User.findOne({ email: session.user.email }),
      Story.find({ 
        author: session.user.email 
      }).sort({ createdAt: -1 })
    ]);

    if (!userDoc) {
      throw new Error('User not found');
    }

    // Convert Mongoose documents to plain objects
    const user = convertToPlainObject(userDoc);
    const uploadedStories = convertToPlainObject(uploadedStoriesDocs);

    return (
      <div className="min-h-screen bg-gray-50 py-2 sm:py-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-4"> {/* Reduced from space-y-4/6 to just space-y-3 */}
          <div className="relative -ml-2 -mb-2 mt-1"> {/* Added negative margin bottom */}
            <BackButton />
          </div>
          <ProfileSection 
            user={{
              ...session.user,
              userType: user.userType || 'listener',
              totalEarnings: user.totalEarnings || 0,
              totalSales: user.totalSales || 0
            }} 
          />
          <QuickActionsSection userType={user.userType} />
          {user.userType === 'creator' && (
            <Suspense fallback={<UploadedStories stories={[]} isLoading={true} />}>
              <UploadedStories 
                stories={uploadedStories} 
                isLoading={false}
              />
            </Suspense>
          )}
          <AccountActionsSection 
            isVerified={user.isVerified} 
            userType={user.userType} 
          />
          <SignOutButton />
          <div className="h-6 sm:h-8" />
        </div>
      </div>
    );

  } catch (error) {
    console.error('Error loading profile:', error);
    return (
      <div className="min-h-screen bg-gray-50 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load profile data. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }
}
