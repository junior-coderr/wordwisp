import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default function UnauthorizedPage() {
    return (
        <div className="container mx-auto max-w-2xl min-h-screen flex items-center justify-center p-4">
            <Alert variant="destructive" className="border-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Unauthorized Access</AlertTitle>
                <AlertDescription className="mt-4">
                    <p className="mb-4">
                        You don&apos;t have permission to access this page. Only authorized content creators can upload stories.
                    </p>
                    <Button asChild>
                        <Link href="/">Return Home</Link>
                    </Button>
                </AlertDescription>
            </Alert>
        </div>
    )
}
