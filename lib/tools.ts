export type FieldType = 'text' | 'select' | 'textarea';

export interface Field {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: string[];
  required: boolean;
}

export interface Tool {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  iconColor: string;
  fields: Field[];
}

export const tools: Tool[] = [
  {
    id: 'arastirma',
    title: 'Hisse Araştırma',
    description: 'İş modeli, gelir kaynakları, rekabet avantajları ve büyüme potansiyeliyle kapsamlı analiz.',
    icon: 'search',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
    fields: [
      { id: 'ticker', label: 'Hisse Kodu / Şirket Adı', type: 'text', placeholder: 'örn. AAPL veya Apple Inc.', required: true }
    ]
  },
  {
    id: 'alim',
    title: 'Alım Kararı',
    description: 'Belirli fiyat, süre ve risk toleransına göre "al, bekle ya da geç" kararı.',
    icon: 'trending-up',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    fields: [
      { id: 'ticker', label: 'Hisse Kodu', type: 'text', placeholder: 'örn. TSLA', required: true },
      { id: 'price', label: 'Düşündüğünüz Alış Fiyatı ($)', type: 'text', placeholder: 'örn. 250', required: true },
      { id: 'horizon', label: 'Yatırım Süresi', type: 'select', options: ['Kısa vadeli', '6 ay', '1 yıl', '5 yıl'], required: true },
      { id: 'risk', label: 'Risk Toleransı', type: 'select', options: ['Düşük', 'Orta', 'Yüksek'], required: true }
    ]
  },
  {
    id: 'satim',
    title: 'Satım Kararı',
    description: 'Elindeki hisseler için tut, sat ya da kısmen sat — 3 farklı çıkış stratejisi.',
    icon: 'trending-down',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    iconColor: 'text-red-600',
    fields: [
      { id: 'ticker', label: 'Hisse Kodu', type: 'text', placeholder: 'örn. NVDA', required: true },
      { id: 'shares', label: 'Hisse Adedi', type: 'text', placeholder: 'örn. 100', required: true },
      { id: 'costBasis', label: 'Ortalama Alış Fiyatı ($)', type: 'text', placeholder: 'örn. 150', required: true },
      { id: 'currentPrice', label: 'Güncel Fiyat ($)', type: 'text', placeholder: 'örn. 220', required: true }
    ]
  },
  {
    id: 'karsilastirma',
    title: 'Hisse Karşılaştırma',
    description: '3 hisseyi gelir büyümesi, değerleme, borç ve rekabet avantajı açısından karşılaştır.',
    icon: 'bar-chart',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
    fields: [
      { id: 'stock1', label: '1. Hisse', type: 'text', placeholder: 'örn. AAPL', required: true },
      { id: 'stock2', label: '2. Hisse', type: 'text', placeholder: 'örn. MSFT', required: true },
      { id: 'stock3', label: '3. Hisse', type: 'text', placeholder: 'örn. GOOGL', required: true }
    ]
  },
  {
    id: 'risk',
    title: 'Risk Analizi',
    description: 'Şirket, sektör, ekonomik ve değerleme risklerini düşük/orta/yüksek olarak sırala.',
    icon: 'shield-alert',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-600',
    fields: [
      { id: 'ticker', label: 'Hisse Kodu', type: 'text', placeholder: 'örn. META', required: true }
    ]
  },
  {
    id: 'uzun-vade',
    title: 'Uzun Vadeli Analiz',
    description: '5-15 yıllık perspektiften sürdürülebilir avantaj, liderlik ve büyüme fırsatları.',
    icon: 'target',
    color: 'text-teal-700',
    bgColor: 'bg-teal-50',
    iconColor: 'text-teal-600',
    fields: [
      { id: 'ticker', label: 'Hisse Kodu', type: 'text', placeholder: 'örn. AMZN', required: true },
      { id: 'years', label: 'Yatırım Süresi', type: 'select', options: ['5 yıl', '10 yıl', '15 yıl'], required: true }
    ]
  },
  {
    id: 'teknik',
    title: 'Teknik Analiz',
    description: 'Son 45 günlük fiyat verisi otomatik çekilir. Ek RSI/MACD değerleri ekleyebilirsin.',
    icon: 'candle',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    fields: [
      { id: 'ticker', label: 'Hisse Kodu', type: 'text', placeholder: 'örn. SPY', required: true },
      { id: 'chartData', label: 'Ek Notlar / İndikatörler (İsteğe bağlı)', type: 'textarea', placeholder: 'Varsa RSI, MACD değerleri veya kendi notlarını ekleyebilirsin...', required: false }
    ]
  },
  {
    id: 'kazanc',
    title: 'Kazanç Raporu',
    description: 'Temel finansal veriler otomatik çekilir. Ek kazanç detayları ekleyebilirsin.',
    icon: 'file-chart',
    color: 'text-cyan-700',
    bgColor: 'bg-cyan-50',
    iconColor: 'text-cyan-600',
    fields: [
      { id: 'ticker', label: 'Şirket / Hisse Kodu', type: 'text', placeholder: 'örn. NFLX', required: true },
      { id: 'earningsData', label: 'Ek Kazanç Detayları (İsteğe bağlı)', type: 'textarea', placeholder: 'Yönetim yorumları, rehberlik veya ek notlarını buraya yapıştır...', required: false }
    ]
  },
  {
    id: 'portfoy',
    title: 'Portföy Dağılımı',
    description: 'Bütçeni hisseler arasında hedefe ve riske göre dağıt. Nakit payını da hesapla.',
    icon: 'pie-chart',
    color: 'text-pink-700',
    bgColor: 'bg-pink-50',
    iconColor: 'text-pink-600',
    fields: [
      { id: 'amount', label: 'Yatırım Tutarı ($)', type: 'text', placeholder: 'örn. 10000', required: true },
      { id: 'stocks', label: 'İlgilendiğin Hisseler', type: 'text', placeholder: 'örn. AAPL, MSFT, NVDA, TSLA', required: true },
      { id: 'risk', label: 'Risk Toleransı', type: 'select', options: ['Düşük', 'Orta', 'Yüksek'], required: true },
      { id: 'goal', label: 'Yatırım Hedefi', type: 'select', options: ['Büyüme', 'Temettü/Gelir', 'Güvenli', 'Emeklilik', 'Kısa vadeli kâr'], required: true }
    ]
  },
  {
    id: 'izleme',
    title: 'İzleme Listesi',
    description: 'Temaya göre takip listesi oluştur. Ticker, özet, riskler ve ideal alım fırsatları.',
    icon: 'bookmark',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-600',
    fields: [
      {
        id: 'theme',
        label: 'Tema',
        type: 'select',
        options: ['Yapay Zeka hisseleri', 'Temettü hisseleri', 'Teknoloji hisseleri', 'Sağlık hisseleri', 'Enerji hisseleri', 'Değer hisseleri', 'Büyüme hisseleri'],
        required: true
      }
    ]
  },
  {
    id: 'piyasa-oneri',
    title: 'Piyasa Keşfi',
    description: 'Bölge ve yatırım tarzı seç — az bilinen veya popüler hisse önerileri al.',
    icon: 'compass',
    color: 'text-violet-700',
    bgColor: 'bg-violet-50',
    iconColor: 'text-violet-600',
    fields: [
      {
        id: 'regions',
        label: 'Piyasa / Bölge',
        type: 'select',
        options: [
          'Türkiye (BIST)',
          'Amerika (NYSE / NASDAQ)',
          'Avrupa',
          'Türkiye + Amerika',
          'Türkiye + Avrupa',
          'Amerika + Avrupa',
          'Tüm Piyasalar',
        ],
        required: true,
      },
      {
        id: 'discovery',
        label: 'Hisse Tipi',
        type: 'select',
        options: [
          'Karışık (az bilinen + popüler)',
          'Az bilinen / gizli fırsatlar',
          'Popüler / büyük şirketler',
        ],
        required: true,
      },
      {
        id: 'style',
        label: 'Yatırım Tarzı',
        type: 'select',
        options: ['Büyüme', 'Değer', 'Temettü', 'Tematik / Sektörel'],
        required: true,
      },
      {
        id: 'risk',
        label: 'Risk Toleransı',
        type: 'select',
        options: ['Düşük', 'Orta', 'Yüksek'],
        required: true,
      },
    ],
  },
];

export function getToolById(id: string): Tool | undefined {
  return tools.find(t => t.id === id);
}
