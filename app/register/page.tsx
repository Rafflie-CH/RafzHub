"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Eye, EyeOff } from "lucide-react"

export default function Register(){

  const router = useRouter()

  const [username,setUsername]=useState("")
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [show,setShow]=useState(false)
  const [loading,setLoading]=useState(false)


  const handleRegister = async()=>{

    if(loading) return

    if(!username || !email || !password){
      toast.error("Isi semua field 😹")
      return
    }

    setLoading(true)

    const load=toast.loading("Membuat akun...")

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options:{
        data:{username}
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


  return(
    <main className="min-h-screen flex items-center justify-center bg-[#070B14] text-white px-6">

      <div className="bg-[#0F1624] p-8 rounded-2xl w-full max-w-md border border-gray-800">

        <h1 className="text-2xl font-bold mb-6 text-center">
          Daftar RafzHub
        </h1>

        <input
          placeholder="Username"
          className="w-full p-3 mb-4 rounded-lg bg-[#070B14] border border-gray-700"
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded-lg bg-[#070B14] border border-gray-700"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />


        {/* PASSWORD + SHOW */}
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
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-lg font-semibold disabled:opacity-40"
        >
          {loading?"Loading...":"Daftar"}
        </button>


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
