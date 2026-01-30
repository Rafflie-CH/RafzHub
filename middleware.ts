import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(key: string) {
          return req.cookies.get(key)?.value
        },
        set(key: string, value: string, options: any) {
          res.cookies.set(key, value, options)
        },
        remove(key: string, options: any) {
          res.cookies.set(key, "", options)
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = req.nextUrl.pathname

  const isProtected = pathname.startsWith("/dashboard")
  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/verify")

  // ❌ belum login tapi akses dashboard
  if (!user && isProtected) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // ✅ sudah login tapi buka auth page
  if (user && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return res
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register", "/verify"],
}
