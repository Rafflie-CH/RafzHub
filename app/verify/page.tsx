"use client"

import { useRouter } from "next/navigation"

export default function VerifyPage({
  searchParams,
}: {
  searchParams: { email?: string }
}) {
  const router = useRouter()

  const email = searchParams?.email

  if (!email) {
    router.push("/register")
    return null
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#070B14] text-white">
      <div className="bg-[#0F1624] p-8 rounded-2xl border border-gray-800 text-center max-w-md">

        <h1 className="text-2xl font-bold mb-4">
          Verifikasi Email 📩
        </h1>

        <p className="text-gray-400">
          OTP telah dikirim ke:
        </p>

        <p className="mt-2 font-semibold text-indigo-400">
          {email}
        </p>

      </div>
    </main>
  )
}
