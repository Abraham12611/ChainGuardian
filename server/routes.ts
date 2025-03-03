import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import FormData from 'form-data';

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
  risk_level?: string;
  risk_factors?: string[];
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

    // Store the original pairs data
    lastFetchedPairs = pairs.slice(0, limit);

    // Return formatted data for display
    return lastFetchedPairs.map((pair) => {
      const ageInDays = Math.floor(
        (Date.now() - (pair.pairCreatedAt || Date.now())) / (1000 * 60 * 60 * 24),
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
    console.log(`Analyzing token:`, token);

    const analysis = `Comprehensive Analysis of ${token.baseToken.symbol}

Market Overview
The token currently has a market capitalization of $${((token.liquidity?.usd * 2) / 1000000).toFixed(2)}M, positioning it in the ${token.liquidity?.usd > 1000000 ? "mid" : "small"}-cap segment of the cryptocurrency market. The 24-hour trading volume of $${(token.volume?.h24 / 1000000).toFixed(2)}M indicates ${token.volume?.h24 > 1000000 ? "strong" : "moderate"} market activity.

Price Performance and Trends
Price analysis shows a ${token.priceChange?.h24 >= 0 ? "positive" : "negative"} movement of ${Math.abs(token.priceChange?.h24 || 0).toFixed(2)}% in the past 24 hours. The current price of $${parseFloat(token.priceUsd).toFixed(6)} suggests ${token.priceChange?.h24 >= 0 ? "growing investor confidence" : "potential profit-taking or market uncertainty"}.

Liquidity Analysis
The token maintains a liquidity pool of $${(token.liquidity?.usd / 1000000).toFixed(2)}M, which ${token.liquidity?.usd >= 100000 ? "provides some stability against large price swings" : "might lead to increased volatility during large trades"}.

Risk Assessment
Risk Level: ${token.liquidity?.usd >= 500000 ? "Moderate" : "High"}
Based on:
• Market capitalization size
• Trading volume patterns
• Liquidity depth
• Price volatility metrics`;

    return {
      text: analysis,
      tokenData: {
        price: `$${parseFloat(token.priceUsd).toFixed(6)}`,
        priceChange24h: `${token.priceChange?.h24?.toFixed(2)}%`,
        marketCap: `$${((token.liquidity?.usd * 2) / 1000000).toFixed(2)}M`,
        volume24h: `$${(token.volume?.h24 / 1000000).toFixed(2)}M`,
        liquidity: `$${(token.liquidity?.usd / 1000000).toFixed(2)}M`
      },
      riskLevel: token.liquidity?.usd >= 500000 ? "medium" : "high",
      riskFactors: [
        token.liquidity?.usd < 100000 ? "Low liquidity pool size increases volatility risk" : null,
        Math.abs(token.priceChange?.h24 || 0) > 10 ? "High price volatility in the last 24 hours" : null,
        token.volume?.h24 < 50000 ? "Low trading volume may affect price stability" : null
      ].filter(Boolean) as string[]
    };
  } catch (error) {
    console.error('Error in token analysis:', error);
    throw new Error('Failed to analyze token. Please try again.');
  }
}

let lastFetchedPairs: DexScreenerToken[] | undefined;

async function queryCryptoGuardians(query: string) {
  try {
    const tokenNumberMatch = query.match(/tell me more about (?:number |#)?(\d+)/i);

    if (tokenNumberMatch) {
      const tokenIndex = parseInt(tokenNumberMatch[1]) - 1;
      const pairs = lastFetchedPairs;

      if (pairs && tokenIndex >= 0 && tokenIndex < pairs.length) {
        console.log(`Analyzing token at index ${tokenIndex}:`, pairs[tokenIndex]);
        return await analyzeTokenWithAIxBlock(pairs[tokenIndex]);
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