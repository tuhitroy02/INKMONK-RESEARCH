'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Message {
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: "Namaste! 🙏 Welcome to InkMonk Research.\n\n\"Research with care. Writing with clarity.\"\n\nI am your intelligent assistant running locally with no external APIs or telemetry. I can guide you through our research services, calculate transparent quotes, explain our methodology, or prepare an inquiry for our directors, Tuhit Roy and Sampreeti Mukherjee.\n\nWhat kind of academic assistance are you seeking today?",
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
    'Turnitin AI & Plagiarism Report',
    'Review Paper Writing',
    'Technical vs Non-Technical Advice',
  ]);
  const [context, setContext] = useState<Record<string, unknown>>({});
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMsg: Message = {
      sender: 'user',
      text: messageText,
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
          userMessage: messageText,
          context,
        }),
      });

      if (!res.ok) throw new Error('API request failed');

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
          text: "I encountered a minor network error. Please feel free to retry or contact us directly on WhatsApp at +91 7980470880 or email inkmonkresearch@gmail.com.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Top Info Banner */}
        <div className="gradient-navy rounded-2xl p-6 mb-6 text-white shadow-card flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 p-2 flex items-center justify-center backdrop-blur-sm border border-white/20">
              <Image
                src="/logo.png"
                alt="InkMonk Logo"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="font-serif text-xl sm:text-2xl font-bold">InkMonk AI Assistant</h1>
              <p className="text-white/70 text-xs sm:text-sm">
                100% Local Rule-Based Engine • Zero External API Keys • Private &amp; Deterministic
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href="/quote"
              className="text-xs bg-white/15 hover:bg-white/25 text-white font-semibold px-4 py-2 rounded-xl border border-white/20 transition-all"
            >
              Manual Quote Form
            </Link>
            <a
              href="https://wa.me/917980470880"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp text-xs py-2 px-4 shadow-sm"
            >
              WhatsApp Support
            </a>
          </div>
        </div>

        {/* Chat Window */}
        <div className="bg-white rounded-2xl shadow-card border border-ink-100 flex flex-col h-[650px] overflow-hidden">

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#FAF8F5] scrollbar-thin">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-end gap-2 max-w-[85%]">
                  {m.sender === 'bot' && (
                    <div className="w-7 h-7 rounded-full gradient-orange text-white text-xs font-bold flex items-center justify-center shrink-0 mb-1">
                      IM
                    </div>
                  )}
                  <div
                    className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      m.sender === 'user'
                        ? 'chat-bubble-user text-white'
                        : 'chat-bubble-bot text-ink-900 border border-ink-200'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{m.text}</div>
                  </div>
                </div>
                <span className="text-[11px] text-ink-400 mt-1 px-9">{m.time}</span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 p-3.5 bg-white rounded-2xl shadow-sm border border-ink-100 w-fit">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <span className="text-xs text-ink-500 ml-1">Assistant is reasoning...</span>
              </div>
            )}

            {whatsappUrl && (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center animate-fade-in my-2">
                <div className="text-emerald-800 font-semibold text-sm mb-2">
                  🎉 Your Quote is Ready for Instant WhatsApp Handover!
                </div>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp inline-flex items-center gap-2 text-sm py-2.5 px-6 shadow-md"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                  </svg>
                  Forward Directly to WhatsApp (+91 7980470880)
                </a>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Choice Buttons */}
          {options.length > 0 && !isLoading && (
            <div className="px-5 py-3 bg-white border-t border-ink-100 flex flex-wrap gap-2">
              <span className="text-xs text-ink-400 self-center mr-1">Suggested replies:</span>
              {options.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSend(opt)}
                  className="text-xs bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold px-3 py-1.5 rounded-full border border-orange-200 transition-all hover:scale-102"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="p-4 bg-white border-t border-ink-200 flex gap-3 items-center"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message, query, or academic discipline here..."
              className="flex-1 bg-ink-50 border border-ink-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 focus:bg-white text-ink-900"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="btn-primary py-3 px-6 text-sm disabled:opacity-40"
            >
              Send
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
