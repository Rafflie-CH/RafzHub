"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Login(){
  const router = useRouter()

  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [show,setShow]=useState(false)
  const [loading,setLoading]=useState(false)

  const login = async () => {

  setLoading(true)

  const load = toast.loading("Masuk...")

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if(error){
    toast.dismiss(load)
    toast.error("Invalid login credentials 😹")
    setLoading(false)
    return
  }

  // 🔥 PENTING BANGET
  // tunggu session ke set di cookie
  await supabase.auth.getSession()

  toast.dismiss(load)
  toast.success("Login berhasil 🔥")

  // kasih delay dikit biar middleware kebaca
  setTimeout(()=>{
    window.location.href = "/dashboard"
    router.refresh()
  }, 500)
}

  return(
    <main className="min-h-screen flex items-center justify-center bg-[#070B14] text-white px-6">

      <div className="bg-[#0F1624] p-8 rounded-2xl w-full max-w-md border border-gray-800">

        <h1 className="text-2xl font-bold mb-6 text-center">
          Login RafzHub
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded-lg bg-[#070B14] border border-gray-700"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <div className="relative mb-4">
          <input
            type={show?"text":"password"}
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-[#070B14] border border-gray-700"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={()=>setShow(!show)}
            className="absolute right-3 top-3 text-gray-400"
          >
            {show?<EyeOff size={20}/>:<Eye size={20}/>}
          </button>
        </div>

        <button
          onClick={login}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-lg font-semibold"
        >
          Login
        </button>

        <p className="text-gray-400 text-sm mt-6 text-center">
          Belum punya akun?{" "}
          <Link href="/register" className="text-indigo-400">
            Ayuk daftar
          </Link>
        </p>

      </div>
    </main>
  )
}
