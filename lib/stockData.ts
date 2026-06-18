import yahooFinance from 'yahoo-finance2';

export interface StockData {
  ticker: string;
  currency: string | null;
  // Price
  price: number | null;
  change: number | null;
  changePercent: number | null;
  week52High: number | null;
  week52Low: number | null;
  marketCap: number | null;
  volume: number | null;
  avgVolume: number | null;
  // Valuation
  pe: number | null;
  forwardPe: number | null;
  priceToBook: number | null;
  eps: number | null;
  beta: number | null;
  targetPrice: number | null;
  analystRating: string | null;
  // Financials
  totalRevenue: number | null;
  netIncome: number | null;
  grossMargins: number | null;
  operatingMargins: number | null;
  profitMargins: number | null;
  revenueGrowth: number | null;
  earningsGrowth: number | null;
  totalDebt: number | null;
  freeCashflow: number | null;
  returnOnEquity: number | null;
  // Company
  sector: string | null;
  industry: string | null;
  country: string | null;
  employees: number | null;
  description: string | null;
  // Earnings
  lastEarningsDate: string | null;
  nextEarningsDate: string | null;
}

export interface HistoricalBar {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export async function fetchStockData(ticker: string): Promise<StockData | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let q: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let s: any = null;

  try { q = await yahooFinance.quote(ticker); } catch { /* ignore */ }
  try {
    s = await yahooFinance.quoteSummary(ticker, {
      modules: ['summaryProfile', 'financialData', 'defaultKeyStatistics', 'calendarEvents'],
    });
  } catch { /* ignore */ }

  try {
    if (!q && !s) return null;

    const fin = s?.financialData;
    const stat = s?.defaultKeyStatistics;
    const prof = s?.summaryProfile;
    const cal = s?.calendarEvents;

    return {
      ticker: ticker.toUpperCase(),
      currency: q?.currency ?? null,
      price: q?.regularMarketPrice ?? null,
      change: q?.regularMarketChange ?? null,
      changePercent: q?.regularMarketChangePercent ?? null,
      week52High: q?.fiftyTwoWeekHigh ?? null,
      week52Low: q?.fiftyTwoWeekLow ?? null,
      marketCap: q?.marketCap ?? null,
      volume: q?.regularMarketVolume ?? null,
      avgVolume: q?.averageDailyVolume3Month ?? null,
      pe: (q?.trailingPE ?? stat?.trailingPE) ?? null,
      forwardPe: (q?.forwardPE ?? stat?.forwardPE) ?? null,
      priceToBook: stat?.priceToBook ?? null,
      eps: q?.epsTrailingTwelveMonths ?? null,
      beta: stat?.beta ?? null,
      targetPrice: fin?.targetMeanPrice ?? null,
      analystRating: fin?.recommendationKey ?? null,
      totalRevenue: fin?.totalRevenue ?? null,
      netIncome: fin?.netIncomeToCommon ?? null,
      grossMargins: fin?.grossMargins ?? null,
      operatingMargins: fin?.operatingMargins ?? null,
      profitMargins: fin?.profitMargins ?? null,
      revenueGrowth: fin?.revenueGrowth ?? null,
      earningsGrowth: fin?.earningsGrowth ?? null,
      totalDebt: fin?.totalDebt ?? null,
      freeCashflow: fin?.freeCashflow ?? null,
      returnOnEquity: fin?.returnOnEquity ?? null,
      sector: prof?.sector ?? null,
      industry: prof?.industry ?? null,
      country: prof?.country ?? null,
      employees: prof?.fullTimeEmployees ?? null,
      description: prof?.longBusinessSummary ?? null,
      lastEarningsDate: cal?.earnings?.earningsDate?.[0]
        ? new Date(cal.earnings.earningsDate[0]).toLocaleDateString('tr-TR')
        : null,
      nextEarningsDate: cal?.earnings?.earningsDate?.[1]
        ? new Date(cal.earnings.earningsDate[1]).toLocaleDateString('tr-TR')
        : null,
    };
  } catch {
    return null;
  }
}

export async function fetchHistoricalData(ticker: string, days = 45): Promise<HistoricalBar[]> {
  try {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows: any[] = await yahooFinance.historical(ticker, {
      period1: start,
      period2: end,
      interval: '1d',
    });

    return rows.map((r) => ({
      date: r.date.toISOString().split('T')[0],
      open: r.open ?? 0,
      high: r.high ?? 0,
      low: r.low ?? 0,
      close: r.close ?? 0,
      volume: r.volume ?? 0,
    }));
  } catch {
    return [];
  }
}

// ── Formatters ─────────────────────────────────────────

function fmtNum(n: number | null, decimals = 2): string {
  return n != null ? n.toFixed(decimals) : 'N/A';
}

function fmtPrice(n: number | null, currency = '$'): string {
  return n != null ? `${currency}${n.toFixed(2)}` : 'N/A';
}

