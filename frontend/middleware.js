import { NextResponse } from 'next/server'

export function middleware(request) {
    const pathname = request.nextUrl.pathname

    let verify = request.cookies.get('refresh_token')
    if (pathname.startsWith('/login') || pathname.startsWith('/signup')) {
        if (verify) {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    return NextResponse.next()
}