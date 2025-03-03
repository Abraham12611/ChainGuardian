import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

interface DexScreenerToken {
  chainId: string;
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceUsd: string;
  priceChange: {
    h24: number;
  };
  liquidity: {
    usd: number;
  };
  volume: {
    h24: number;
  };
  pairCreatedAt: number;
}

async function fetchTopTokens(type: 'gainers' | 'losers', limit = 10) {
  try {
    // Use the v2 pairs endpoint with chain filter
    const res = await fetch('https://api.dexscreener.com/latest/dex/pairs/bsc/1', {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CryptoGuardians/1.0'
      }
    });

    if (!res.ok) {
      console.error(`DexScreener API HTTP error: ${res.status}`);
      throw new Error(`DexScreener API error: ${res.status}`);
    }

    const data = await res.json();
    if (!data.pairs || !Array.isArray(data.pairs)) {
      console.error('Invalid response format from DexScreener:', data);
      throw new Error('Invalid response format from DexScreener');
    }

    let pairs = data.pairs as DexScreenerToken[];

    // Filter out pairs with low liquidity (< $10,000)
    pairs = pairs.filter(pair => {
      const liquidityUsd = pair.liquidity?.usd || 0;
      return liquidityUsd >= 10000;
    });

    // Sort by 24h price change
    pairs.sort((a, b) => {
      const changeA = a.priceChange?.h24 || 0;
      const changeB = b.priceChange?.h24 || 0;
      return type === 'gainers' ? changeB - changeA : changeA - changeB;
    });

    // Calculate token age in days
    const now = Date.now();

    // Take top N results and format them
    return pairs.slice(0, limit).map(pair => {
      const ageInDays = Math.floor((now - (pair.pairCreatedAt || now)) / (1000 * 60 * 60 * 24));
      return {
        name: pair.baseToken.name,
        symbol: pair.baseToken.symbol,
        price: `$${parseFloat(pair.priceUsd).toFixed(6)}`,
        age: ageInDays > 0 ? `${ageInDays}d` : 'New',
        liquidity: `$${(pair.liquidity?.usd / 1000000).toFixed(2)}M`,
        marketCap: `$${(pair.liquidity?.usd * 2 / 1000000).toFixed(2)}M`, // Estimated MCAP
        volume24h: `$${(pair.volume?.h24 / 1000000).toFixed(2)}M`,
        priceChange24h: `${pair.priceChange?.h24?.toFixed(2)}%`
      };
    });
  } catch (error) {
    console.error('Error fetching top tokens:', error);
    throw error;
  }
}

async function queryCryptoGuardians(query: string) {
  try {
    // Check if query is about top gainers/losers
    const isGainersQuery = /top.*gain|best.*perform|highest.*gain/i.test(query);
    const isLosersQuery = /top.*los|worst.*perform|biggest.*drop/i.test(query);

    if (isGainersQuery || isLosersQuery) {
      const type = isGainersQuery ? 'gainers' : 'losers';
      const tokens = await fetchTopTokens(type);

      return {
        text: `Here are the top 10 ${type} in the last 24 hours:`,
        tokenList: tokens,
      };
    }

    // Default response for other queries
    return {
      text: `Analysis for your query: "${query}"`,
      tokenData: {
        price: "$0.12",
        priceChange24h: "-2.5%",
        marketCap: "$1.2M",
        volume24h: "$50K",
        liquidity: "$100K"
      },
      riskLevel: "medium",
      riskFactors: [
        "Low liquidity pool",
        "High price volatility"
      ]
    };
  } catch (error) {
    console.error('Error in queryCryptoGuardians:', error);
    throw error;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Chat endpoint
  app.post("/api/chat", async (req, res) => {
    const schema = z.object({
      query: z.string().min(1)
    });

    try {
      const { query } = schema.parse(req.body);
      const aiResponse = await queryCryptoGuardians(query);
      res.json(aiResponse);
    } catch (error) {
      console.error('API Error:', error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Invalid request" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}