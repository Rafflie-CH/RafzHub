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
  username: string
  avatar?: string | null
  role?: string | null
}) {

  const [open, setOpen] = useState(false)
  const router = useRouter()

  const logout = async () => {
    const load = toast.loading("Keluar...")

    await supabase.auth.signOut()

    toast.dismiss(load)
    toast.success("Logout berhasil 🔥")

    router.replace("/login")
    router.refresh()
  }

  return (
    <div className="relative">
      <img
        onClick={() => setOpen(!open)}
        src={
          avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            username || "User"
          )}&background=6366f1&color=fff&size=256`
        }
        className="w-10 h-10 rounded-full cursor-pointer border border-gray-700"
      />

      {open && (
        <div className="absolute right-0 mt-3 w-52 bg-[#0F1624] border border-gray-800 rounded-xl shadow-lg z-50">

          {/* USER INFO */}
          <div className="px-4 py-3 border-b border-gray-800">
            <p className="font-semibold">{username || "User"}</p>
            <p
              className={`text-xs font-bold ${
                role === "admin"
                  ? "text-green-400"
                  : "text-blue-400"
              }`}
            >
              {(role || "member").toUpperCase()}
            </p>
          </div>

          {/* SETTINGS */}
          <button
            onClick={() => {
              setOpen(false)
              router.push("/settings")
            }}
            className="w-full text-left px-4 py-3 hover:bg-indigo-600/20"
          >
            ⚙️ Settings
          </button>

          {/* LOGOUT */}
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
