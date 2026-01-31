import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslations, useLanguageStore } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const GREETING_OPTIONS = [
  { id: "hospitality", label: "A hotel or hospitality project" },
  { id: "retail", label: "A retail or private label brand" },
  { id: "personal", label: "Personal or home use" },
];

export function ChatWidget() {
  const t = useTranslations();
  const { language } = useLanguageStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ role: "assistant", content: "Who are you selecting products for?" }]);
      setShowOptions(true);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const selectOption = async (option: string, label: string) => {
    setShowOptions(false);
    setMessages((prev) => [...prev, { role: "user", content: label }]);
    await sendMessage(label);
  };

  const sendMessage = async (overrideMessage?: string) => {
    const userMessage = overrideMessage || input.trim();
    if (!userMessage || isLoading) return;

    if (!overrideMessage) setInput("");
    if (!overrideMessage) setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMessage, 
          language,
          history: messages 
        }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let assistantMessage = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                assistantMessage += data.content;
                const displayContent = assistantMessage.replace(/:::LEAD_DATA\{.*?\}:::/, "");
                
                setMessages((prev) => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1] = {
                    role: "assistant",
                    content: displayContent,
                  };
                  return newMessages;
                });
              }
            } catch {}
          }
        }
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I encountered an error. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className="fixed bottom-24 right-4 sm:right-8 w-[calc(100vw-2rem)] sm:w-[380px] h-[500px] bg-white border border-stone-200 rounded-lg shadow-2xl flex flex-col z-[100]"
          >
            <div className="flex items-center justify-between p-6 border-b border-stone-100">
              <h3 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-stone-400">Consultant</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="hover:bg-stone-50 text-stone-400"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <ScrollArea className="flex-1 px-6 py-6" ref={scrollRef}>
              <div className="flex flex-col gap-6">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] px-4 py-3 text-[14px] leading-relaxed font-light ${
                        message.role === "user"
                          ? "bg-stone-100 text-stone-800 rounded-lg"
                          : "text-stone-600"
                      }`}
                    >
                      {message.content}
                      {message.role === "assistant" && index === 0 && showOptions && (
                        <div className="mt-6 flex flex-col gap-2">
                          {GREETING_OPTIONS.map((opt) => (
                            <button
                              key={opt.id}
                              onClick={() => selectOption(opt.id, opt.label)}
                              className="text-left w-full px-4 py-2 text-[13px] text-stone-500 border border-stone-200 rounded-md hover:border-stone-400 hover:text-stone-700 transition-all duration-300"
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && messages[messages.length - 1]?.role === "user" && (
                  <div className="flex justify-start">
                    <div className="px-4 py-3">
                      <Loader2 className="h-4 w-4 animate-spin text-stone-300" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-6 border-t border-stone-100">
              <div className="flex gap-3">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="h-10 text-[14px] font-light border-stone-200 focus-visible:ring-stone-400 focus-visible:ring-offset-0 rounded-none bg-stone-50/30"
                  disabled={isLoading}
                />
                <Button
                  size="icon"
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading}
                  className="h-10 w-10 bg-stone-800 hover:bg-stone-900 rounded-none"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 right-6 sm:right-8 flex flex-col items-end gap-3 z-[100] group">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="bg-white border border-stone-200 px-4 py-2 rounded shadow-sm">
            <p className="text-[11px] text-stone-500 font-light tracking-wide whitespace-nowrap">
              Get guidance on choosing the right textile
            </p>
          </div>
        </div>
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg bg-stone-100 hover:bg-stone-200 text-stone-600 border border-stone-200 transition-all duration-300 active:scale-95 no-default-hover-elevate no-default-active-elevate"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" strokeWidth={1.5} />}
        </Button>
      </div>
    </>
  );
}
