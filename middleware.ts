import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Пропускаем все, кроме /admin (но не /admin/login)
  if (request.nextUrl.pathname === '/admin') {
    const authCookie = request.cookies.get('admin-auth')
    
    // Если нет авторизации, перенаправляем на страницу логина
    if (!authCookie || authCookie.value !== 'authenticated') {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
