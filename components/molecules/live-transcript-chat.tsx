'use client';

import { useEffect, useRef, useCallback } from 'react';

export type LiveTranscriptMessage = {
  id: string;
  role: 'agent' | 'user';
  text: string;
  ts: number;
};

interface LiveTranscriptChatProps {
  title?: string;
  messages: LiveTranscriptMessage[];
}

export default function LiveTranscriptChat({ title = 'Call Transcript', messages }: LiveTranscriptChatProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isUserScrollingRef = useRef(false);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const { scrollTop, scrollHeight, clientHeight } = container;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 50;
    
    // If user scrolled up from bottom, they're manually scrolling
    if (!isAtBottom) {
      isUserScrollingRef.current = true;
    } else {
      // If they're back at bottom, resume auto-scroll
      isUserScrollingRef.current = false;
    }
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive, unless user is manually scrolling
    if (!isUserScrollingRef.current && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="h-full w-full flex flex-col">
      <div className="px-4 py-3 border-b font-semibold text-gray-800 bg-white">{title}</div>
      <div 
        ref={containerRef} 
        onScroll={handleScroll} 
        className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3 bg-gray-50"
        style={{ scrollBehavior: 'smooth' }}
      >
        {messages.map((m) => (
          <div key={m.id} className={`max-w-[92%] md:max-w-[85%] ${m.role === 'agent' ? 'mr-auto' : 'ml-auto'}`}>
            <div className={`px-4 py-3 rounded-2xl shadow-sm ${m.role === 'agent' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900 border'}`}>
              <div className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} className="h-16" /> {/* Added height to ensure last message is visible */}
      </div>
    </div>
  );
}


