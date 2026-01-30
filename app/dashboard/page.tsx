import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import ProfileMenu from "./ProfileMenu"

export const dynamic = "force-dynamic"

export default async function Home() {

  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies:{
        get(name:string){
          return cookieStore.get(name)?.value
        }
      }
    }
  )

  const {
    data:{ user }
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
  .from("profiles")
  .select("role, username, avatar_url")
  .eq("id", user.id)
  .single()

  if(!user) redirect("/login")

  const { data:profile } = await supabase
    .from("profiles")
    .select("username, avatar_url, role")
    .eq("id",user.id)
    .single()

  return(
    <main className="min-h-screen bg-[#070B14] text-white">

      {/* NAVBAR */}
      <header className="flex items-center justify-between px-6 py-5 border-b border-gray-800">

        <h1 className="text-2xl font-bold tracking-tight">
          RafzHub
        </h1>

        <div className="flex items-center gap-6">

          <div className="flex items-center gap-6">

  <nav className="flex gap-6 text-sm">
    <a href="#features" className="hover:text-indigo-400 transition">Fitur</a>
    <a href="#pricing" className="hover:text-indigo-400 transition">Produk</a>
    <a href="#contact" className="hover:text-indigo-400 transition">Kontak</a>
  </nav>

  <a href="/settings" className="flex items-center gap-3">
    <img
      src={profile?.avatar_url || "/default-avatar.png"}
      className="w-10 h-10 rounded-full border border-gray-700"
    />

    <div className="flex flex-col text-left">
      <span className="text-sm font-semibold">
        {profile?.username || "User"}
      </span>

      <span
        className={`text-xs font-bold ${
          profile?.role === "admin"
            ? "text-green-400"
            : "text-blue-400"
        }`}
      >
        {profile?.role?.toUpperCase()}
      </span>
    </div>
  </a>

</div>
            <a href="#features" className="hover:text-indigo-400 transition">Fitur</a>
            <a href="#pricing" className="hover:text-indigo-400 transition">Produk</a>
            <a href="#contact" className="hover:text-indigo-400 transition">Kontak</a>
          </nav>

          <ProfileMenu
            username={profile?.username || "User"}
            avatar={profile?.avatar_url}
            role={profile?.role}
          />

        </div>
      </header>

      {/* HERO */}
      <section className="text-center py-28 px-6">
        <h2 className="text-5xl font-bold mb-6 leading-tight">
          Platform Bot & Panel  
          <span className="text-indigo-500"> Modern</span>
        </h2>

        <p className="text-gray-400 max-w-2xl mx-auto mb-10">
          RafzHub adalah platform bot WhatsApp dan panel hosting dengan sistem coin fleksibel,
          performa cepat, dan kontrol penuh untuk kebutuhan automation kamu.
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <button className="bg-indigo-600 hover:bg-indigo-500 px-7 py-3 rounded-xl font-semibold transition">
            Mulai Sekarang
          </button>

          <button className="border border-gray-700 hover:border-indigo-500 px-7 py-3 rounded-xl transition">
            Lihat Produk
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="px-6 py-20 max-w-6xl mx-auto grid md:grid-cols-3 gap-7"
      >
        {[
          {
            title: "Panel Hosting",
            desc: "Kelola bot dengan panel modern, resource stabil, dan uptime tinggi."
          },
          {
            title: "JadiBot Instan",
            desc: "Jalankan bot WhatsApp tanpa setup server. Tinggal pakai."
          },
          {
            title: "Script Premium",
            desc: "Beli sekali, pakai selamanya. Siap deploy ke panel kamu."
          }
        ].map((item)=>(
          <div
            key={item.title}
            className="bg-[#0F1624] p-7 rounded-2xl border border-gray-800 hover:border-indigo-500 transition hover:scale-[1.02]"
          >
            <h3 className="text-xl font-semibold mb-3">
              {item.title}
            </h3>

            <p className="text-gray-400">
              {item.desc}
            </p>
          </div>
        ))}
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 border-t border-gray-800 text-center">

        <h2 className="text-4xl font-bold mb-14">
          Produk RafzHub
        </h2>

        <div className="flex flex-wrap justify-center gap-8 px-6">

          <div className="bg-[#0F1624] p-8 rounded-2xl w-[300px] border border-gray-800">
            <h3 className="text-2xl font-semibold mb-3">Panel</h3>

            <p className="text-gray-400 mb-6">
              Hosting bot stabil dengan sistem coin fleksibel.
            </p>

            <button className="bg-indigo-600 w-full py-3 rounded-xl font-semibold hover:bg-indigo-500 transition">
              Lihat Paket
            </button>
          </div>

          <div className="bg-[#0F1624] p-8 rounded-2xl w-[300px] border border-gray-800">
            <h3 className="text-2xl font-semibold mb-3">JadiBot</h3>

            <p className="text-gray-400 mb-6">
              Jalankan bot tanpa server. Cocok untuk pemula.
            </p>

            <button className="bg-indigo-600 w-full py-3 rounded-xl font-semibold hover:bg-indigo-500 transition">
              Mulai Bot
            </button>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-10 border-t border-gray-800 text-gray-500">
        © 2026 RafzHub — Built for future automation 🚀
      </footer>

    </main>
  )
}
