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

  // crop & preview
  const [cropOpen,setCropOpen] = useState(false)
  const [previewOpen,setPreviewOpen] = useState(false)
  const [rawImage,setRawImage] = useState(null)
  const [zoom,setZoom] = useState(1)
  const [pos,setPos] = useState({ x:0, y:0 })

  const dragging = useRef(false)
  const lastPos = useRef({ x:0, y:0 })
  const imgRef = useRef(null)

  // =============================
  // 🔥 AVATAR URL (FIX BENER)
  // =============================
  const getAvatarUrl = ()=>{
    if(!avatar){
      return `https://ui-avatars.com/api/?name=${username || "User"}&background=6366f1&color=fff&size=256`
    }
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${avatar}`
  }

  // =============================
  // 🔥 PROFILE (FIX OVERRIDE)
  // =============================
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
      .select("username, avatar_url")
      .eq("id", user.id)
      .single()

    if(!data){
      const uname = user.email.split("@")[0]

      await supabase.from("profiles").insert({
        id:user.id,
        email:user.email,
        username:uname,
        avatar_url:null
      })

      setUsername(uname)
      setAvatar("")
      return
    }

    // 🔥 FIX: JANGAN TIMPA STATE KALAU SUDAH ADA
    setUsername(prev => prev || data.username)
    setAvatar(data.avatar_url || "")
  }

  // =============================
  // 🔥 OPEN CROP
  // =============================
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

  // =============================
  // 🔥 APPLY CROP + SAVE KE DB
  // =============================
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

      sx = Math.max(0, Math.min(sx, img.naturalWidth - sSize))
      sy = Math.max(0, Math.min(sy, img.naturalHeight - sSize))

      ctx.drawImage(img, sx, sy, sSize, sSize, 0, 0, size, size)

      const blob = await new Promise(res=>{
        canvas.toBlob(b=>res(b),"image/jpeg",0.9)
      })

      const { data:{ user } } = await supabase.auth.getUser()
      const fileName = `${user.id}.jpg`

      await supabase.storage
        .from("avatars")
        .upload(fileName, blob, {
          upsert:true,
          contentType:"image/jpeg"
        })

      // 🔥 SIMPAN PATH KE DB
      await supabase
        .from("profiles")
        .update({ avatar_url:fileName })
        .eq("id", user.id)

      setAvatar(fileName)
      setCropOpen(false)
      toast.success("Foto berhasil diupload 🔥")

    }catch{
      toast.error("Gagal upload foto 😹")
    }finally{
      setUploading(false)
    }
  }

  // =============================
  // 🔥 DELETE AVATAR
  // =============================
  const deleteAvatar = async()=>{
    const { data:{ user } } = await supabase.auth.getUser()
    if(!user) return

    await supabase.storage.from("avatars").remove([`${user.id}.jpg`])
    await supabase.from("profiles")
      .update({ avatar_url:null })
      .eq("id",user.id)

    setAvatar("")
    toast.success("Foto dihapus 🔥")
  }

  // =============================
  // 🔥 DRAG (MOUSE + TOUCH)
  // =============================
  const startDrag=(x,y)=>{
    dragging.current=true
    lastPos.current={x,y}
  }

  const moveDrag=(x,y)=>{
    if(!dragging.current) return
    setPos(p=>({
      x:p.x+(x-lastPos.current.x),
      y:p.y+(y-lastPos.current.y)
    }))
    lastPos.current={x,y}
  }

  const stopDrag=()=>dragging.current=false

  // =============================
  // 🔥 UPDATE PROFILE
  // =============================
  const updateProfile = async()=>{
    setLoading(true)
    const load = toast.loading("Updating profile...")

    const { data:{ user } } = await supabase.auth.getUser()

    const { error } = await supabase
      .from("profiles")
      .update({ username, avatar_url:avatar })
      .eq("id",user.id)

    toast.dismiss(load)
    setLoading(false)

    if(error){
      toast.error("Gagal update profile 😹")
      return
    }

    toast.success("Profile updated 🔥")
  }

  // =============================
  // 🔥 CHANGE PASSWORD
  // =============================
  const changePassword = async()=>{
    if(password.length < 6){
      toast.error("Password minimal 6 karakter 😹")
      return
    }
    await supabase.auth.updateUser({ password })
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
            src={getAvatarUrl()}
            onClick={()=>setPreviewOpen(true)}
            className="w-28 h-28 rounded-full object-cover border border-gray-700 cursor-pointer"
          />

          <label className="w-full">
            <div className="flex justify-center py-3 border border-gray-700 rounded-lg cursor-pointer hover:border-indigo-500">
              📤 Upload Foto
            </div>
            <input type="file" accept="image/*" hidden
              onChange={e=>e.target.files?.[0] && openCrop(e.target.files[0])}/>
          </label>

          {avatar && (
            <button onClick={deleteAvatar}
              className="text-sm text-red-400 hover:underline">
              🗑 Hapus foto
            </button>
          )}

          {uploading && <p className="text-sm text-gray-400">Uploading...</p>}
        </div>

        {/* USERNAME */}
        <input
          value={username}
          onChange={e=>setUsername(e.target.value)}
          className="w-full p-3 rounded-lg bg-[#070B14] border border-gray-700 mb-6"
        />

        <button onClick={updateProfile}
          className="w-full bg-indigo-600 py-3 rounded-lg font-semibold mb-10">
          Save Profile
        </button>

        {/* PASSWORD */}
        <div className="border-t border-gray-800 pt-8">
          <input type="password" placeholder="Minimal 6 karakter"
            value={password}
            onChange={e=>setPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#070B14] border border-gray-700 mb-4"/>
          <button onClick={changePassword}
            className="w-full border border-indigo-500 text-indigo-400 py-3 rounded-lg">
            Change Password
          </button>
        </div>

        <button onClick={()=>router.push("/dashboard")}
          className="mt-10 w-full border border-gray-700 py-3 rounded-lg">
          ← Back to dashboard
        </button>

      </div>
    </main>

    {/* PREVIEW */}
    {previewOpen && (
      <div onClick={()=>setPreviewOpen(false)}
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
        <img src={getAvatarUrl()}
          className="max-w-[90vw] max-h-[80vh] rounded-xl"/>
      </div>
    )}

    {/* CROP */}
    {cropOpen && (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
        <div className="bg-[#0F1624] p-6 rounded-2xl">
          <div
            onMouseDown={e=>startDrag(e.clientX,e.clientY)}
            onMouseMove={e=>moveDrag(e.clientX,e.clientY)}
            onMouseUp={stopDrag}
            onTouchStart={e=>startDrag(e.touches[0].clientX,e.touches[0].clientY)}
            onTouchMove={e=>moveDrag(e.touches[0].clientX,e.touches[0].clientY)}
            onTouchEnd={stopDrag}
            className="relative w-64 h-64 overflow-hidden rounded-full border"
          >
            <img ref={imgRef} src={rawImage}
              className="absolute select-none"
              style={{transform:`translate(${pos.x}px,${pos.y}px) scale(${zoom})`}}/>
          </div>

          <input type="range" min="1" max="3" step="0.01"
            value={zoom} onChange={e=>setZoom(+e.target.value)}
            className="w-full mt-4"/>

          <button onClick={applyCrop}
            className="w-full mt-4 bg-indigo-600 py-2 rounded-lg">
            Apply
          </button>
        </div>
      </div>
    )}
    </>
  )
}
