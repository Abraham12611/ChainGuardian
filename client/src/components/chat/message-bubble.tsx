import { format } from "date-fns";
import { type Message } from "@shared/schema";
import TokenStats from "../token/token-stats";
import { AlertTriangle } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isAI = message.sender === "ai";
  
  return (
    <div className={`flex ${isAI ? "justify-start" : "justify-end"}`}>
      <div className={`
        max-w-[80%] rounded-lg p-3
        ${isAI ? "bg-secondary" : "bg-primary text-primary-foreground"}
      `}>
        <div className="text-sm">{message.content}</div>
        
        {isAI && message.metadata?.tokenData && (
          <div className="mt-3">
            <TokenStats 
              tokenData={message.metadata.tokenData}
              riskLevel={message.metadata.riskLevel}
            />
            
            {message.metadata.riskFactors && message.metadata.riskFactors.length > 0 && (
              <div className="mt-2 text-xs">
                <div className="flex items-center gap-1 text-destructive mb-1">
                  <AlertTriangle className="h-4 w-4" />
                  Risk Factors:
                </div>
                <ul className="list-disc list-inside space-y-1">
                  {message.metadata.riskFactors.map((factor, i) => (
                    <li key={i}>{factor}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        
        <div className="text-xs text-muted-foreground mt-2">
          {format(new Date(message.timestamp), "HH:mm")}
        </div>
      </div>
    </div>
  );
}
