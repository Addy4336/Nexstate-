"use client";

import { brand } from "@nexstate/brand";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles, Home, Calculator, HelpCircle, Building2, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const quickActions = [
  { icon: Home, label: "Find properties", message: "Find a 2 bedroom apartment in Dubai Marina under 15000 AED" },
  { icon: Calculator, label: "Calculate ROI", message: "What is the expected rental yield ROI for a luxury apartment?" },
  { icon: Calendar, label: "Book a tour", message: "I want to schedule a property tour for tomorrow" },
  { icon: HelpCircle, label: "How it works", message: `How does ${brand.name} work?` },
];

interface ChatMessage {
  role: "assistant" | "user";
  content: string;
  toolUsed?: string;
  properties?: Array<{
    id: string;
    title: string;
    location: string;
    price: number;
    bedrooms: number;
  }>;
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: `Hi! I'm ${brand.name}'s AI Agent. Powered by Gemini & Vector Intelligence, I can search listings, calculate rental yields, or schedule property tours. How can I help you today?`
    }
  ]);
  const [input, setInput] = useState("");

  const processQuery = async (userText: string) => {
    setMessages((prev) => [...prev, { role: "user", content: userText }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.response || `Here are the results found by ${brand.name}:`,
            toolUsed: data.toolUsed,
            properties: data.properties || [],
          },
        ]);
      } else {
        throw new Error("Failed");
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Thank you for your message! I've logged your request. Feel free to browse our full listings catalog or submit an enquiry.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    if (!input.trim() || loading) return;
    const userText = input;
    setInput("");
    processQuery(userText);
  };

  const handleQuickAction = (message: string) => {
    if (loading) return;
    processQuery(message);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-primary text-primary-foreground shadow-xl flex items-center justify-center hover:scale-105 transition-transform"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="w-7 h-7" />
      </motion.button>

      {/* Chat Window Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[420px] max-w-[calc(100vw-32px)] bg-card rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-primary p-4 flex items-center justify-between text-primary-foreground">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{brand.name} AI Agent</h3>
                  <p className="text-xs opacity-80">Natural Language & Tool-Calling Copilot</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-primary-foreground/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="h-[360px] overflow-y-auto p-4 space-y-4 flex-1">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-secondary text-secondary-foreground rounded-bl-md"
                    }`}
                  >
                    {msg.toolUsed && (
                      <span className="inline-block px-2 py-0.5 mb-1.5 text-[10px] uppercase font-bold tracking-wider rounded bg-primary/10 text-primary">
                        Tool: {msg.toolUsed}
                      </span>
                    )}
                    <div>{msg.content}</div>
                  </div>

                  {/* Render Smart Property Cards */}
                  {msg.properties && msg.properties.length > 0 && (
                    <div className="w-full mt-3 space-y-2">
                      {msg.properties.map((prop) => (
                        <div
                          key={prop.id}
                          className="p-3 bg-muted/60 border border-border rounded-xl flex items-center justify-between text-xs hover:border-primary/50 transition-colors"
                        >
                          <div>
                            <div className="font-semibold flex items-center gap-1">
                              <Building2 className="w-3.5 h-3.5 text-primary" />
                              {prop.title}
                            </div>
                            <div className="text-muted-foreground flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3" />
                              {prop.location} • {prop.bedrooms} Bed
                            </div>
                          </div>
                          <div className="font-bold text-primary">
                            AED {prop.price?.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Sparkles className="w-4 h-4 animate-spin text-primary" />
                  {brand.name} AI Agent is running tool routines...
                </div>
              )}
            </div>

            {/* Quick Prompts */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-muted-foreground mb-2">Quick agent actions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => handleQuickAction(action.message)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs hover:bg-secondary/80 transition-colors"
                    >
                      <action.icon className="w-3 h-3 text-primary" />
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Bar */}
            <div className="p-4 border-t border-border bg-background">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={`Ask ${brand.name} to search, calculate, or book...`}
                  className="flex-1 px-4 py-2 rounded-xl bg-secondary text-foreground text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50"
                />
                <Button
                  onClick={handleSend}
                  className="px-4 rounded-xl"
                  disabled={!input.trim() || loading}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