function fmtBig(n: number | null): string {
  if (n == null) return 'N/A';
  const abs = Math.abs(n);
  if (abs >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  return `$${n.toFixed(0)}`;
}

function fmtPct(n: number | null): string {
  return n != null ? `${(n * 100).toFixed(2)}%` : 'N/A';
}

function fmtChange(change: number | null, pct: number | null): string {
  if (change == null) return 'N/A';
  const sign = change >= 0 ? '+' : '';
  const pctStr = pct != null ? ` (${sign}${(pct * 100).toFixed(2)}%)` : '';
  return `${sign}$${change.toFixed(2)}${pctStr}`;
}

export function formatStockData(d: StockData, includeDescription = true): string {
  const cur = d.currency === 'USD' ? '$' : (d.currency ?? '$');
  const today = new Date().toLocaleDateString('tr-TR');
  let out = '';

  out += `\n---\n## 📊 Gerçek Zamanlı Veri: ${d.ticker} (${today})\n\n`;

  out += `### Fiyat\n`;
  out += `| Metrik | Değer |\n|--------|-------|\n`;
  out += `| Güncel Fiyat | **${fmtPrice(d.price, cur)}** |\n`;
  out += `| Günlük Değişim | ${fmtChange(d.change, d.changePercent)} |\n`;
  out += `| 52H Yüksek / Düşük | ${fmtPrice(d.week52High, cur)} / ${fmtPrice(d.week52Low, cur)} |\n`;
  out += `| Piyasa Değeri | ${fmtBig(d.marketCap)} |\n`;
  out += `| Günlük Hacim | ${d.volume ? d.volume.toLocaleString('tr-TR') : 'N/A'} |\n\n`;

  out += `### Değerleme\n`;
  out += `| Metrik | Değer |\n|--------|-------|\n`;
  out += `| F/K (P/E) | ${fmtNum(d.pe, 1)}x |\n`;
  out += `| İleriye Dönük F/K | ${fmtNum(d.forwardPe, 1)}x |\n`;
  out += `| PD/DD (P/B) | ${fmtNum(d.priceToBook, 2)}x |\n`;
  out += `| EPS | ${fmtPrice(d.eps, cur)} |\n`;
  out += `| Beta | ${fmtNum(d.beta)} |\n`;
  if (d.targetPrice) out += `| Analist Hedef Fiyat | ${fmtPrice(d.targetPrice, cur)} |\n`;
  if (d.analystRating) out += `| Analist Görüşü | **${d.analystRating.toUpperCase()}** |\n`;

  out += `\n### Finansallar\n`;
  out += `| Metrik | Değer |\n|--------|-------|\n`;
  out += `| Toplam Gelir | ${fmtBig(d.totalRevenue)} |\n`;
  out += `| Net Gelir | ${fmtBig(d.netIncome)} |\n`;
  out += `| Brüt Marj | ${fmtPct(d.grossMargins)} |\n`;
  out += `| Faaliyet Marjı | ${fmtPct(d.operatingMargins)} |\n`;
  out += `| Net Marj | ${fmtPct(d.profitMargins)} |\n`;
  out += `| Gelir Büyümesi (YoY) | ${fmtPct(d.revenueGrowth)} |\n`;
  out += `| Kazanç Büyümesi (YoY) | ${fmtPct(d.earningsGrowth)} |\n`;
  out += `| Özsermaye Karlılığı (ROE) | ${fmtPct(d.returnOnEquity)} |\n`;
  out += `| Toplam Borç | ${fmtBig(d.totalDebt)} |\n`;
  out += `| Serbest Nakit Akışı | ${fmtBig(d.freeCashflow)} |\n\n`;

  if (d.sector || d.industry || d.country || d.employees) {
    out += `### Şirket\n`;
    if (d.sector) out += `- **Sektör:** ${d.sector}\n`;
    if (d.industry) out += `- **Endüstri:** ${d.industry}\n`;
    if (d.country) out += `- **Ülke:** ${d.country}\n`;
    if (d.employees) out += `- **Çalışan:** ${d.employees.toLocaleString('tr-TR')}\n`;
    if (d.lastEarningsDate) out += `- **Son Kazanç Tarihi:** ${d.lastEarningsDate}\n`;
    if (d.nextEarningsDate) out += `- **Sonraki Kazanç Tarihi:** ${d.nextEarningsDate}\n`;
    out += '\n';
  }

  if (includeDescription && d.description) {
    const short = d.description.length > 600 ? d.description.slice(0, 600) + '...' : d.description;
    out += `### Şirket Hakkında\n${short}\n\n`;
  }

  out += `---\n`;
  return out;
}

export function formatHistoricalData(bars: HistoricalBar[], ticker: string): string {
  if (!bars.length) return '';
  let out = `\n---\n## 📈 ${ticker} — Son ${bars.length} Gün Fiyat Geçmişi\n\n`;
  out += `| Tarih | Açılış | Yüksek | Düşük | Kapanış | Hacim |\n`;
  out += `|-------|--------|--------|-------|---------|-------|\n`;
  const recent = bars.slice(-30);
  for (const b of recent) {
    out += `| ${b.date} | $${b.open.toFixed(2)} | $${b.high.toFixed(2)} | $${b.low.toFixed(2)} | $${b.close.toFixed(2)} | ${b.volume.toLocaleString()} |\n`;
  }
  out += `\n---\n`;
  return out;
}

export function formatMultipleStocks(stocks: StockData[]): string {
  return stocks.map((s) => formatStockData(s, false)).join('\n');
}
