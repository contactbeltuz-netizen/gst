import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Zap, BrainCircuit, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Markdown from "react-markdown";

interface Message {
  role: "user" | "model";
  text: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", text: "Hello! I am your MyGST Solution AI Consultant. How can I assist you with your tax or GST compliance today?" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"fast" | "general" | "deep">("general");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const newMessages = [...messages, { role: "user" as const, text: inputValue }];
    setMessages(newMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
          speedConfig: mode
        })
      });

      if (!response.ok) throw new Error("Failed to connect");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");

      let currentModelText = "";
      
      setMessages(prev => [...prev, { role: "model", text: "" }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n\n"); // Split by double newline as per SSE standard
          
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const dataStr = line.slice(6).trim();
              if (dataStr === "[DONE]") {
                break;
              }
              if (!dataStr) continue;
              
              try {
                const data = JSON.parse(dataStr);
                if (data.text) {
                  // Realistic typing effect
                  for (let i = 0; i < data.text.length; i++) {
                    currentModelText += data.text[i];
                    setMessages(prev => {
                      const updated = [...prev];
                      updated[updated.length - 1].text = currentModelText;
                      return updated;
                    });
                    // Small delay to simulate realistic processing/typing
                    await new Promise(r => setTimeout(r, 10 + Math.random() * 15));
                  }
                }
                if (data.error) {
                    currentModelText += `\n**Error:** ${data.error}`;
                    setMessages(prev => {
                        const updated = [...prev];
                        updated[updated.length - 1].text = currentModelText;
                        return updated;
                    });
                }
              } catch (e) {
                console.error("Error parsing chunk", e, dataStr);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: "model", text: "Sorry, there was an error connecting to our advisory AI." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-900 p-4 rounded-full shadow-lg shadow-amber-500/20 flex items-center justify-center transition-colors"
            >
              <MessageSquare className="w-6 h-6" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Chat Window Popup */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-0 right-0 w-[350px] sm:w-[400px] h-[500px] sm:h-[600px] max-h-[80vh] bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden ring-1 ring-white/10"
            >
              {/* Header */}
              <div className="bg-slate-800 p-4 border-b border-slate-700/50 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-amber-500/20 p-2 rounded-lg">
                      <Bot className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium text-sm">GST Advisory AI</h3>
                      <p className="text-slate-400 text-xs">Powered by Gemini</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="text-slate-400 hover:text-white transition-colors p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Configuration Selector */}
                <div className="flex bg-slate-900 rounded-lg p-1 text-xs font-medium border border-slate-700/50">
                   <button
                    onClick={() => setMode("fast")}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md transition-colors ${mode === "fast" ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"}`}
                   >
                     <Zap className="w-3.5 h-3.5" />
                     Fast
                   </button>
                   <button
                    onClick={() => setMode("general")}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md transition-colors ${mode === "general" ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"}`}
                   >
                     <Sparkles className="w-3.5 h-3.5" />
                     General
                   </button>
                   <button
                    onClick={() => setMode("deep")}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md transition-colors ${mode === "deep" ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"}`}
                   >
                     <BrainCircuit className="w-3.5 h-3.5" />
                     Deep
                   </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "model" && (
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 border border-slate-700">
                        <Bot className="w-4 h-4 text-amber-400" />
                      </div>
                    )}
                    <div 
                      className={`max-w-[80%] rounded-2xl p-3 text-sm leading-relaxed ${
                        msg.role === "user" 
                          ? "bg-amber-500 text-slate-900 rounded-tr-sm" 
                          : "bg-slate-800 text-slate-200 rounded-tl-sm border border-slate-700"
                      }`}
                    >
                      {msg.role === "model" ? (
                        <div className="markdown-body text-sm space-y-2">
                            {msg.text ? <Markdown>{msg.text}</Markdown> : (
                              <div className="flex space-x-1 h-5 items-center px-1">
                                <motion.div className="w-1 bg-slate-400 rounded-full" animate={{ height: [4, 16, 4] }} transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut", delay: 0 }} />
                                <motion.div className="w-1 bg-slate-400 rounded-full" animate={{ height: [4, 20, 4] }} transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut", delay: 0.2 }} />
                                <motion.div className="w-1 bg-slate-400 rounded-full" animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut", delay: 0.4 }} />
                                <motion.div className="w-1 bg-slate-400 rounded-full" animate={{ height: [4, 18, 4] }} transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut", delay: 0.1 }} />
                              </div>
                            )}
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap">{msg.text}</div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-slate-800 border-t border-slate-700/50">
                <div className="relative">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about GST registration, filing, audits..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-4 pr-12 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 resize-none"
                    rows={1}
                    style={{ minHeight: '48px', maxHeight: '120px' }}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!inputValue.trim() || isLoading}
                    className="absolute right-2 bottom-2 p-1.5 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
