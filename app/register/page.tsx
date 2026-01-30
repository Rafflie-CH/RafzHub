"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Register() {
  const router = useRouter()

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleRegister = async () => {
    setLoading(true)
    setError("")

    // ✅ VALIDASI (biar ga bocil web nya 😹)
    if (!username || !email || !password) {
      setError("Semua field wajib diisi!")
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      username,
    },
  },
})

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    // 🔥 JANGAN redirect ke login!
    router.push("/verify")
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
          className="w-full p-3 mb-4 rounded-lg bg-[#070B14] border border-gray-700"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded-lg bg-[#070B14] border border-gray-700"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded-lg bg-[#070B14] border border-gray-700"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-red-400 mb-4 text-sm">
            {error}
          </p>
        )}

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-lg font-semibold transition"
        >
          {loading ? "Loading..." : "Daftar"}
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
