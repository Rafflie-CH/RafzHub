"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

export default function Verify() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const email = searchParams.get("email")

  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)

  const handleVerify = async () => {
    if (!otp) {
      toast.error("Masukkan kode OTP!")
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.verifyOtp({
      email: email!,
      token: otp,
      type: "email",
    })

    setLoading(false)

    if (error) {
      toast.error("Kode salah atau expired!")
      return
    }

    toast.success("Login berhasil!")

    // 🔥 langsung masuk dashboard
    router.push("/dashboard")
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#070B14] text-white">

      <div className="bg-[#0F1624] p-8 rounded-2xl w-full max-w-md border border-gray-800">

        <h1 className="text-2xl font-bold mb-2 text-center">
          Verifikasi OTP
        </h1>

        <p className="text-gray-400 text-sm mb-6 text-center">
          Masukkan kode yang dikirim ke:
          <br />
          <span className="text-indigo-400">{email}</span>
        </p>

        <input
          placeholder="6 digit kode"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg bg-[#070B14] border border-gray-700 text-center tracking-[6px]"
        />

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-lg font-semibold"
        >
          {loading ? "Memverifikasi..." : "Verifikasi"}
        </button>

      </div>

    </main>
  )
}
