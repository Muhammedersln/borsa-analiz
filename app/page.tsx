import Link from 'next/link';
import { tools } from '@/lib/tools';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Header ──────────────────────────────── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-sky-700 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
            </div>
            <span className="font-semibold text-slate-900 tracking-tight">Borsa Analiz AI</span>
          </div>
          <span className="text-xs text-slate-400 hidden sm:flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            Claude ile çalışıyor
          </span>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-14 pb-10">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 bg-sky-50 border border-sky-100 text-sky-700 text-xs font-medium px-3 py-1.5 rounded-full mb-5">
            <span>10 analiz aracı</span>
            <span className="text-sky-300">•</span>
            <span>Gerçek zamanlı AI yanıtı</span>
          </div>
          <h1 className="text-4xl sm:text-[2.75rem] font-bold text-slate-900 leading-[1.15] tracking-tight mb-4">
            Borsa kararlarını
            <br />
            <span className="text-sky-700">AI ile güçlendir</span>
          </h1>
          <p className="text-slate-500 text-base leading-relaxed">
            Hisse araştırma, alım-satım kararı, risk analizi ve portföy planlaması —
            hepsi tek yerde, Claude ile Türkçe analiz.
          </p>
        </div>
      </section>

      {/* ── Tool Grid ───────────────────────────── */}
      <main className="max-w-6xl mx-auto px-5 sm:px-8 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {tools.map((tool, i) => (
            <Link key={tool.id} href={`/analiz/${tool.id}`} className="group block">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 h-full flex gap-4 hover:border-sky-300 hover:shadow-[0_4px_20px_rgba(3,105,161,0.08)] transition-all duration-200">

                {/* Icon circle */}
                <div className={`w-10 h-10 ${tool.bgColor} rounded-xl flex items-center justify-center text-lg flex-shrink-0 mt-0.5`}>
                  {tool.icon}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-mono text-slate-300 tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h2 className="text-sm font-semibold text-slate-900 leading-snug">
                      {tool.title}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {tool.description}
                  </p>
                  <span className={`mt-3 inline-flex items-center gap-1 text-xs font-semibold ${tool.color}`}>
                    Analizi başlat
                    <span className="group-hover:translate-x-0.5 transition-transform duration-150">→</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* ── Footer ──────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-white py-5 text-center text-xs text-slate-400">
        Bu araç yatırım tavsiyesi vermez. Kararlarınızı vermeden önce güncel verileri ve uzman görüşlerini değerlendirin.
      </footer>
    </div>
  );
}
