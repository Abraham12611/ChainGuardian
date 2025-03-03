import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

async function queryCryptoGuardians(query: string) {
  // Mock AI response for now - would be replaced with actual API call
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
}

async function fetchDexScreenerData(tokenAddress: string) {
  try {
    const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`);
    if (!res.ok) throw new Error("Failed to fetch token data");
    return await res.json();
  } catch (error) {
    console.error("DexScreener API error:", error);
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
      res.status(400).json({ message: "Invalid request" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
