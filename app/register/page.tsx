"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"

export default function Register() {
  const router = useRouter()

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleRegister = async () => {

  if (!username || !email || !password) {
    toast.error("Isi semua field!")
    return
  }

  if (loading) return
  setLoading(true)

  const load = toast.loading("Mengirim OTP...")

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options:{
      shouldCreateUser:true,
      data:{ username }
    }
  })

  toast.dismiss(load)
  setLoading(false)

  if(error){
    toast.error(error.message)
    return
  }

  toast.success("OTP dikirim 🚀")

  router.push(`/verify?email=${email}`)
}

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#070B14] text-white px-6">
      <div className="bg-[#0F1624] p-8 rounded-2xl w-full max-w-md border border-gray-800">

        <h1 className="text-2xl font-bold mb-6 text-center">
          Daftar RafzHub
        </h1>

        {/* USERNAME */}
        <input
          placeholder="Username"
          className="w-full p-3 mb-4 rounded-lg bg-[#070B14] border border-gray-700 outline-none focus:border-indigo-500"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded-lg bg-[#070B14] border border-gray-700 outline-none focus:border-indigo-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded-lg bg-[#070B14] border border-gray-700 outline-none focus:border-indigo-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Membuat akun..." : "Daftar"}
        </button>

        {/* SWITCH LOGIN */}
        <p className="text-gray-400 text-sm mt-6 text-center">
          Udah ada akun?{" "}
          <Link href="/login" className="text-indigo-400 hover:underline">
            Ayuk login
          </Link>
        </p>

      </div>
    </main>
  )
}
