import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req) {
  console.log('Middleware running for path:', req.nextUrl.pathname)
  
  try {
    const token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET 
    })
    
    console.log('Token:', token)

    const path = req.nextUrl.pathname

    // Define public routes that don't require authentication
    const isPublicPath = path === '/login' || path === '/register'

    // If trying to access a protected route without a token, redirect to login
    if (!isPublicPath && !token) {
      console.log('Redirecting to login')
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // If logged in and trying to access login, redirect to home
    if (isPublicPath && token) {
      console.log('Redirecting to home')
      return NextResponse.redirect(new URL('/', req.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/profile',
    // Add other routes you want to protect
  ]
}