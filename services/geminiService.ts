

import { GoogleGenAI } from "@google/genai";
import { BotConfig, NewsItem, PublishedContent, ContentRecommendation, CarouselSlide, VisualStyle } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// ... existing imports and simple functions like generateMarketAnalysis ...
export const generateMarketAnalysis = async (symbol: string, timeframe: string): Promise<string> => {
  try {
    if (!process.env.API_KEY) {
      return `Technical Outlook for ${symbol} (${timeframe}): Price is forming a bullish flag pattern above the 200 EMA. Key resistance observed at the recent high. RSI indicates mild overbought conditions, suggesting a potential pullback before continuation.`;
    }
    const model = 'gemini-2.5-flash';
    const prompt = `Provide a concise, 3-sentence technical outlook for ${symbol} on the ${timeframe} timeframe. Focus on key support/resistance levels and trend direction.`;
    const response = await ai.models.generateContent({ model: model, contents: prompt });
    return response.text || "Analysis complete.";
  } catch (error) {
    return "Could not generate analysis at this time.";
  }
};

export const generateSignalDescription = async (symbol: string, type: string, entry: number, sl: number, tp: number[]): Promise<string> => {
  try {
    if (!process.env.API_KEY) {
      return `🚀 Trade Setup: ${type} ${symbol} at ${entry}. The stock has broken out of a key consolidation zone with high volume. Aiming for targets ${tp.join(' & ')} with a strict SL at ${sl}. Risk managed! #Trading #${symbol}`;
    }
    const model = 'gemini-2.5-flash';
    const prompt = `Write a catchy, professional signal alert. Symbol: ${symbol}, Action: ${type}, Entry: ${entry}, Stop Loss: ${sl}, Targets: ${tp.join(', ')}. Keep under 280 chars.`;
    const response = await ai.models.generateContent({ model: model, contents: prompt });
    return response.text || `Trade Idea: ${type} ${symbol} @ ${entry}`;
  } catch (error) {
    return `Trade Idea: ${type} ${symbol} @ ${entry}`;
  }
};

export const generateContentFromData = async (symbol: string, niche: string, userInstruction: string): Promise<string> => {
    try {
        if (!process.env.API_KEY) {
            return `📊 **${symbol} Analysis**\n\nRecent movement in ${symbol} suggests a major shift in sentiment. Based on the fundamental data, we are seeing margin expansion which aligns with our '${niche}' thesis.\n\nKey Takeaway: The market is undervaluing the long-term growth potential here.\n\nWhat are your thoughts? 👇\n\n#Investing #Finance #${symbol} #Analysis`;
        }
        const model = 'gemini-2.5-flash';
        const prompt = `
            Act as a Financial Content Creator specializing in "${niche}".
            Draft a social media post about ${symbol}.
            User's specific instruction: "${userInstruction}"
            
            Style: Professional, Engaging, LinkedIn-friendly.
            Include emojis and hashtags.
        `;
        const response = await ai.models.generateContent({ model, contents: prompt });
        return response.text || "Drafting failed.";
    } catch (e) {
        return "Could not draft content.";
    }
};

export const generateHybridContent = async (news: NewsItem, userInsight: string, niche: string): Promise<string> => {
    try {
        if (!process.env.API_KEY) {
             return `🚨 **${news.headline}**\n\nThis is a significant development for ${news.symbol}. \n\nMy Take: ${userInsight}\n\nGiven this news, we might see continued strength in the short term. This aligns well with our broader ${niche} strategy. \n\n#${news.symbol} #MarketUpdate #Analysis`;
        }
        const model = 'gemini-2.5-flash';
        const prompt = `
            Act as a Financial Analyst specializing in "${niche}".
            
            Task: Write a social media post based on the following:
            1. NEWS EVENT: "${news.headline} - ${news.summary}"
            2. MY EXPERT INSIGHT: "${userInsight}"
            
            Structure:
            - Start with a hook about the news.
            - Pivot to "Why this matters" (My Insight).
            - End with a question or call to action.
            
            Tone: Professional, Insightful, Authority.
        `;
        const response = await ai.models.generateContent({ model, contents: prompt });
        return response.text || "Hybrid drafting failed.";
    } catch (e) {
        return "Hybrid drafting unavailable.";
    }
};

export const generateImagePrompt = async (topic: string, style: string = 'professional'): Promise<string> => {
     // This simulates generating an image description or URL
     // In a real app, this would call DALL-E 3 or Midjourney API
     const keywords = topic.split(' ')[0] || 'finance';
     return `https://source.unsplash.com/random/800x600/?${keywords},finance,${style}`;
};

// --- CAROUSEL GENERATION SERVICES ---

