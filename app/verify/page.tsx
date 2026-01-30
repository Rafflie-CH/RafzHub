"use client"

import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Verify() {
  const params = useSearchParams()
  const router = useRouter()

  const email = params.get("email")

  useEffect(() => {
    if (!email) {
      router.push("/register")
    }
  }, [email, router])

  return (
    <div>
      OTP dikirim ke {email}
    </div>
  )
}
