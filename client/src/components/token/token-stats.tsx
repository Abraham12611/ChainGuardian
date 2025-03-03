import { Card } from "@/components/ui/card";
import { type TokenData } from "@shared/schema";
import { TrendingUp, TrendingDown } from "lucide-react";

interface TokenStatsProps {
  tokenData: TokenData;
  riskLevel?: "low" | "medium" | "high";
}

export default function TokenStats({ tokenData, riskLevel }: TokenStatsProps) {
  const priceChange = parseFloat(tokenData.priceChange24h);
  
  const getRiskColor = (level?: string) => {
    switch(level) {
      case "low": return "text-green-500";
      case "medium": return "text-yellow-500";
      case "high": return "text-red-500";
      default: return "text-muted-foreground";
    }
  };

  return (
    <Card className="p-3 bg-card/50">
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <div className="text-muted-foreground">Price</div>
          <div className="font-mono">{tokenData.price}</div>
        </div>
        
        <div>
          <div className="text-muted-foreground">24h Change</div>
          <div className={`flex items-center gap-1 ${priceChange >= 0 ? "text-green-500" : "text-red-500"}`}>
            {priceChange >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {tokenData.priceChange24h}
          </div>
        </div>
        
        <div>
          <div className="text-muted-foreground">Market Cap</div>
          <div className="font-mono">{tokenData.marketCap}</div>
        </div>
        
        <div>
          <div className="text-muted-foreground">24h Volume</div>
          <div className="font-mono">{tokenData.volume24h}</div>
        </div>
        
        <div>
          <div className="text-muted-foreground">Liquidity</div>
          <div className="font-mono">{tokenData.liquidity}</div>
        </div>
        
        <div>
          <div className="text-muted-foreground">Risk Level</div>
          <div className={`font-medium ${getRiskColor(riskLevel)}`}>
            {riskLevel ? riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1) : "N/A"}
          </div>
        </div>
      </div>
    </Card>
  );
}
