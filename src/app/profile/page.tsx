import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/option';
import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BackButton } from './components/BackButton';
import { ProfileSection } from './components/ProfileSection';
import { QuickActionsSection } from './components/QuickActionsSection';
import { AccountActionsSection } from './components/AccountActionsSection';
import { SignOutButton } from './components/SignOutButton';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
          {/* Skeleton Profile Header */}
          <Card className="overflow-hidden">
            <Skeleton className="h-24 sm:h-32 bg-gray-200" />
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

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <BackButton />
      <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
        <ProfileSection user={session.user} />
        <QuickActionsSection />
        <AccountActionsSection />
        <SignOutButton />
        <div className="h-6 sm:h-8" />
      </div>
    </div>
  );
}
