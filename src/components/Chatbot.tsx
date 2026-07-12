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
  const [chatUser, setChatUser] = useState<{ name: string; email: string; phone: string } | null>(() => {
    const saved = localStorage.getItem("chat_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [onboardingStep, setOnboardingStep] = useState<"GREETING" | "QUESTION" | "EMAIL" | "PHONE" | "COMPLETED">(() => {
    const saved = localStorage.getItem("chat_user");
    return saved ? "COMPLETED" : "GREETING";
  });
  const [initialQuestion, setInitialQuestion] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"fast" | "general" | "deep">("general");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const typeSystemMessage = async (
    userText: string | null,
    fullModelText: string,
    onComplete?: () => void
  ) => {
    setIsLoading(true);
    if (userText !== null) {
      setMessages(prev => [...prev, { role: "user" as const, text: userText }]);
      await new Promise(r => setTimeout(r, 450));
    }
    
    setMessages(prev => [...prev, { role: "model" as const, text: "" }]);
    
    let currentText = "";
    for (let i = 0; i < fullModelText.length; i++) {
      currentText += fullModelText[i];
      setMessages(prev => {
        const copy = [...prev];
        if (copy.length > 0) {
          copy[copy.length - 1] = { role: "model" as const, text: currentText };
        }
        return copy;
      });
      // Standard elegant character typing speed
      await new Promise(r => setTimeout(r, 15 + Math.random() * 10));
    }
    
    setMessages(prev => {
      const copy = [...prev];
      if (copy.length > 0) {
        copy[copy.length - 1] = { role: "model" as const, text: fullModelText };
      }
      return copy;
    });

    setIsLoading(false);
    if (onComplete) {
      onComplete();
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    let active = true;
    if (isOpen && messages.length === 0) {
      const triggerHello = async () => {
        // Natural duration for typing dots before starting
        await new Promise(r => setTimeout(r, 450));
        if (!active) return;
        await typeSystemMessage(null, "Hello");
      };
      triggerHello();
    }
    return () => {
      active = false;
    };
  }, [isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const typedValue = inputValue.trim();

    if (onboardingStep === "GREETING") {
      setInputValue("");
      await typeSystemMessage(
        typedValue,
        "Welcome to MyGST Solution. I am your AI tax and compliance assistant Manager.\n\nTo get started, **what specific GST question or concern can I help you with today?**",
        () => setOnboardingStep("QUESTION")
      );
      return;
    }

    if (onboardingStep === "QUESTION") {
      setInitialQuestion(typedValue);
      setInputValue("");
      await typeSystemMessage(
        typedValue,
        "I can certainly help you with that! To make sure I can mail you a full **Chat Transcript** of our session along with reference links, could you please enter your **Email ID**?",
        () => setOnboardingStep("EMAIL")
      );
      return;
    }

    if (onboardingStep === "EMAIL") {
      if (!typedValue.includes("@") || typedValue.length < 5) {
        setInputValue("");
        await typeSystemMessage(
          typedValue,
          "That doesn't look like a valid email address. Please enter a valid Email ID (e.g. name@example.com) so we can send the chat transcript."
        );
        return;
      }
      setUserEmail(typedValue);
      setInputValue("");
      await typeSystemMessage(
        typedValue,
        "Perfect! And what **Phone Number** or **WhatsApp ID** can our team use to send you a quick follow-up or updates after our chat?",
        () => setOnboardingStep("PHONE")
      );
      return;
    }

    if (onboardingStep === "PHONE") {
      const cleanPhone = typedValue.replace(/\D/g, "");
      if (cleanPhone.length < 6) {
        setInputValue("");
        await typeSystemMessage(
          typedValue,
          "Please share a valid Phone Number or WhatsApp ID (at least 6 digits) so we can stay connected."
        );
        return;
      }
      setInputValue("");

      await typeSystemMessage(
        typedValue,
        "Excellent! Registering your advisory session and activating our GST AI Expert to analyze your query...",
        async () => {
          setIsLoading(true);
          try {
            // Submit lead to the backend API so it shows on the Admin Dashboard instantly!
            await fetch("/api/submit-lead", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: `Chat Client (${typedValue})`,
                email: userEmail,
                phone: typedValue,
                service: `GST Chat: ${initialQuestion.substring(0, 40)}${initialQuestion.length > 40 ? "..." : ""}`,
                business_type: "Small Business (SME)"
              })
            });

            // Save to localStorage
            const userData = { name: "Chat Client", email: userEmail, phone: typedValue };
            localStorage.setItem("chat_user", JSON.stringify(userData));
            setChatUser(userData);

            // Transition to completed normal chat
            setOnboardingStep("COMPLETED");

            // Now trigger the AI response for the user's initial question!
            const aiPayload = [
              { role: "user", parts: [{ text: initialQuestion }] }
            ];

            const response = await fetch("/api/chat", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                messages: aiPayload,
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
                const lines = chunk.split("\n\n");
                
                for (const line of lines) {
                  if (line.startsWith("data: ")) {
                    const dataStr = line.slice(6).trim();
                    if (dataStr === "[DONE]") break;
                    if (!dataStr) continue;
                    
                    try {
                      const data = JSON.parse(dataStr);
                      if (data.text) {
                        for (let i = 0; i < data.text.length; i++) {
                          currentModelText += data.text[i];
                          setMessages(prev => {
                            const updated = [...prev];
                            updated[updated.length - 1].text = currentModelText;
                            return updated;
                          });
                          await new Promise(r => setTimeout(r, 6 + Math.random() * 8));
                        }
                      }
                    } catch (e) {
                      console.error(e);
                    }
                  }
                }
              }
            }
          } catch (err) {
            console.error(err);
            setMessages(prev => [
              ...prev,
              { role: "model", text: "Contact information received! Let's start the consultation. Please ask me any details about your GST query!" }
            ]);
          } finally {
            setIsLoading(false);
          }
        }
      );
      return;
    }

    // Normal conversation flow (onboardingStep === "COMPLETED")
    const newMessages = [...messages, { role: "user" as const, text: typedValue }];
    setMessages(newMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      // Filter onboarding messages to keep chat history clean
      const relevantMessages = newMessages.filter(m => {
        const t = m.text.toLowerCase();
        return !t.includes("transcript") && !t.includes("phone number") && !t.includes("registering your consultation");
      });

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: relevantMessages.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
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
          const lines = chunk.split("\n\n");
          
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
                  for (let i = 0; i < data.text.length; i++) {
                    currentModelText += data.text[i];
                    setMessages(prev => {
                      const updated = [...prev];
                      updated[updated.length - 1].text = currentModelText;
                      return updated;
                    });
                    await new Promise(r => setTimeout(r, 6 + Math.random() * 8));
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

  const handleResetChat = () => {
    localStorage.removeItem("chat_user");
    setChatUser(null);
    setInitialQuestion("");
    setUserEmail("");
    setOnboardingStep("GREETING");
    setMessages([]);
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
                      {onboardingStep === "COMPLETED" && chatUser ? (
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <p className="text-amber-400 text-[10px] font-mono tracking-wide truncate max-w-[130px]">
                            Chatting as: {chatUser.name}
                          </p>
                          <button
                            onClick={handleResetChat}
                            className="text-slate-500 hover:text-rose-400 text-[9px] underline transition-colors"
                          >
                            (Reset)
                          </button>
                        </div>
                      ) : onboardingStep !== "QUESTION" ? (
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <p className="text-amber-500/80 text-[10px] font-medium animate-pulse">
                            Onboarding...
                          </p>
                          <button
                            onClick={handleResetChat}
                            className="text-slate-500 hover:text-rose-400 text-[9px] underline transition-colors"
                          >
                            (Restart)
                          </button>
                        </div>
                      ) : (
                        <p className="text-slate-400 text-xs">Powered by Gemini</p>
                      )}
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
                    placeholder={
                      onboardingStep === "GREETING" ? "Type your message here to start..." :
                      onboardingStep === "QUESTION" ? "Type your specific question..." :
                      onboardingStep === "EMAIL" ? "Type your email address..." :
                      onboardingStep === "PHONE" ? "Type your phone number..." :
                      "Ask about GST registration, filing, audits..."
                    }
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
