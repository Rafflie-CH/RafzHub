"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"

export default function Login() {

  const router = useRouter()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {

    if (!email) {
      toast.error("Masukkan email!")
      return
    }

    setLoading(true)

    const load = toast.loading("Mengirim OTP...")

    const { error } = await supabase.auth.signInWithOtp({
      email
    })

    toast.dismiss(load)
    setLoading(false)

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success("Kode login dikirim 🔥")

    router.push(`/verify?email=${email}`)
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#070B14] text-white px-6">
      <div className="bg-[#0F1624] p-8 rounded-2xl w-full max-w-md border border-gray-800">

        <h1 className="text-2xl font-bold mb-6 text-center">
          Login RafzHub
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded-lg bg-[#070B14] border border-gray-700 outline-none focus:border-indigo-500"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-lg font-semibold"
        >
          {loading ? "Mengirim..." : "Login pakai OTP"}
        </button>

        <p className="text-gray-400 text-sm mt-6 text-center">
          Belum punya akun?{" "}
          <Link href="/register" className="text-indigo-400 hover:underline">
            Ayuk daftar
          </Link>
        </p>

      </div>
    </main>
  )
}
