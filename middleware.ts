import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Пропускаем /admin/login и API маршруты
  if (pathname === '/admin/login' || pathname.startsWith('/api/admin/')) {
    return NextResponse.next()
  }
  
  // Проверяем авторизацию для /admin и всех подпутей
  if (pathname.startsWith('/admin')) {
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
