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

interface AIxBlockResponse {
  analysis: string;
  recommendations?: string[];
}

async function fetchTopTokens(type: "gainers" | "losers", limit = 10) {
  try {
    const res = await fetch(
      "https://api.dexscreener.com/latest/dex/search?q=eth",
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "CryptoGuardians/1.0",
        },
      },
    );

    if (!res.ok) {
      console.error(`DexScreener API HTTP error: ${res.status}`);
      throw new Error(`DexScreener API error: ${res.status}`);
    }

    const data = await res.json();
    console.log("DexScreener API response:", JSON.stringify(data, null, 2));

    if (!data.pairs || !Array.isArray(data.pairs)) {
      console.error("Invalid response format from DexScreener:", data);
      throw new Error("Invalid response format from DexScreener");
    }

    let pairs = data.pairs as DexScreenerToken[];

    pairs = pairs.filter((pair) => {
      const liquidityUsd = pair.liquidity?.usd || 0;
      return liquidityUsd >= 10000;
    });

    pairs.sort((a, b) => {
      const changeA = a.priceChange?.h24 || 0;
      const changeB = b.priceChange?.h24 || 0;
      return type === "gainers" ? changeB - changeA : changeA - changeB;
    });

    const now = Date.now();

    return pairs.slice(0, limit).map((pair) => {
      const ageInDays = Math.floor(
        (now - (pair.pairCreatedAt || now)) / (1000 * 60 * 60 * 24),
      );
      return {
        name: pair.baseToken.name,
        symbol: pair.baseToken.symbol,
        price: `$${parseFloat(pair.priceUsd).toFixed(6)}`,
        age: ageInDays > 0 ? `${ageInDays}d` : "New",
        liquidity: `$${(pair.liquidity?.usd / 1000000).toFixed(2)}M`,
        marketCap: `$${((pair.liquidity?.usd * 2) / 1000000).toFixed(2)}M`,
        volume24h: `$${(pair.volume?.h24 / 1000000).toFixed(2)}M`,
        priceChange24h: `${pair.priceChange?.h24?.toFixed(2)}%`,
      };
    });
  } catch (error) {
    console.error("Error fetching top tokens:", error);
    throw error;
  }
}

async function analyzeTokenWithAIxBlock(token: DexScreenerToken) {
  try {
    const threadId = Math.random().toString(36).substring(7);
    const endpoint = `https://multiagent.aixblock.io/api/v1/execute/result/67c2c1f12d19ffc0bf96bbb1?thread_id=${threadId}`;

    const payload = {
      token_name: `${token.baseToken.name} (${token.baseToken.symbol})`,
      market_cap: token.marketCap ? token.marketCap.toString() : "Unknown",
      trade_volume_24h: token.volume?.h24?.toString() || "Unknown",
      price_trends: `${token.priceChange?.h24 > 0 ? "Upward" : "Downward"} trend with ${Math.abs(token.priceChange?.h24 || 0)}% change in 24h`,
      wallet_distribution: "Data not available",
      security_measures: "Standard token security features",
      webhook: "https://your-webhook-endpoint.com/aixblock-callback"
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`AIxBlock API error: ${res.status}`);
    }

    const data = await res.json();
    return {
      text: `Analysis for ${token.baseToken.symbol}:\n${data.analysis || 'Analysis not available'}`,
      tokenData: {
        price: token.priceUsd,
        priceChange24h: `${token.priceChange?.h24?.toFixed(2)}%`,
        marketCap: token.marketCap?.toString() || 'Unknown',
        volume24h: token.volume?.h24?.toString() || 'Unknown',
        liquidity: token.liquidity?.usd?.toString() || 'Unknown'
      }
    };
  } catch (error) {
    console.error('Error analyzing token with AIxBlock:', error);
    throw error;
  }
}

let lastFetchedPairs: DexScreenerToken[] | undefined; // Add global variable

async function queryCryptoGuardians(query: string) {
  try {
    const tokenNumberMatch = query.match(/tell me more about (?:number |#)?(\d+)/i);

    if (tokenNumberMatch) {
      const tokenIndex = parseInt(tokenNumberMatch[1]) - 1;
      const pairs = lastFetchedPairs || [];

      if (tokenIndex >= 0 && tokenIndex < pairs.length) {
        const token = pairs[tokenIndex];
        return await analyzeTokenWithAIxBlock(token);
      } else {
        return {
          text: "Sorry, I couldn't find that token in the list. Please make sure to reference a valid token number from the displayed list."
        };
      }
    }

    const isGainersQuery = /top.*gain|best.*perform|highest.*gain/i.test(query);
    const isLosersQuery = /top.*los|worst.*perform|biggest.*drop/i.test(query);

    if (isGainersQuery || isLosersQuery) {
      const type = isGainersQuery ? "gainers" : "losers";
      const tokens = await fetchTopTokens(type);
      lastFetchedPairs = tokens;
      return {
        text: `Here are the top 10 ${type} in the last 24 hours:`,
        tokenList: tokens
      };
    }

    return {
      text: `I'm not sure how to analyze that query. Try asking about top gainers/losers or specific tokens from the list.`
    };
  } catch (error) {
    console.error('Error in queryCryptoGuardians:', error);
    throw error;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/chat", async (req, res) => {
    const schema = z.object({
      query: z.string().min(1),
    });

    try {
      const { query } = schema.parse(req.body);
      const aiResponse = await queryCryptoGuardians(query);
      res.json(aiResponse);
    } catch (error) {
      console.error("API Error:", error);
      res.status(400).json({
        message: error instanceof Error ? error.message : "Invalid request",
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}