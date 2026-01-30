"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function ProfileMenu({
  username,
  avatar,
  role
}:{
  username:string
  avatar?:string
  role?:string
}){

  const [open,setOpen]=useState(false)
  const router = useRouter()

  const logout = async()=>{

    const load = toast.loading("Keluar...")

    await supabase.auth.signOut()

    toast.dismiss(load)
    toast.success("Logout berhasil 🔥")

    router.replace("/login")
    router.refresh()
  }

  return(
    <div className="relative">

      <img
        onClick={()=>setOpen(!open)}
        src={avatar || "https://i.pravatar.cc/40"}
        className="w-10 h-10 rounded-full cursor-pointer border border-gray-700"
      />

      {open && (
        <div className="absolute right-0 mt-3 w-52 bg-[#0F1624] border border-gray-800 rounded-xl shadow-lg">

          <div className="px-4 py-3 border-b border-gray-800">
            <p className="font-semibold">{username}</p>
            <p className="text-xs text-indigo-400">{role}</p>
          </div>

          <button
            onClick={()=>router.push("/settings")}
            className="w-full text-left px-4 py-3 hover:bg-indigo-600/20"
          >
            ⚙️ Settings
          </button>

          <button
            onClick={logout}
            className="w-full text-left px-4 py-3 hover:bg-red-600/20 text-red-400"
          >
            Logout
          </button>

        </div>
      )}
    </div>
  )
}
