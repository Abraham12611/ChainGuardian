import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import MessageBubble from "./message-bubble";
import type { Message, AIResponse } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (query: string) => {
      const res = await apiRequest("POST", "/api/chat", { query });
      return res.json() as Promise<AIResponse>;
    },
    onSuccess: (data) => {
      const newMessage: Message = {
        id: messages.length + 2,
        content: data.text,
        sender: "ai",
        timestamp: new Date(),
        metadata: {
          tokenData: data.tokenData,
          tokenList: data.tokenList,
          riskLevel: data.riskLevel,
          riskFactors: data.riskFactors
        }
      };
      setMessages(prev => [...prev, newMessage]);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get response from AI. Please try again."
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || mutation.isPending) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      content: input,
      sender: "user",
      timestamp: new Date(),
      metadata: null
    };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    // Get AI response
    mutation.mutate(input);
  };

  return (
    <div className="flex flex-col h-[600px]">
      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-4 w-full">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {mutation.isPending && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
              CryptoGuardians is thinking...
            </div>
          )}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about any token..."
          disabled={mutation.isPending}
          className="flex-1"
        />
        <Button type="submit" disabled={mutation.isPending}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}