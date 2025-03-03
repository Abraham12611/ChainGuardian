import { Card } from "@/components/ui/card";
import ChatInterface from "@/components/chat/chat-interface";

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <Card className="p-4 md:p-6 bg-card">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">CryptoGuardians AI</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Ask questions about any cryptocurrency token
            </p>
          </div>
          
          <ChatInterface />
        </Card>
      </div>
    </div>
  );
}
