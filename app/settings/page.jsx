"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function Settings() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState("")
  const [avatar, setAvatar] = useState("")
  const [password, setPassword] = useState("")
  const [uploading, setUploading] = useState(false)

  // 🔥 ambil profile
  useEffect(() => {
    getProfile()
  }, [])

  const getProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.replace("/login")
      return
    }

    const { data } = await supabase
      .from("profiles")
      .select("username, avatar_url")
      .eq("id", user.id)
      .single()

    setUsername(
      data?.username ||
      user.user_metadata?.username ||
      user.email?.split("@")[0] ||
      ""
    )

    setAvatar(data?.avatar_url || "")
  }

  // 🔥 UPLOAD AVATAR FILE
  const uploadAvatar = async (file: File) => {
    setUploading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const ext = file.name.split(".").pop()
    const fileName = `${user.id}.${ext}`

    const { error } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, { upsert: true })

    if (error) {
      toast.error("Gagal upload foto 😹")
      setUploading(false)
      return
    }

    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName)

    setAvatar(data.publicUrl)
    toast.success("Foto berhasil diupload 🔥")
    setUploading(false)
  }

  // 🔥 UPDATE PROFILE
  const updateProfile = async () => {
    setLoading(true)
    const load = toast.loading("Updating profile...")

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        username,
        avatar_url: avatar,
        email: user.email,
      })

    toast.dismiss(load)
    setLoading(false)

    if (error) {
      toast.error("Gagal update profile 😹")
      return
    }

    toast.success("Profile updated 🔥")
  }

  // 🔥 CHANGE PASSWORD
  const changePassword = async () => {
    if (password.length < 6) {
      toast.error("Password minimal 6 karakter 😹")
      return
    }

    const load = toast.loading("Updating password...")

    const { error } = await supabase.auth.updateUser({ password })

    toast.dismiss(load)

    if (error) {
      toast.error("Gagal ganti password")
      return
    }

    toast.success("Password berhasil diganti 🔥")
    setPassword("")
  }

  return (
    <main className="min-h-screen bg-[#070B14] text-white flex justify-center py-20 px-6">
      <div className="w-full max-w-xl bg-[#0F1624] p-8 rounded-2xl border border-gray-800">

        <h1 className="text-3xl font-bold mb-8">
          ⚙️ Settings
        </h1>

        {/* AVATAR */}
        <div className="flex flex-col items-center gap-4 mb-10">

          <img
            src={
              avatar ||
              `https://ui-avatars.com/api/?name=${username || "User"}&background=6366f1&color=fff&size=256`
            }
            className="w-28 h-28 rounded-full border border-gray-700 object-cover"
          />

          {/* UPLOAD FILE */}
          <label className="text-sm text-gray-400 cursor-pointer">
            Upload foto
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  uploadAvatar(e.target.files[0])
                }
              }}
            />
          </label>

          {/* URL INPUT */}
          <input
            placeholder="Atau paste URL foto..."
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#070B14] border border-gray-700"
          />

          {uploading && (
            <p className="text-sm text-gray-400">
              Uploading...
            </p>
          )}
        </div>

        {/* USERNAME */}
        <div className="mb-6">
          <label className="text-sm text-gray-400">
            Username
          </label>

          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 mt-1 rounded-lg bg-[#070B14] border border-gray-700"
          />
        </div>

        <button
          onClick={updateProfile}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-lg font-semibold mb-10 disabled:opacity-50"
        >
          Save Profile
        </button>

        {/* PASSWORD */}
        <div className="border-t border-gray-800 pt-8">
          <label className="text-sm text-gray-400">
            New Password
          </label>

          <input
            type="password"
            placeholder="Minimal 6 karakter"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mt-1 rounded-lg bg-[#070B14] border border-gray-700 mb-4"
          />

          <button
            onClick={changePassword}
            className="w-full border border-indigo-500 text-indigo-400 hover:bg-indigo-600/20 py-3 rounded-lg font-semibold"
          >
            Change Password
          </button>
        </div>

        {/* BACK */}
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-10 text-gray-400 hover:text-indigo-400"
        >
          ← Back to dashboard
        </button>

      </div>
    </main>
  )
}
