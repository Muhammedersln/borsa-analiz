'use client';

import { useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Tool } from '@/lib/tools';

interface Props {
  tool: Tool;
}

export default function AnalysisClient({ tool }: Props) {
  const [formData, setFormData] = useState<Record<string, string>>(() =>
    Object.fromEntries(tool.fields.map((f) => [f.id, f.options?.[0] ?? '']))
  );
  const [result, setResult] = useState('');
  const [phase, setPhase] = useState<'idle' | 'fetching' | 'streaming' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult('');
    setError('');
    setPhase('fetching');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId: tool.id, params: formData }),
      });

      if (!response.ok) throw new Error(`Hata: ${response.status}`);

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let firstChunk = true;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (firstChunk) { setPhase('streaming'); firstChunk = false; }
        setResult((prev) => prev + decoder.decode(value, { stream: true }));
      }
      setPhase('done');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Bir hata oluştu. API anahtarınızı ve bağlantınızı kontrol edin.'
      );
      setPhase('error');
    }
  };

  const handleReset = () => {
    setResult('');
    setError('');
    setPhase('idle');
  };

  const isFormValid = tool.fields
    .filter((f) => f.required)
    .every((f) => formData[f.id]?.trim());

  const isBusy = phase === 'fetching' || phase === 'streaming';
  const hasResult = result || isBusy || phase === 'error';

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Header ──────────────────────────────── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-14 flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-slate-400 hover:text-slate-700 transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="hidden sm:inline">Araçlar</span>
          </Link>
          <div className="w-px h-4 bg-slate-200" />
          <div className="flex items-center gap-2">
            <span className={`w-7 h-7 ${tool.bgColor} rounded-lg flex items-center justify-center text-base`}>
              {tool.icon}
            </span>
            <span className="font-semibold text-slate-900 text-sm">{tool.title}</span>
          </div>
        </div>
      </header>

      {/* ── Main ────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-5 sm:px-8 py-8">
        <div className={`grid gap-6 ${hasResult ? 'lg:grid-cols-[420px_1fr]' : 'max-w-md'}`}>

          {/* ── Form panel ──────────────────────── */}
          <div className="space-y-5">
            {/* Description card */}
            <div className={`${tool.bgColor} border border-slate-200 rounded-xl px-4 py-3`}>
              <p className="text-xs text-slate-600 leading-relaxed">{tool.description}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {tool.fields.map((field) => (
                <div key={field.id}>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                    {field.label}
                    {field.required && <span className="text-red-400 ml-0.5 normal-case">*</span>}
                  </label>

                  {field.type === 'select' ? (
                    <select
                      value={formData[field.id] ?? ''}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100 transition-colors"
                    >
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      value={formData[field.id] ?? ''}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      rows={6}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 placeholder-slate-300 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100 resize-none transition-colors"
                    />
                  ) : (
                    <input
                      type="text"
                      value={formData[field.id] ?? ''}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-300 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100 transition-colors"
                    />
                  )}
                </div>
              ))}

              {/* Buttons */}
              <div className="flex gap-2.5 pt-1">
                <button
                  type="submit"
                  disabled={!isFormValid || isBusy}
                  className="flex-1 bg-sky-700 hover:bg-sky-600 disabled:bg-slate-100 disabled:text-slate-300 text-white font-semibold py-2.5 px-5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
                >
                  {phase === 'fetching' ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Veri çekiliyor...
                    </>
                  ) : phase === 'streaming' ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analiz ediliyor...
                    </>
                  ) : (
                    'Analizi Başlat'
                  )}
                </button>

                {(result || phase === 'error') && !isBusy && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 text-sm font-medium transition-colors"
                  >
                    Temizle
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* ── Result panel ────────────────────── */}
          {hasResult && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              {/* Result header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    phase === 'fetching' ? 'bg-amber-400 animate-pulse' :
                    phase === 'streaming' ? 'bg-sky-500 animate-pulse' :
                    phase === 'done' ? 'bg-emerald-400' : 'bg-red-400'
                  }`} />
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    {phase === 'fetching' ? 'Piyasa verisi çekiliyor' :
                     phase === 'streaming' ? 'Analiz ediliyor' :
                     phase === 'done' ? 'Analiz tamamlandı' : 'Hata'}
                  </span>
                </div>
                {phase === 'done' && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(result);
                    }}
                    className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    Kopyala
                  </button>
                )}
              </div>

              {/* Content */}
              <div className="p-5 max-h-[calc(100vh-12rem)] overflow-y-auto">
                {error ? (
                  <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-sm text-red-700">
                    {error}
                  </div>
                ) : (
                  <div className={`prose max-w-none text-sm ${phase === 'streaming' ? 'cursor-blink' : ''}`}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {result}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
