"use client"
export const dynamic = "force-dynamic"

import { useState,useEffect,useRef } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter,useSearchParams } from "next/navigation"
import { toast } from "sonner"

export default function Verify(){

  const router = useRouter()
  const params = useSearchParams()

  const email = params.get("email")

  const OTP_LENGTH = 6

  const [otp,setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""))
  const [cooldown,setCooldown] = useState(0)
  const [verifying,setVerifying] = useState(false)

  const inputs = useRef<(HTMLInputElement|null)[]>([])

  useEffect(()=>{
    if(!email) router.push("/register")
  },[email,router])


  useEffect(()=>{
    if(cooldown<=0) return
    const t=setInterval(()=>setCooldown(p=>p-1),1000)
    return()=>clearInterval(t)
  },[cooldown])



  useEffect(()=>{
    const code = otp.join("")
    if(code.length===OTP_LENGTH && !verifying){
      verify(code)
    }
  },[otp,verifying])



  const handleChange=(val:string,i:number)=>{

    if(!/^[0-9]?$/.test(val)) return

    const arr=[...otp]
    arr[i]=val
    setOtp(arr)

    if(val && i<OTP_LENGTH-1){
      inputs.current[i+1]?.focus()
    }
  }



  const handlePaste=(e:React.ClipboardEvent)=>{

    const paste = e.clipboardData
      .getData("text")
      .replace(/\D/g,"")
      .slice(0,OTP_LENGTH)

    if(!paste) return

    setOtp(paste.split(""))
  }



  const verify = async(code:string)=>{

    if(verifying) return
    setVerifying(true)

    const load = toast.loading("Memverifikasi...")

    const { error } = await supabase.auth.verifyOtp({
  email: email!,
  token: code,
  type:"signup" // ⭐⭐⭐ INI KUNCINYA
})

    toast.dismiss(load)

    if(error){
      toast.error("OTP salah / expired 😹")
      setOtp(Array(OTP_LENGTH).fill(""))
      inputs.current[0]?.focus()
      setVerifying(false)
      return
    }

    toast.success("Welcome to RafzHub 🔥")

    setTimeout(()=>{
      router.replace("/dashboard")
    },1000)
  }



  const resend = async()=>{

    if(cooldown>0) return

    const load = toast.loading("Mengirim OTP...")

    const { error } = await supabase.auth.resend({
      type:"signup",
      email: email!
    })

    toast.dismiss(load)

    if(error){
      toast.error("Gagal kirim ulang")
      return
    }

    toast.success("OTP baru dikirim 🚀")
    setCooldown(60)
  }



  return(
    <main className="min-h-screen flex items-center justify-center bg-[#070B14] text-white">

      <div className="bg-[#0F1624] p-8 rounded-2xl w-full max-w-md border border-gray-800">

        <h1 className="text-2xl font-bold mb-2 text-center">
          Verifikasi OTP
        </h1>

        <p className="text-gray-400 text-sm mb-8 text-center">
          Kode dikirim ke:<br/>
          <span className="text-indigo-400">{email}</span>
        </p>

        <div onPaste={handlePaste} className="flex justify-between gap-2 mb-6">
          {otp.map((d,i)=>(
            <input
              key={i}
              ref={(el)=>{inputs.current[i]=el}}
              maxLength={1}
              inputMode="numeric"
              autoComplete="one-time-code"
              value={d}
              onChange={(e)=>handleChange(e.target.value,i)}
              className="w-12 h-14 text-center text-xl font-bold rounded-lg bg-[#070B14] border border-gray-700"
            />
          ))}
        </div>

        <button
          onClick={resend}
          disabled={cooldown>0}
          className="w-full border border-indigo-500 text-indigo-400 py-3 rounded-lg font-semibold disabled:opacity-40"
        >
          {cooldown>0?`Kirim ulang dalam ${cooldown}s`:"Kirim ulang OTP"}
        </button>

      </div>
    </main>
  )
}