export const splitTextToSlides = async (
    fullText: string, 
    niche: string
): Promise<CarouselSlide[]> => {
    // This takes a blob of text and intelligently chops it into slides
    if (!process.env.API_KEY) {
        const sentences = fullText.split('. ');
        return sentences.slice(0, 5).map((s, i) => ({
            id: i,
            title: i === 0 ? "Introduction" : `Key Point ${i}`,
            body: s + (s.endsWith('.') ? '' : '.'),
            isGenerated: false
        }));
    }
    
    // In real implementation, we would force JSON output mode from Gemini
    return Array.from({ length: 5 }, (_, i) => ({
        id: i,
        title: `Slide ${i+1}`,
        body: "Generated content would appear here based on the specific topic and financial niche.",
        isGenerated: false
    }));
};

export const generateCarouselStructure = async (
    topic: string, 
    slideCount: number, 
    niche: string
): Promise<CarouselSlide[]> => {
    if (!process.env.API_KEY) {
        // Mock data
        return Array.from({ length: slideCount }, (_, i) => ({
            id: i + 1,
            title: i === 0 ? `The Truth About ${topic}` : i === slideCount - 1 ? "Summary & Action" : `Key Point ${i}`,
            body: i === 0 ? "Most investors get this wrong. Here is why..." : "This data point changes everything for the long term outlook.",
            isGenerated: false
        }));
    }
    
    // In real implementation, we would force JSON output mode from Gemini
    return Array.from({ length: slideCount }, (_, i) => ({
        id: i + 1,
        title: `Slide ${i+1}: ${topic}`,
        body: "Generated content would appear here based on the specific topic and financial niche.",
        isGenerated: false
    }));
};

export const generateSlideVisual = async (slideTitle: string, style: VisualStyle, feedback?: string): Promise<string> => {
    // Simulates generating a specific visual for a slide
    // Real implementation would pass prompt to image gen model
    const styleKeywords = style === 'MINIMALIST' ? 'minimal,clean,white' : 
                          style === 'CYBERPUNK' ? 'neon,dark,futuristic' : 
                          style === 'CORPORATE' ? 'office,blue,professional' : 'bold,red,contrast';
    
    // Feedback simulation (changing the seed)
    const seed = feedback ? Math.random() : slideTitle.length;
    
    return `https://source.unsplash.com/random/800x800/?${styleKeywords},abstract,finance&sig=${seed}`;
};

export const generatePostCaption = async (slides: CarouselSlide[]): Promise<string> => {
    // Generates the LinkedIn caption to go WITH the carousel
    const topic = slides[0]?.title || "Market Update";
    return `🚀 **${topic}**\n\nI broke down the key details in this carousel.\n\nSwipe through to understand the full picture.\n\nLet me know your thoughts in the comments! 👇 #Finance #Investing #Analysis`;
}

// ... existing functions ...

export const analyzeContentPerformance = async (posts: any[], demographics?: any): Promise<string> => {
  try {
    if (!process.env.API_KEY) {
       return `💡 **Audience Strategy Insight:**\n\nYour data shows that **40% of your audience is in Finance/Banking**. However, your recent content on "Crypto Basics" saw a **15% lower Engagement Rate**. Pivot towards institutional-grade analysis.`;
    }
    const model = 'gemini-2.5-flash';
    const prompt = `Act as a LinkedIn Growth Strategist. Analyze demographics: ${JSON.stringify(demographics)} and performance: ${JSON.stringify(posts)}. Provide 1 strategic insight.`;
    const response = await ai.models.generateContent({ model, contents: prompt });
    return response.text || "Analysis failed.";
  } catch (error) {
    return "Could not generate insights.";
  }
};

export const generateContentSuggestions = async (persona: string, recentTopics: string[]): Promise<string> => {
    try {
        if (!process.env.API_KEY) {
            return "Based on your focus on Banking, you should cover the upcoming HDFC merger completion. Competitors are posting about 'NIM Compression', which is a content gap for you.";
        }
        const model = 'gemini-2.5-flash';
        const prompt = `Act as a Content Strategist for a ${persona}. Recent Topics: ${recentTopics.join(', ')}. Suggest 1 trending content idea.`;
        const response = await ai.models.generateContent({ model, contents: prompt });
        return response.text || "Suggestion unavailable.";
    } catch(e) {
        return "Suggestion system offline.";
    }
};

// --- NEW STRATEGY ENGINE ---

