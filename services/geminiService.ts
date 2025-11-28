import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
// In a real production app, ensure API_KEY is set in environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateMarketAnalysis = async (symbol: string, timeframe: string): Promise<string> => {
  try {
    if (!process.env.API_KEY) {
      // Mock response for demo
      return `Technical Outlook for ${symbol} (${timeframe}): Price is forming a bullish flag pattern above the 200 EMA. Key resistance observed at the recent high. RSI indicates mild overbought conditions, suggesting a potential pullback before continuation.`;
    }

    const model = 'gemini-2.5-flash';
    const prompt = `
      Act as a senior technical analyst for a financial trading platform.
      Provide a concise, 3-sentence technical outlook for ${symbol} on the ${timeframe} timeframe.
      Focus on key support/resistance levels and trend direction.
      Do not give financial advice, just technical observation.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Analysis complete.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Could not generate analysis at this time.";
  }
};

export const generateSignalDescription = async (
  symbol: string,
  type: string,
  entry: number,
  sl: number,
  tp: number[]
): Promise<string> => {
  try {
    if (!process.env.API_KEY) {
      // Mock response for demo
      return `🚀 Trade Setup: ${type} ${symbol} at ${entry}. The stock has broken out of a key consolidation zone with high volume. Aiming for targets ${tp.join(' & ')} with a strict SL at ${sl}. Risk managed! #Trading #${symbol}`;
    }

    const model = 'gemini-2.5-flash';
    const prompt = `
      Write a catchy, professional signal alert for a trading community.
      Symbol: ${symbol}
      Action: ${type}
      Entry: ${entry}
      Stop Loss: ${sl}
      Targets: ${tp.join(', ')}
      
      Keep it under 280 characters (Tweet style). Use emojis suitable for trading (bull/bear/rocket/chart).
      Include hashtags like #${symbol} #Trading.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || `Trade Idea: ${type} ${symbol} @ ${entry}`;
  } catch (error) {
    console.error("Gemini Description Error:", error);
    return `Trade Idea: ${type} ${symbol} @ ${entry}`;
  }
};

export const chatWithGuruBot = async (
  history: { role: string, parts: { text: string }[] }[], 
  newMessage: string,
  strategyContext: string = '',
  activeSignalsContext: string = ''
): Promise<string> => {
  try {
    if (!process.env.API_KEY) {
       // Mock intelligent responses for demo purposes
       const lowerMsg = newMessage.toLowerCase();
       if (lowerMsg.includes('draft') || lowerMsg.includes('update')) {
         return "📢 **Morning Market Update** 📢\n\nGood morning, champions! ☀️\n\nNifty is currently showing strong bullish momentum, trading above 22,500. BankNifty is consolidating near highs.\n\n**Watchlist:**\n1. RELIANCE - Breakout likely\n2. HDFCBANK - Support zone\n\nStay disciplined and wait for confirmation before entering! 🚀";
       }
       if (lowerMsg.includes('refund') || lowerMsg.includes('angry')) {
         return "Here is a diplomatic draft response:\n\n'Hi [Name], I'm sorry to hear you're not satisfied. We value your feedback. Our team has received your request and will review it within 24 hours according to our refund policy. Thank you for your patience.'";
       }
       if (lowerMsg.includes('tweet') || lowerMsg.includes('viral')) {
         return "🔥 **Viral Tweet Idea:**\n\n'Trading is 10% buying, 10% selling, and 80% waiting. 🧘‍♂️\n\nMost traders lose money because they don't know how to sit on their hands.\n\nAgree? 👇 #TradingPsychology #StockMarket'";
       }
       // Context aware mock response
       if (activeSignalsContext && (lowerMsg.includes('active') || lowerMsg.includes('trades') || lowerMsg.includes('open'))) {
         return `You currently have the following active trades:\n\n${activeSignalsContext}\n\nBased on current market volatility, consider trailing your SL on the profitable ones.`;
       }
       if (strategyContext && (lowerMsg.includes('buy') || lowerMsg.includes('sell') || lowerMsg.includes('strategy'))) {
         return `Based on your strategy rules ("${strategyContext.substring(0, 50)}..."), this setup looks valid only if volume confirms the breakout. Remember your rule about RSI ranges!`;
       }
       return "I can help you manage your community. Try asking me to 'Draft a market update', 'Handle a refund request', or 'Write a viral tweet'.";
    }

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: `
          You are "FinBot", an intelligent AI assistant built specifically for financial influencers (Gurus) who run trading communities.
          
          Your goal is to save the Guru time by:
          1. **Drafting Content**: Morning updates, trade recaps, and motivational posts.
          2. **Community Management**: Suggesting diplomatic replies to angry users or refund requests.
          3. **Engagement**: Generating poll ideas or "viral" tweet drafts about trading psychology.
          
          **CRITICAL - ACTIVE TRADES CONTEXT:**
          These are the currently OPEN trades for this Guru. Use this to answer questions about "current positions" or "what to do with [Symbol]":
          "${activeSignalsContext}"

          **CRITICAL - GURU'S PRIVATE STRATEGY:**
          The Guru has defined the following specific trading rules and strategy. You MUST use this context when answering strategy-related questions:
          "${strategyContext}"
          
          Tone: Professional, authoritative, yet approachable. Use emojis where appropriate.
        `,
      },
      history: history,
    });

    const response = await chat.sendMessage({ message: newMessage });
    return response.text || "I didn't catch that.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Sorry, I'm having trouble connecting to the server right now.";
  }
};