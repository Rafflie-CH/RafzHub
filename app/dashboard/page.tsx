export const dynamic = "force-dynamic"
export default function Home() {
  return (
    <main className="min-h-screen bg-[#070B14] text-white">

      {/* NAVBAR */}
      <header className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
        <h1 className="text-2xl font-bold tracking-tight">
          RafzHub
        </h1>

        <nav className="flex gap-6 text-sm">
          <a href="#features" className="hover:text-indigo-400 transition">Fitur</a>
          <a href="#pricing" className="hover:text-indigo-400 transition">Produk</a>
          <a href="#contact" className="hover:text-indigo-400 transition">Kontak</a>
        </nav>
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
        ].map((item) => (
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

      {/* PRICING / PRODUK */}
      <section id="pricing" className="py-24 border-t border-gray-800 text-center">

        <h2 className="text-4xl font-bold mb-14">
          Produk RafzHub
        </h2>

        <div className="flex flex-wrap justify-center gap-8 px-6">

          {/* PANEL */}
          <div className="bg-[#0F1624] p-8 rounded-2xl w-[300px] border border-gray-800">
            <h3 className="text-2xl font-semibold mb-3">Panel</h3>

            <p className="text-gray-400 mb-6">
              Hosting bot stabil dengan sistem coin fleksibel.
            </p>

            <button className="bg-indigo-600 w-full py-3 rounded-xl font-semibold hover:bg-indigo-500 transition">
              Lihat Paket
            </button>
          </div>

          {/* JADIBOT */}
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

      {/* DEVELOPER */}
      <section className="text-center py-24 border-t border-gray-800">
        <h2 className="text-3xl font-bold mb-4">
          Developer
        </h2>

        <p className="text-gray-400 mb-6">
          Rafz — Founder & Developer RafzHub
        </p>

        <a
          href="https://wa.me/6281521902652"
          target="_blank"
          className="inline-block bg-green-600 hover:bg-green-500 px-7 py-3 rounded-xl font-semibold transition"
        >
          Chat Developer
        </a>
      </section>

      {/* CONTACT */}
      <section id="contact" className="text-center py-24 border-t border-gray-800">
        <h2 className="text-3xl font-bold mb-4">
          Butuh Bantuan?
        </h2>

        <p className="text-gray-400 mb-8">
          Hubungi owner atau developer kapan saja.
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <a
            href="https://wa.me/6285829658816"
            target="_blank"
            className="bg-indigo-600 hover:bg-indigo-500 px-7 py-3 rounded-xl font-semibold transition"
          >
            Chat Owner
          </a>

          <a
            href="https://wa.me/6281521902652"
            target="_blank"
            className="border border-gray-700 hover:border-indigo-500 px-7 py-3 rounded-xl transition"
          >
            Chat Developer
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-10 border-t border-gray-800 text-gray-500">
        © 2026 RafzHub — Built for future automation 🚀
      </footer>

    </main>
  );
          }
