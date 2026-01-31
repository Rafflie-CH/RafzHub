"use client"

import { useEffect, useRef, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function Settings(){

  const router = useRouter()

  const [loading,setLoading] = useState(false)
  const [uploading,setUploading] = useState(false)
  const [username,setUsername] = useState("")
  const [avatar,setAvatar] = useState("")
  const [password,setPassword] = useState("")

  // crop state
  const [cropOpen,setCropOpen] = useState(false)
  const [rawImage,setRawImage] = useState(null)
  const [zoom,setZoom] = useState(1)
  const [pos,setPos] = useState({ x:0, y:0 })

  const dragging = useRef(false)
  const lastPos = useRef({ x:0, y:0 })
  const imgRef = useRef(null)

  // 🔥 ambil profile
  useEffect(()=>{
    getProfile()
  },[])

  const getProfile = async()=>{
    const { data:{ user } } = await supabase.auth.getUser()

    if(!user){
      router.replace("/login")
      return
    }

    const { data } = await supabase
      .from("profiles")
      .select("username,avatar_url")
      .eq("id",user.id)
      .single()

    if(data){
      setUsername(
        data.username ||
        user.user_metadata?.username ||
        user.email?.split("@")[0] ||
        ""
      )
      setAvatar(data.avatar_url || "")
    }
  }

  // 🔥 open crop
  const openCrop = (file)=>{
    if(!file.type.startsWith("image/")){
      toast.error("File harus gambar 😹")
      return
    }

    setRawImage(URL.createObjectURL(file))
    setZoom(1)
    setPos({x:0,y:0})
    setCropOpen(true)
  }

  // 🔥 apply crop + resize (FIXED)
  const applyCrop = async()=>{
    try{
      setUploading(true)

      const img = imgRef.current
      const size = 512

      const canvas = document.createElement("canvas")
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext("2d")

      const scale = img.naturalWidth / img.clientWidth

      const cropSize = img.clientWidth / zoom
      let sx = (-pos.x + img.clientWidth/2 - cropSize/2) * scale
      let sy = (-pos.y + img.clientHeight/2 - cropSize/2) * scale
      let sSize = cropSize * scale

      // clamp biar ga keluar gambar
      sx = Math.max(0, Math.min(sx, img.naturalWidth - sSize))
      sy = Math.max(0, Math.min(sy, img.naturalHeight - sSize))

      ctx.drawImage(
        img,
        sx,
        sy,
        sSize,
        sSize,
        0,
        0,
        size,
        size
      )

      const blob = await new Promise(res=>{
        canvas.toBlob(b=>res(b),"image/jpeg",0.85)
      })

      const { data:{ user } } = await supabase.auth.getUser()
      if(!user) return

      const fileName = `${user.id}.jpg`

      const { error } = await supabase.storage
        .from("avatars")
        .upload(fileName, blob, {
          upsert:true,
          contentType:"image/jpeg"
        })

      if(error) throw error

      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName)

      setAvatar(data.publicUrl)
      toast.success("Foto berhasil diupload 🔥")
      setCropOpen(false)

    }catch{
      toast.error("Gagal upload foto 😹")
    }finally{
      setUploading(false)
    }
  }

  // drag handlers
  const onDown = (e)=>{
    dragging.current = true
    lastPos.current = { x:e.clientX, y:e.clientY }
  }

  const onMove = (e)=>{
    if(!dragging.current) return
    setPos(p=>({
      x: p.x + (e.clientX - lastPos.current.x),
      y: p.y + (e.clientY - lastPos.current.y)
    }))
    lastPos.current = { x:e.clientX, y:e.clientY }
  }

  const onUp = ()=> dragging.current = false

  // 🔥 UPDATE PROFILE
  const updateProfile = async()=>{
    setLoading(true)
    const load = toast.loading("Updating profile...")

    const { data:{ user } } = await supabase.auth.getUser()

    const { error } = await supabase
      .from("profiles")
      .update({
        username,
        avatar_url: avatar
      })
      .eq("id",user?.id)

    toast.dismiss(load)
    setLoading(false)

    if(error){
      toast.error("Gagal update profile 😹")
      return
    }

    toast.success("Profile updated 🔥")
  }

  // 🔥 CHANGE PASSWORD
  const changePassword = async()=>{
    if(password.length < 6){
      toast.error("Password minimal 6 karakter 😹")
      return
    }

    const load = toast.loading("Updating password...")

    const { error } = await supabase.auth.updateUser({ password })

    toast.dismiss(load)

    if(error){
      toast.error("Gagal ganti password")
      return
    }

    toast.success("Password berhasil diganti 🔥")
    setPassword("")
  }

  return(
    <>
    <main className="min-h-screen bg-[#070B14] text-white flex justify-center py-20 px-6">
      <div className="w-full max-w-xl bg-[#0F1624] p-8 rounded-2xl border border-gray-800">

        <h1 className="text-3xl font-bold mb-8">⚙️ Settings</h1>

        {/* AVATAR */}
        <div className="flex flex-col items-center gap-4 mb-10">

          <img
            src={
              avatar?.startsWith("http")
                ? avatar
                : `https://ui-avatars.com/api/?name=${username || "User"}&background=6366f1&color=fff&size=256`
            }
            onError={(e)=>{
              e.currentTarget.src =
                `https://ui-avatars.com/api/?name=${username || "User"}&background=6366f1&color=fff&size=256`
            }}
            className="w-28 h-28 rounded-full object-cover border border-gray-700 bg-[#1f2937]"
          />

          <label className="w-full">
            <div className="flex justify-center py-3 border border-gray-700
                            rounded-lg cursor-pointer hover:border-indigo-500">
              📤 Upload Foto
            </div>
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e)=>e.target.files?.[0] && openCrop(e.target.files[0])}
            />
          </label>

          <input
            placeholder="Paste URL foto..."
            value={avatar}
            onChange={(e)=>setAvatar(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#070B14] border border-gray-700"
          />

          {uploading && <p className="text-sm text-gray-400">Uploading...</p>}
        </div>

        {/* USERNAME */}
        <div className="mb-6">
          <label className="text-sm text-gray-400">Username</label>
          <input
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
            className="w-full p-3 mt-1 rounded-lg bg-[#070B14] border border-gray-700"
          />
        </div>

        <button
          onClick={updateProfile}
          disabled={loading}
          className="w-full bg-indigo-600 py-3 rounded-lg font-semibold mb-10"
        >
          Save Profile
        </button>

        {/* PASSWORD */}
        <div className="border-t border-gray-800 pt-8">
          <label className="text-sm text-gray-400">New Password</label>
          <input
            type="password"
            placeholder="Minimal 6 karakter"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="w-full p-3 mt-1 rounded-lg bg-[#070B14] border border-gray-700 mb-4"
          />

          <button
            onClick={changePassword}
            className="w-full border border-indigo-500 text-indigo-400 py-3 rounded-lg"
          >
            Change Password
          </button>
        </div>

        <button
          onClick={()=>router.push("/dashboard")}
          className="mt-10 w-full border border-gray-700 py-3 rounded-lg"
        >
          ← Back to dashboard
        </button>

      </div>
    </main>

    {/* CROP MODAL */}
    {cropOpen && (
      <div
        onMouseMove={onMove}
        onMouseUp={onUp}
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-6"
      >
        <div className="bg-[#0F1624] p-6 rounded-2xl w-full max-w-sm">

          <div
            onMouseDown={onDown}
            className="relative w-64 h-64 mx-auto overflow-hidden
                       rounded-full border cursor-grab active:cursor-grabbing"
          >
            <img
              ref={imgRef}
              src={rawImage}
              draggable={false}
              className="absolute top-0 left-0 select-none"
              style={{
                transform:`translate(${pos.x}px,${pos.y}px) scale(${zoom})`
              }}
            />
          </div>

          <input
            type="range"
            min="1"
            max="3"
            step="0.01"
            value={zoom}
            onChange={(e)=>setZoom(+e.target.value)}
            className="w-full mt-4"
          />

          <div className="flex gap-3 mt-6">
            <button
              onClick={()=>setCropOpen(false)}
              className="flex-1 border border-gray-700 py-2 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={applyCrop}
              className="flex-1 bg-indigo-600 py-2 rounded-lg"
            >
              Apply
            </button>
          </div>

        </div>
      </div>
    )}
    </>
  )
}
