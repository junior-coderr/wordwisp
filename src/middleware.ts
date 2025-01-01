import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { isAuthorizedEmail } from '@/lib/auth'

export default async function middleware(request: NextRequest) {
    const token = await getToken({ req: request })
    
    // Check if the path is the upload page
    if (request.nextUrl.pathname.startsWith('/authorized/upload')) {
        if (!token) {
            return NextResponse.redirect(new URL('/api/auth/signin', request.url))
        }

        // Check if the user's email is authorized
        if (!isAuthorizedEmail(token.email)) {
            return NextResponse.redirect(new URL('/unauthorized', request.url))
        }
    }

    return NextResponse.next()
}
