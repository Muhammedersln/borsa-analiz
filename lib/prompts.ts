export function buildPrompt(toolId: string, params: Record<string, string>): string | null {
  switch (toolId) {
    case 'arastirma':
      return `Act like a professional stock market analyst. Analyze ${params.ticker} as a possible investment. Break down its business model, main revenue sources, competitive advantages, major risks, recent performance, debt level, profitability, and future growth potential. At the end, give a simple summary with Bull Case, Bear Case, and Neutral View.`;

    case 'alim':
      return `I am considering buying ${params.ticker} at around $${params.price}. My investment time horizon is ${params.horizon} and my risk tolerance is ${params.risk}. Analyze whether this stock looks attractive at the current price. Consider valuation, earnings growth, industry trends, analyst sentiment, and possible downside risk. Give a clear "buy now, wait, or avoid" style conclusion with detailed reasoning.`;

    case 'satim':
      return `I currently own ${params.shares} shares of ${params.ticker} at an average cost of $${params.costBasis}. The stock is currently trading around $${params.currentPrice}. Help me decide whether to hold, sell part, or sell all. Analyze the stock's fundamentals, technical trend, recent news, valuation, and whether the original investment thesis still makes sense. Give 3 exit strategies: conservative, balanced, and aggressive.`;

    case 'karsilastirma':
      return `Compare ${params.stock1}, ${params.stock2}, and ${params.stock3} as potential investments. Evaluate them based on revenue growth, profit margins, debt, valuation, competitive advantage, risks, dividend potential, and long-term growth outlook. Create a simple ranking from best to worst, and explain which type of investor each stock is best suited for.`;

    case 'risk':
      return `Before I invest in ${params.ticker}, identify the biggest risks I should know. Include company-specific risks, industry risks, economic risks, valuation risks, competition risks, regulatory risks, and market sentiment risks. Rank each risk as low, medium, or high. Finally, tell me what warning signs I should monitor after buying the stock.`;

    case 'uzun-vade':
      return `Analyze ${params.ticker} as a long-term investment for the next ${params.years}. Focus on whether the company has durable competitive advantages, strong leadership, consistent demand, pricing power, innovation, financial strength, and market expansion opportunities. Give a long-term investment thesis and explain what could make the thesis fail.`;

    case 'teknik':
      return `Act like a technical analyst. Analyze ${params.ticker} using the current price chart data provided below:\n\n${params.chartData}\n\nLook at trend direction, support and resistance levels, moving averages, volume, RSI, MACD, breakout or breakdown signals, and possible entry/exit zones. Give a trading plan with entry, stop-loss, and target areas.`;

    case 'kazanc':
      return `Analyze the latest earnings report for ${params.ticker}. Here is the earnings data:\n\n${params.earningsData}\n\nSummarize revenue, earnings per share, profit margins, guidance, management commentary, and market reaction. Tell me whether the earnings report was strong, weak, or mixed. Also explain what this could mean for the stock price in the short term and long term.`;

    case 'portfoy':
      return `I have $${params.amount} to invest and I am interested in these stocks: ${params.stocks}. My risk tolerance is ${params.risk}, and my investing goal is ${params.goal}. Help me create a balanced portfolio allocation. Explain how much percentage I could consider putting into each stock, why, and what risks I should be aware of. Also suggest how much cash I should keep aside.`;

    case 'izleme':
      return `Create a stock watchlist for me based on this theme: ${params.theme}. For each stock, include the ticker, company summary, why it may be worth watching, key financial strengths, major risks, ideal investor type, and what price or event might make it more attractive.`;

    default:
      return null;
  }
}
