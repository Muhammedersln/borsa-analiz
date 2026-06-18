'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, ChevronRight, Copy, Check } from 'lucide-react';
import { Tool } from '@/lib/tools';
import { toolIcons } from '@/lib/icons';

interface Props {
  tool: Tool;
}

export default function AnalysisClient({ tool }: Props) {
  const Icon = toolIcons[tool.icon];
  const resultRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<Record<string, string>>(() =>
    Object.fromEntries(tool.fields.map((f) => [f.id, f.options?.[0] ?? '']))
  );
  const [result, setResult] = useState('');
  const [phase, setPhase] = useState<'idle' | 'fetching' | 'streaming' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Mobile: scroll to results when they appear
  useEffect(() => {
    if (phase === 'fetching' && resultRef.current) {
      const isMobile = window.innerWidth < 1024;
      if (isMobile) {
        setTimeout(() => {
          resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [phase]);

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
        err instanceof Error ? err.message : 'Bir hata oluştu. API anahtarınızı kontrol edin.'
      );
      setPhase('error');
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  const phaseLabel = {
    fetching: 'Piyasa verisi çekiliyor',
    streaming: 'Analiz ediliyor',
    done: 'Tamamlandı',
    error: 'Hata',
    idle: '',
  }[phase];

  const phaseDot = {
    fetching: 'bg-amber-400 animate-pulse',
    streaming: 'bg-sky-500 animate-pulse',
    done: 'bg-emerald-400',
    error: 'bg-red-400',
    idle: 'bg-slate-200',
  }[phase];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* ── Header ──────────────────────────────── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-13 sm:h-14 flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="flex items-center gap-1 sm:gap-1.5 text-slate-400 hover:text-slate-700 active:text-slate-900 transition-colors text-sm shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Araçlar</span>
          </Link>

          <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />

          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <div className={`w-6 h-6 ${tool.bgColor} rounded-md flex items-center justify-center shrink-0`}>
              {Icon && <Icon className={`w-3.5 h-3.5 ${tool.iconColor}`} strokeWidth={2} />}
            </div>
            <span className="text-sm font-semibold text-slate-900 truncate">{tool.title}</span>
          </div>
        </div>
      </header>

      {/* ── Main ────────────────────────────────── */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-5 sm:py-8 flex-1">
        <div className={`
          grid gap-4 sm:gap-6
          ${hasResult
            ? 'grid-cols-1 lg:grid-cols-[380px_1fr] xl:grid-cols-[420px_1fr]'
            : 'grid-cols-1 max-w-md mx-auto w-full'
          }
        `}>

          {/* ── Form panel ──────────────────────── */}
          <div className="space-y-4 sm:space-y-5">

            {/* Description */}
            <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 sm:py-3.5">
              <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed">
                {tool.description}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5">
              {tool.fields.map((field) => (
                <div key={field.id}>
                  <label className="block text-[10px] sm:text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                    {field.label}
                    {field.required && (
                      <span className="text-red-400 ml-0.5 normal-case font-normal"> *</span>
                    )}
                  </label>

                  {field.type === 'select' ? (
                    <select
                      value={formData[field.id] ?? ''}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 sm:px-3.5 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100 transition-colors"
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
                      rows={4}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 sm:px-3.5 py-3 text-sm text-slate-900 placeholder-slate-300 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100 resize-none transition-colors"
                    />
                  ) : (
                    <input
                      type="text"
                      value={formData[field.id] ?? ''}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 sm:px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-300 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100 transition-colors"
                    />
                  )}
                </div>
              ))}

              {/* Buttons */}
              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={!isFormValid || isBusy}
                  className="flex-1 bg-sky-700 hover:bg-sky-600 active:bg-sky-800 disabled:bg-slate-100 disabled:text-slate-300 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg transition-colors text-sm flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isBusy ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                      <span className="truncate">
                        {phase === 'fetching' ? 'Veri çekiliyor...' : 'Analiz ediliyor...'}
                      </span>
                    </>
                  ) : (
                    'Analizi Başlat'
                  )}
                </button>

                {(result || phase === 'error') && !isBusy && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 active:bg-slate-100 text-sm font-medium transition-colors cursor-pointer shrink-0"
                  >
                    Temizle
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* ── Result panel ────────────────────── */}
          {hasResult && (
            <div
              ref={resultRef}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col min-h-[300px] lg:min-h-0"
            >
              {/* Result header */}
              <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-slate-100 shrink-0">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${phaseDot}`} />
                  <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    {phaseLabel}
                  </span>
                </div>
                {phase === 'done' && result && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 transition-colors cursor-pointer shrink-0"
                  >
                    {copied ? (
                      <><Check className="w-3.5 h-3.5 text-emerald-500" /><span className="hidden sm:inline">Kopyalandı</span></>
                    ) : (
                      <><Copy className="w-3.5 h-3.5" /><span className="hidden sm:inline">Kopyala</span></>
                    )}
                  </button>
                )}
              </div>

              {/* Result content */}
              <div
                className="p-4 sm:p-5 overflow-y-auto flex-1"
                style={{ maxHeight: 'calc(100vh - 9rem)' }}
              >
                {phase === 'error' ? (
                  <div className="rounded-lg bg-red-50 border border-red-100 p-3.5 sm:p-4 text-sm text-red-700">
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
