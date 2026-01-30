import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(req: NextRequest) {

  let response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies:{
        get(name:string){
          return req.cookies.get(name)?.value
        },
        set(name:string,value:string,options:any){
          response.cookies.set({
            name,
            value,
            ...options
          })
        },
        remove(name:string,options:any){
          response.cookies.set({
            name,
            value:"",
            ...options
          })
        }
      }
    }
  )

  const {
    data:{user}
  } = await supabase.auth.getUser()

  const path = req.nextUrl.pathname

  const protectedRoute = path.startsWith("/dashboard")
  const authRoute =
    path.startsWith("/login") ||
    path.startsWith("/register") ||
    path.startsWith("/verify")

  if(!user && protectedRoute){
    return NextResponse.redirect(new URL("/login",req.url))
  }

  if(user && authRoute){
    return NextResponse.redirect(new URL("/dashboard",req.url))
  }

  return response
}

export const config = {
  matcher:["/dashboard/:path*","/login","/register","/verify"]
}
