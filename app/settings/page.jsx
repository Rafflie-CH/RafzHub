"use client"

import { useEffect, useRef, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function Settings() {
  const router = useRouter()
  const imgRef = useRef(null)
  const canvasRef = useRef(null)

  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState("")
  const [avatar, setAvatar] = useState("")
  const [password, setPassword] = useState("")
  const [uploading, setUploading] = useState(false)

  const [preview, setPreview] = useState(false)
  const [cropModal, setCropModal] = useState(false)
  const [rawImage, setRawImage] = useState(null)

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

  // 🔥 HANDLE FILE SELECT
  const handleFile = (file) => {
    if (!file.type.startsWith("image/")) {
      toast.error("File harus gambar 😹")
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setRawImage(reader.result)
      setCropModal(true)
    }
    reader.readAsDataURL(file)
  }

  // 🔥 CROP + RESIZE + COMPRESS
  const cropAndUpload = async () => {
    const img = imgRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    const size = 512 // final avatar size
    canvas.width = size
    canvas.height = size

    const min = Math.min(img.width, img.height)
    const sx = (img.width - min) / 2
    const sy = (img.height - min) / 2

    ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size)

    canvas.toBlob(
      async (blob) => {
        if (!blob) return

        setUploading(true)
        setCropModal(false)

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const fileName = `${user.id}.jpg`

        const { error } = await supabase.storage
          .from("avatars")
          .upload(fileName, blob, {
            upsert: true,
            contentType: "image/jpeg",
          })

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
      },
      "image/jpeg",
      0.75 // compress
    )
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
    <>
      <main className="min-h-screen bg-[#070B14] text-white flex justify-center py-20 px-6">
        <div className="w-full max-w-xl bg-[#0F1624] p-8 rounded-2xl border border-gray-800">

          <h1 className="text-3xl font-bold mb-8">⚙️ Settings</h1>

          {/* AVATAR */}
          <div className="flex flex-col items-center gap-4 mb-10">
            <div
              onClick={() => setPreview(true)}
              className="relative group cursor-pointer"
            >
              <img
                src={
                  avatar ||
                  `https://ui-avatars.com/api/?name=${username || "User"}&background=6366f1&color=fff&size=256`
                }
                className="w-28 h-28 rounded-full border border-gray-700 object-cover
                           group-hover:ring-4 group-hover:ring-indigo-500/50 transition"
              />
              <div className="absolute inset-0 bg-black/40 rounded-full
                              opacity-0 group-hover:opacity-100
                              flex items-center justify-center text-sm font-semibold transition">
                Preview
              </div>
            </div>

            {/* UPLOAD */}
            <label className="w-full">
              <div className="border border-gray-700 rounded-lg py-3 text-center
                              cursor-pointer hover:border-indigo-500 hover:bg-indigo-600/10 transition">
                📤 Upload Foto
              </div>
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => e.target.files && handleFile(e.target.files[0])}
              />
            </label>

            {/* URL */}
            <input
              placeholder="Atau paste URL foto..."
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#070B14] border border-gray-700"
            />

            {uploading && <p className="text-sm text-gray-400">Uploading...</p>}
          </div>

          {/* USERNAME */}
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 mb-6 rounded-lg bg-[#070B14] border border-gray-700"
          />

          <button
            onClick={updateProfile}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-lg mb-10"
          >
            Save Profile
          </button>

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Minimal 6 karakter"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 rounded-lg bg-[#070B14] border border-gray-700"
          />

          <button
            onClick={changePassword}
            className="w-full border border-indigo-500 text-indigo-400 py-3 rounded-lg"
          >
            Change Password
          </button>

          <button
            onClick={() => router.push("/dashboard")}
            className="mt-10 w-full border border-gray-700 py-3 rounded-lg hover:border-indigo-500"
          >
            ← Back to Dashboard
          </button>
        </div>
      </main>

      {/* PREVIEW */}
      {preview && (
        <div
          onClick={() => setPreview(false)}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
        >
          <img src={avatar} className="max-h-[80vh] rounded-xl" />
        </div>
      )}

      {/* CROP MODAL */}
      {cropModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-6">
          <div className="bg-[#0F1624] p-6 rounded-xl max-w-sm w-full text-center">
            <img ref={imgRef} src={rawImage} className="max-h-64 mx-auto mb-4" />
            <canvas ref={canvasRef} hidden />
            <button
              onClick={cropAndUpload}
              className="w-full bg-indigo-600 py-3 rounded-lg font-semibold"
            >
              Crop & Upload
            </button>
          </div>
        </div>
      )}
    </>
  )
}
