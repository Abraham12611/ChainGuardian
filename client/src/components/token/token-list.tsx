import { type TokenListItem } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface TokenListProps {
  tokens: TokenListItem[];
}

export default function TokenList({ tokens }: TokenListProps) {
  return (
    <Card className="p-3 bg-background/50">
      {/* Header */}
      <div className="grid grid-cols-[2fr,1fr,1fr,1fr,1fr,1fr] gap-4 mb-4 text-xs text-muted-foreground">
        <div>Name</div>
        <div className="text-right">Price</div>
        <div className="text-right">Age</div>
        <div className="text-right">Liquidity</div>
        <div className="text-right">MCAP</div>
        <div className="text-right">24H%</div>
      </div>

      {/* Token List */}
      <div className="space-y-2">
        {tokens.map((token, index) => {
          const priceChange = parseFloat(token.priceChange24h);

          return (
            <div key={index} 
              className="grid grid-cols-[2fr,1fr,1fr,1fr,1fr,1fr] gap-4 py-2 text-xs hover:bg-accent/50 rounded-sm"
            >
              <div className="flex items-center space-x-2">
                <span className="font-medium">{token.symbol}</span>
                <span className="text-muted-foreground truncate">{token.name}</span>
              </div>

              <div className="text-right font-mono">
                {token.price}
              </div>

              <div className="text-right text-muted-foreground">
                {token.age}
              </div>

              <div className="text-right font-mono">
                {token.liquidity}
              </div>

              <div className="text-right font-mono">
                {token.marketCap}
              </div>

              <div className={`flex items-center justify-end gap-1 ${
                priceChange >= 0 ? "text-green-500" : "text-red-500"
              }`}>
                {priceChange >= 0 ? 
                  <TrendingUp className="h-3 w-3" /> : 
                  <TrendingDown className="h-3 w-3" />
                }
                {token.priceChange24h}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}