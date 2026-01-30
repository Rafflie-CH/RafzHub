"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Eye, EyeOff } from "lucide-react"

export default function Login(){

  const router = useRouter()

  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [show,setShow]=useState(false)
  const [loading,setLoading]=useState(false)


  const handleLogin = async()=>{

    if(loading) return

    setLoading(true)

    const load=toast.loading("Masuk...")

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    toast.dismiss(load)
    setLoading(false)

    if(error){
      toast.error("Email atau password salah 😹")
      return
    }

    toast.success("Welcome back 🔥")

    router.push("/dashboard")
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

        <div className="relative mb-6">

          <input
            type={show?"text":"password"}
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-[#070B14] border border-gray-700 pr-10"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={()=>setShow(!show)}
            className="absolute right-3 top-3 text-gray-400"
          >
            {show ? <EyeOff size={18}/> : <Eye size={18}/>}
          </button>

        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-lg font-semibold disabled:opacity-40"
        >
          {loading?"Loading...":"Login"}
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
