import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {

  const res = NextResponse.next()

  const supabase = createMiddlewareClient({
    req,
    res
  })

  const {
    data: { session }
  } = await supabase.auth.getSession()

  const pathname = req.nextUrl.pathname

  const isProtected = pathname.startsWith("/dashboard")

  const isAuth =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/verify")


  // ❌ belum login tapi masuk dashboard
  if (!session && isProtected) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // ✅ sudah login tapi buka auth page
  if (session && isAuth) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return res
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register", "/verify"]
}
