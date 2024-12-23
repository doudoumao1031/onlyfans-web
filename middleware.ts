import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Clone the request headers and set a new header `x-hello-from-middleware1`
    const requestHeaders = new Headers(request.headers)
    // userId
    requestHeaders.set('X-Token', '20241400');

    // You can also set request headers in NextResponse.next
    const response = NextResponse.next({
        request: {
            // New request headers
            headers: requestHeaders,
        },
    })

    // Set a new response header `x-hello-from-middleware2`
    // response.headers.set('x-hello-from-middleware2', 'hello')
    return response
}

export const config = {
    // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
    matcher: ['/((?!_next/static|_next/image|.*\\.png$).*)'],
};