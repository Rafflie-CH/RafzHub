"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function Callback() {

  const router = useRouter()

  useEffect(() => {

    const getSession = async () => {
      const { data } = await supabase.auth.getSession()

      if (data.session) {
        router.push("/dashboard")
      } else {
        router.push("/login")
      }
    }

    getSession()

  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      Mengkonfirmasi akun...
    </div>
  )
}