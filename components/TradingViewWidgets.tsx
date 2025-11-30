
import React, { useEffect, useRef } from 'react';

// --- HELPER FOR EMBED WIDGETS ---
const TradingViewEmbedWidget: React.FC<{
  scriptSrc: string;
  scriptHTML: object;
  containerStyles?: React.CSSProperties;
}> = ({ scriptSrc, scriptHTML, containerStyles = { height: "100%", width: "100%" } }) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    
    // Clear previous widget to prevent duplication
    container.current.innerHTML = '';
    
    const script = document.createElement("script");
    script.src = scriptSrc;
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify(scriptHTML);
    container.current.appendChild(script);
  }, [scriptSrc, JSON.stringify(scriptHTML)]);

  return (
    <div className="tradingview-widget-container" ref={container} style={containerStyles}>
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
};

// --- WIDGET IMPLEMENTATIONS ---

export const TickerTape: React.FC = () => {
  return (
    <TradingViewEmbedWidget
      scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js"
      scriptHTML={{
        "symbols": [
          { "proName": "FOREXCOM:SPXUSD", "title": "S&P 500" },
          { "proName": "NSE:NIFTY", "description": "Nifty 50" },
          { "description": "Bank Nifty", "proName": "NSE:BANKNIFTY" },
          { "description": "Reliance", "proName": "NSE:RELIANCE" }
        ],
        "showSymbolLogo": true,
        "isTransparent": false,
        "displayMode": "adaptive",
        "colorTheme": "dark",
        "locale": "in"
      }}
    />
  );
};

export const AdvancedRealTimeChart: React.FC<{ symbol?: string; theme?: 'dark' | 'light'; height?: string | number }> = ({ symbol = "NSE:NIFTY", theme = "dark", height = "100%" }) => {
  // Use a stable ID for the container
  const containerId = useRef(`tv_chart_${Math.random().toString(36).substring(7)}`);
  
  useEffect(() => {
    let isMounted = true;
    const currentContainerId = containerId.current;
    
    const initWidget = () => {
      if (!isMounted) return;

      const container = document.getElementById(currentContainerId);
      // Verify container exists and window.TradingView is available
      if (window.TradingView && container) {
        // IMPORTANT: Clear the container to remove previous iframes
        container.innerHTML = '';
        
        new window.TradingView.widget({
          "autosize": true,
          "symbol": symbol,
          "interval": "D",
          "timezone": "Asia/Kolkata",
          "theme": theme,
          "style": "1",
          "locale": "in",
          "enable_publishing": false,
          "allow_symbol_change": true,
          "container_id": currentContainerId,
          "hide_side_toolbar": false,
          "studies": ["RSI@tv-basicstudies"]
        });
      }
    };

    // Script Loading Logic
    const scriptId = 'tv-widget-script';
    const existingScript = document.getElementById(scriptId);

    if (!existingScript) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = initWidget;
      document.head.appendChild(script);
    } else {
      // If script exists, ensure TradingView is ready
      if (window.TradingView) {
        initWidget();
      } else {
        // Poll for availability if script is still loading
        const checkInterval = setInterval(() => {
          if (window.TradingView) {
            initWidget();
            clearInterval(checkInterval);
          }
        }, 100);
        // Safety timeout
        setTimeout(() => clearInterval(checkInterval), 5000);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [symbol, theme]);

  return <div id={containerId.current} className="tradingview-widget-container" style={{ height: height, width: "100%" }} />;
};

export const TechnicalAnalysis: React.FC<{ symbol?: string }> = ({ symbol = "NSE:NIFTY" }) => {
  return (
    <TradingViewEmbedWidget
      scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js"
      scriptHTML={{ "symbol": symbol, "interval": "15m", "width": "100%", "isTransparent": true, "height": "100%", "colorTheme": "dark", "locale": "in" }}
    />
  );
};

export const MarketOverview: React.FC = () => {
  return (
    <TradingViewEmbedWidget
      scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js"
      scriptHTML={{ "colorTheme": "dark", "dateRange": "12M", "showChart": true, "locale": "in", "width": "100%", "height": "100%", "tabs": [{ "title": "Indices", "symbols": [{ "s": "NSE:NIFTY" }] }] }}
    />
  );
};

export const StockHeatmap: React.FC = () => {
  return (
    <TradingViewEmbedWidget
      scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js"
      scriptHTML={{ "dataSource": "NIFTY50", "grouping": "sector", "blockSize": "market_cap_basic", "blockColor": "change", "locale": "in", "colorTheme": "dark", "width": "100%", "height": "100%" }}
    />
  );
};

export const ForexCrossRates: React.FC = () => {
  return (
    <TradingViewEmbedWidget
      scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-forex-cross-rates.js"
      scriptHTML={{ "width": "100%", "height": "100%", "currencies": ["EUR", "USD", "INR", "GBP"], "isTransparent": true, "colorTheme": "dark", "locale": "in" }}
    />
  );
};

declare global {
  interface Window {
    TradingView: any;
  }
}
