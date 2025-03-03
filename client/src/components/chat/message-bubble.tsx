import { format } from "date-fns";
import { type Message, type TokenData, type TokenListItem } from "@shared/schema";
import TokenStats from "../token/token-stats";
import TokenList from "../token/token-list";
import { AlertTriangle } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
}

interface MessageMetadata {
  tokenData?: TokenData;
  tokenList?: TokenListItem[];
  riskLevel?: "low" | "medium" | "high";
  riskFactors?: string[];
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isAI = message.sender === "ai";
  const metadata = message.metadata as MessageMetadata;

  return (
    <div className={`flex ${isAI ? "justify-start" : "justify-end"} w-full`}>
      <div className={`
        w-full rounded-lg p-3
        ${isAI ? "bg-secondary" : "bg-primary text-primary-foreground"}
      `}>
        <div className="text-sm mb-3">{message.content}</div>

        {isAI && metadata?.tokenData && (
          <div className="mt-3">
            <TokenStats 
              tokenData={metadata.tokenData}
              riskLevel={metadata.riskLevel}
            />

            {metadata.riskFactors && metadata.riskFactors.length > 0 && (
              <div className="mt-2 text-xs">
                <div className="flex items-center gap-1 text-destructive mb-1">
                  <AlertTriangle className="h-4 w-4" />
                  Risk Factors:
                </div>
                <ul className="list-disc list-inside space-y-1">
                  {metadata.riskFactors.map((factor, index) => (
                    <li key={index}>{factor}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {isAI && metadata?.tokenList && (
          <div className="mt-3 w-full">
            <TokenList tokens={metadata.tokenList} />
          </div>
        )}

        <div className="text-xs text-muted-foreground mt-2">
          {format(new Date(message.timestamp), "HH:mm")}
        </div>
      </div>
    </div>
  );
}