import Link from 'next/link';
import { ChevronRight, LineChart } from 'lucide-react';
import { tools } from '@/lib/tools';
import { toolIcons } from '@/lib/icons';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Header ──────────────────────────────── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-sky-700 rounded-lg flex items-center justify-center">
              <LineChart className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-slate-900 text-sm tracking-tight">
              Borsa Analiz AI
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Claude ile çalışıyor
          </div>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pt-12 pb-8">
        <span className="inline-flex items-center gap-2 text-xs font-medium text-sky-700 bg-sky-50 border border-sky-100 px-3 py-1.5 rounded-full mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
          10 analiz aracı · Gerçek zamanlı Yahoo Finance verisi
        </span>
        <h1 className="text-[2.5rem] font-bold text-slate-900 leading-[1.15] tracking-tight mb-3">
          Borsa kararlarını
          <br />
          <span className="text-sky-700">AI ile güçlendir</span>
        </h1>
        <p className="text-slate-500 text-base max-w-lg leading-relaxed">
          Hisse araştırma, alım-satım kararı, risk analizi ve portföy planlaması — Claude ile Türkçe analiz.
        </p>
      </section>

      {/* ── Tools Grid ──────────────────────────── */}
      <main className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {tools.map((tool) => {
            const Icon = toolIcons[tool.icon];
            return (
              <Link key={tool.id} href={`/analiz/${tool.id}`} className="group block">
                <div className="bg-white rounded-xl border border-slate-200 p-5 h-full flex items-start gap-4 hover:border-sky-300 hover:shadow-sm transition-all duration-150">

                  {/* Icon */}
                  <div className={`w-9 h-9 ${tool.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    {Icon && <Icon className={`w-4.5 h-4.5 ${tool.iconColor}`} strokeWidth={2} />}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-sm font-semibold text-slate-900 mb-1">
                      {tool.title}
                    </h2>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {tool.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-sky-500 flex-shrink-0 mt-0.5 transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      {/* ── Footer ──────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-white py-5 text-center text-xs text-slate-400">
        Yatırım kararlarınızda güncel verileri ve uzman görüşlerini de değerlendirin.
      </footer>
    </div>
  );
}
