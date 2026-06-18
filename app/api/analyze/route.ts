import Anthropic from '@anthropic-ai/sdk';
import { buildPrompt } from '@/lib/prompts';
import {
  fetchStockData,
  fetchHistoricalData,
  formatStockData,
  formatHistoricalData,
  formatMultipleStocks,
} from '@/lib/stockData';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Sen deneyimli bir borsa ve yatırım analistisin. Tüm analizlerini Türkçe olarak yap.
Net başlıklar (## ve ### formatında), maddeli listeler ve tablolar kullan.
Anlaşılır, akıcı bir dil kullan. Teknik terimleri parantez içinde Türkçe açıklamalarla destekle.
Önemli verileri **kalın** yaz. Her analizin sonuna kısa bir özet ekle.
Sana verilen gerçek zamanlı verileri mutlaka kullan ve analizinde referans ver.`;

async function buildContextData(toolId: string, params: Record<string, string>): Promise<string> {
  try {
    switch (toolId) {
      case 'arastirma':
      case 'alim':
      case 'satim':
      case 'risk':
      case 'uzun-vade':
      case 'kazanc': {
        const data = await fetchStockData(params.ticker);
        return data ? formatStockData(data) : '';
      }

      case 'teknik': {
        const [data, history] = await Promise.all([
          fetchStockData(params.ticker),
          fetchHistoricalData(params.ticker, 45),
        ]);
        let ctx = '';
        if (data) ctx += formatStockData(data, false);
        if (history.length) ctx += formatHistoricalData(history, params.ticker);
        return ctx;
      }

      case 'karsilastirma': {
        const [d1, d2, d3] = await Promise.all([
          fetchStockData(params.stock1),
          fetchStockData(params.stock2),
          fetchStockData(params.stock3),
        ]);
        const stocks = [d1, d2, d3].filter(Boolean) as Awaited<ReturnType<typeof fetchStockData>>[];
        return stocks.length ? formatMultipleStocks(stocks as Parameters<typeof formatMultipleStocks>[0]) : '';
      }

      case 'portfoy': {
        const tickers = params.stocks.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 8);
        const results = await Promise.all(tickers.map(fetchStockData));
        const stocks = results.filter(Boolean) as Awaited<ReturnType<typeof fetchStockData>>[];
        return stocks.length ? formatMultipleStocks(stocks as Parameters<typeof formatMultipleStocks>[0]) : '';
      }

      default:
        return '';
    }
  } catch {
    return '';
  }
}

export async function POST(request: Request) {
  try {
    const { toolId, params } = await request.json();

    const [prompt, contextData] = await Promise.all([
      Promise.resolve(buildPrompt(toolId, params)),
      buildContextData(toolId, params),
    ]);

    if (!prompt) return new Response('Geçersiz araç', { status: 400 });

    const fullPrompt = contextData
      ? `${contextData}\n\nYukarıdaki gerçek zamanlı verileri kullanarak şu analizi yap:\n\n${prompt}`
      : prompt;

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          const stream = anthropic.messages.stream({
            model: 'claude-sonnet-4-6',
            max_tokens: 4096,
            system: SYSTEM_PROMPT,
            messages: [{ role: 'user', content: fullPrompt }],
          });

          for await (const event of stream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });
  } catch {
    return new Response('Sunucu hatası', { status: 500 });
  }
}
