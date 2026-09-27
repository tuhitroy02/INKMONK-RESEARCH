'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface Message {
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: "Namaste! 🙏 Welcome to InkMonk Research.\n\n\"Research with care. Writing with clarity.\"\n\nI am your intelligent assistant. I can guide you through our research services, calculate transparent quotes, or answer your academic writing questions. How may I assist you today?",
      time: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState('INIT');
  const [options, setOptions] = useState<string[]>([
    'Research Paper Writing',
    'Thesis Writing',
    'Book Writing',
    'Turnitin Report',
    'Other Inquiries',
  ]);
  const [context, setContext] = useState<Record<string, unknown>>({});
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state,
          userMessage: textToSend,
          context,
        }),
      });

      if (!res.ok) {
        throw new Error('Chat failed');
      }

      const data = await res.json();
      setState(data.nextState || state);
      setOptions(data.options || []);
      setContext(data.context || {});
      if (data.whatsappUrl) {
        setWhatsappUrl(data.whatsappUrl);
      }

      const botMsg: Message = {
        sender: 'bot',
        text: data.botMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: "I apologize, but I encountered a momentary connection issue. You can also reach our team directly at inkmonkresearch@gmail.com or WhatsApp +91 7980470880.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[540px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-ink-200 flex flex-col overflow-hidden mb-3 animate-fade-in transition-all">
          {/* Header */}
          <div className="gradient-navy p-4 flex items-center justify-between text-white shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full gradient-orange flex items-center justify-center font-serif font-bold text-white text-base shadow">
                IM
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm tracking-wide">InkMonk Assistant</h3>
                <div className="flex items-center gap-1.5 text-xs text-orange-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Deterministic Local AI (No Key)</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Link
                href="/chat"
                className="p-1.5 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition-colors"
                title="Full Page Chat"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAF8F5] scrollbar-thin">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`text-sm whitespace-pre-wrap leading-relaxed ${
                    m.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-ink-400 mt-1 px-1">{m.time}</span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-1.5 p-3 bg-white rounded-2xl w-fit shadow-sm border border-ink-100">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            )}

            {whatsappUrl && (
              <div className="pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp w-full justify-center text-xs py-2 shadow-md flex items-center gap-2"
                >
                  <span>Forward Quote to WhatsApp (+91 7980470880)</span>
                </a>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Options / Quick Buttons */}
          {options.length > 0 && !isLoading && (
            <div className="px-3 py-2 bg-white border-t border-ink-100 flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(opt)}
                  className="text-xs bg-orange-50 hover:bg-orange-100 text-orange-700 font-medium px-2.5 py-1 rounded-full border border-orange-200 transition-all hover:scale-102"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="p-3 bg-white border-t border-ink-200 flex gap-2 items-center"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything or enter details..."
              className="flex-1 bg-ink-50 border border-ink-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-500 focus:bg-white text-ink-900"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-9 h-9 rounded-xl gradient-orange text-white flex items-center justify-center disabled:opacity-40 transition-transform active:scale-95 shadow"
            >
              <svg className="w-4 h-4 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full gradient-orange text-white shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 border-2 border-white focus:outline-none"
        aria-label="Open InkMonk Assistant"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-orange-500 rounded-full"></span>
          </div>
        )}
      </button>
    </div>
  );
}
