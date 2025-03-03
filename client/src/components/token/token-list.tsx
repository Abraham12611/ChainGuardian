import { type TokenListItem } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface TokenListProps {
  tokens: TokenListItem[];
}

export default function TokenList({ tokens }: TokenListProps) {
  return (
    <Card className="p-4 bg-card/50">
      {/* Header */}
      <div className="grid grid-cols-6 gap-4 text-sm text-muted-foreground mb-2 px-2">
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
            <div key={index} className="grid grid-cols-6 gap-4 p-2 hover:bg-accent/50 rounded-md text-sm">
              <div className="flex items-center">
                <span className="font-medium">{token.symbol}</span>
                <span className="text-muted-foreground ml-2 truncate">{token.name}</span>
              </div>

              <div className="text-right font-mono">
                {token.price}
              </div>

              <div className="text-right text-muted-foreground">
                {token.age || 'N/A'}
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
                  <TrendingUp className="h-4 w-4" /> : 
                  <TrendingDown className="h-4 w-4" />
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