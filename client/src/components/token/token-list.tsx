import { type TokenListItem } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface TokenListProps {
  tokens: TokenListItem[];
}

export default function TokenList({ tokens }: TokenListProps) {
  return (
    <div className="space-y-2">
      {tokens.map((token, index) => {
        const priceChange = parseFloat(token.priceChange24h);
        
        return (
          <Card key={index} className="p-3 bg-card/50">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{token.symbol}</span>
                  <span className="text-sm text-muted-foreground">{token.name}</span>
                </div>
                <div className="text-sm font-mono mt-1">{token.price}</div>
              </div>
              
              <div className="flex-1 text-right">
                <div className={`flex items-center justify-end gap-1 ${
                  priceChange >= 0 ? "text-green-500" : "text-red-500"
                }`}>
                  {priceChange >= 0 ? 
                    <TrendingUp className="h-4 w-4" /> : 
                    <TrendingDown className="h-4 w-4" />
                  }
                  {token.priceChange24h}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Vol: {token.volume24h} • Liq: {token.liquidity}
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