export const generateGrowthStrategy = async (pastReports: PublishedContent[]): Promise<ContentRecommendation[]> => {
    // This mocks the AI analyzing the data
    return [
        {
            id: 'rec-1',
            title: 'Visual DNA: "Corporate Blue" wins',
            reason: 'Your "Corporate" style visuals get 45% more Saves than "Minimalist" ones. Audience prefers professional density.',
            actionType: 'FORMAT_PIVOT',
            expectedImpact: 'High',
            suggestedDraft: 'Keep the "Corporate Blue" theme for the next macro update. \n\nFocus: "Interest Rate Cycle"',
            referencePostId: 'rep-1'
        },
        {
            id: 'rec-2',
            title: 'Hook Logic: "Questions" > "Statements"',
            reason: 'Posts starting with "Is..." or "Why..." have a 2.5x higher CTR than statement headlines.',
            actionType: 'DEEP_DIVE',
            expectedImpact: 'Medium',
            suggestedDraft: 'Draft a new post starting with: "Why are midcap valuations ignoring the risk premium?"',
        },
        {
            id: 'rec-3',
            title: 'Format: Carousels are king',
            reason: 'Carousels have an average dwell time of 45s vs 12s for text. Prioritize slides for educational topics.',
            actionType: 'REPURPOSE',
            expectedImpact: 'High',
            suggestedDraft: 'Convert your recent text post about "Inflation" into a 7-slide carousel.',
        }
    ];
};

export const chatWithGuruBot = async (
  history: { role: string, parts: { text: string }[] }[], 
  newMessage: string,
  strategyContext: string = '',
  activeSignalsContext: string = '',
  botConfig?: BotConfig
): Promise<string> => {
  try {
    const botName = botConfig?.name || 'FinBot';
    const botTone = botConfig?.tone || 'Professional';
    const botSignature = botConfig?.signature || '';

    if (!process.env.API_KEY) {
       const lowerMsg = newMessage.toLowerCase();
       if (lowerMsg.includes('draft') || lowerMsg.includes('post') || lowerMsg.includes('write')) {
           return `I've drafted a post based on that. Check the Content Studio to edit and publish!\n\n(Click 'Edit in Studio' to view)`;
       }
       return `I'm analyzing the data for you. Would you like me to draft a post about this?`;
    }

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: `You are "${botName}", a smart assistant for financial creators. Tone: ${botTone}. Context: ${strategyContext}.`,
      },
      history: history,
    });

    const response = await chat.sendMessage({ message: newMessage });
    return response.text || "I didn't catch that.";
  } catch (error) {
    return "Sorry, I'm having trouble connecting to the server right now.";
  }
};

export const checkSignalRisk = async (signal: any, strategyContext: string): Promise<{ safe: boolean; reason: string }> => {
  return { safe: true, reason: "Mock Risk Check Passed." };
};

// --- GENIE WORKSPACE FUNCTIONS ---

export const runSmartTemplate = async (
    symbol: string, 
    templatePrompt: string, 
    niche: string
): Promise<string> => {
    try {
        if (!process.env.API_KEY) {
            // Mock response for demo when no key
            if (templatePrompt.includes('Earnings')) {
                return `# ${symbol} Quarterly Review: Key Takeaways\n\n**1. Revenue Growth:**\nTop-line revenue grew by 12% YoY, beating analyst estimates of 8%. This signals strong demand in the core business.\n\n**2. Margin Pressure:**\nEBITDA margins compressed by 50bps due to higher input costs. This is a key risk to monitor for next quarter.\n\n**3. Management Guidance:**\nBullish outlook for FY25 with expected double-digit growth in the export segment.\n\n**Conclusion:**\nDespite the margin blip, the structural story remains intact. Accumulate on dips.`;
            }
            return `# Analysis: ${symbol}\n\n**Market Sentiment:**\nCurrently showing strong bullish momentum above key moving averages.\n\n**Investment Thesis:**\nValuation at 15x PE offers a margin of safety compared to the industry average of 22x.\n\n**Risk Factors:**\nGlobal headwinds could impact export revenue.`;
        }

        const model = 'gemini-2.5-flash';
        const fullPrompt = `
            Act as a Senior Financial Analyst specializing in ${niche}.
            
            Context: Analyzing ${symbol}.
            Task: ${templatePrompt}
            
            Output: A structured, professional report using Markdown formatting. Use bolding for key metrics.
        `;
        
        const response = await ai.models.generateContent({ model, contents: fullPrompt });
        return response.text || "Template generation failed.";
    } catch (e) {
        return "System busy. Using cached data.";
    }
};

export const refineCanvasContent = async (currentContent: string, instruction: string): Promise<string> => {
    try {
        if (!process.env.API_KEY) {
            return currentContent + `\n\n[Refined: Added more metrics]\n- P/E Ratio: 24.5\n- ROE: 18%`;
        }
        
        const model = 'gemini-2.5-flash';
        const prompt = `
            You are an expert editor.
            
            Current Text:
            """${currentContent}"""
            
            Instruction: ${instruction}
            
            Return the full rewritten text with the improvements applied. Keep the original structure unless asked to change it.
        `;
        
        const response = await ai.models.generateContent({ model, contents: prompt });
        return response.text || currentContent;
    } catch (e) {
        return currentContent;
    }
}