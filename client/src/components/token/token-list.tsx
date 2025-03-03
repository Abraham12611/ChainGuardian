import { type TokenListItem } from "@shared/schema";
import { TrendingUp, TrendingDown } from "lucide-react";

interface TokenListProps {
  tokens: TokenListItem[];
}

export default function TokenList({ tokens }: TokenListProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border/40">
            <th className="text-left py-2 px-4 text-muted-foreground font-normal">Name</th>
            <th className="text-right py-2 px-4 text-muted-foreground font-normal">Price</th>
            <th className="text-right py-2 px-4 text-muted-foreground font-normal">Age</th>
            <th className="text-right py-2 px-4 text-muted-foreground font-normal">Liquidity</th>
            <th className="text-right py-2 px-4 text-muted-foreground font-normal">MCAP</th>
            <th className="text-right py-2 px-4 text-muted-foreground font-normal">24H%</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token, index) => {
            const priceChange = parseFloat(token.priceChange24h);
            return (
              <tr key={index} className="hover:bg-accent/5">
                <td className="py-2 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{token.symbol}</span>
                    <span className="text-muted-foreground truncate">{token.name}</span>
                  </div>
                </td>
                <td className="py-2 px-4 text-right font-mono">
                  {token.price}
                </td>
                <td className="py-2 px-4 text-right text-muted-foreground">
                  {token.age}
                </td>
                <td className="py-2 px-4 text-right font-mono">
                  {token.liquidity}
                </td>
                <td className="py-2 px-4 text-right font-mono">
                  {token.marketCap}
                </td>
                <td className={`py-2 px-4 text-right flex items-center justify-end gap-1 ${
                  priceChange >= 0 ? "text-green-500" : "text-red-500"
                }`}>
                  {priceChange >= 0 ? 
                    <TrendingUp className="h-3 w-3" /> : 
                    <TrendingDown className="h-3 w-3" />
                  }
                  {token.priceChange24h}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}