'use client'

import React, { useState, useRef, useEffect } from 'react'
import { askAssistant } from '@/actions/chat-action'
import { SendIcon, UserIcon, SparklesIcon, MoonIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ReactMarkdown from 'react-markdown'

// ---------------------
// Types
// ---------------------
interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// ---------------------
// Markdown Renderer Component
// This takes raw markdown text and renders it as nice HTML
// ---------------------
function FormattedMessage({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => (
          <h1 className="text-lg font-bold mb-2 mt-1 text-foreground">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-base font-bold mb-2 mt-1 text-foreground">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-sm font-bold mb-1 mt-1 text-foreground">{children}</h3>
        ),
        p: ({ children }) => (
          <p className="mb-2 last:mb-0 leading-relaxed text-card-foreground/90">{children}</p>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-primary/90">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic text-card-foreground/70">{children}</em>
        ),
        ul: ({ children }) => (
          <ul className="list-disc list-inside mb-2 space-y-1 pl-1">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside mb-2 space-y-1 pl-1">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="leading-relaxed text-card-foreground/85">{children}</li>
        ),
        code: ({ children }) => (
          <code className="bg-secondary/10 text-secondary px-1.5 py-0.5 rounded text-[11px] font-mono border border-secondary/10">
            {children}
          </code>
        ),
        pre: ({ children }) => (
          <pre className="bg-black/30 border border-white/[0.06] rounded-xl p-3.5 mb-2 overflow-x-auto text-[11px] font-mono">
            {children}
          </pre>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto mb-2 rounded-xl border border-white/[0.08]">
            <table className="w-full text-[11px]">{children}</table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-white/[0.03] border-b border-white/[0.06]">{children}</thead>
        ),
        tbody: ({ children }) => (
          <tbody className="divide-y divide-white/[0.04]">{children}</tbody>
        ),
        tr: ({ children }) => (
          <tr className="hover:bg-white/[0.02] transition-colors">{children}</tr>
        ),
        th: ({ children }) => (
          <th className="px-3 py-2 text-left font-semibold text-foreground/80 text-[10px] uppercase tracking-wider">{children}</th>
        ),
        td: ({ children }) => (
          <td className="px-3 py-2 text-card-foreground/70">{children}</td>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-primary/40 pl-3 italic text-card-foreground/60 mb-2">
            {children}
          </blockquote>
        ),
        hr: () => (
          <hr className="my-3 border-white/[0.06]" />
        ),
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-secondary underline decoration-secondary/30 hover:decoration-secondary/60 transition-colors">
            {children}
          </a>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

// ---------------------
// Main Chat Panel
// ---------------------
export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initial Greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'init-1',
          role: 'assistant',
          content: 'Salam 🌙 Ramadan Kareem! How can I assist you with your preparations today?',
          timestamp: new Date(),
        }
      ])
    }
  }, [])

  // Auto-scroll when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const answer = await askAssistant(userMessage.content)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: answer,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'An error occurred while talking to the assistant.',
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full relative overflow-hidden">

      {/* Atmospheric Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/[0.03] via-transparent to-primary/[0.02] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[300px] h-[200px] bg-primary/[0.03] rounded-full blur-[100px] pointer-events-none" />

      {/* ─── CHAT HEADER ─── */}
      <div className="relative z-10 px-6 py-4 border-b border-white/[0.05]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-1 ring-primary/10">
            <MoonIcon className="w-3.5 h-3.5 text-primary fill-primary/30" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground tracking-tight">AI Assistant</h2>
            <p className="text-[10px] text-muted-foreground">Powered by your documents</p>
          </div>
        </div>
      </div>

      {/* ─── MESSAGES ─── */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5 z-10">
        {messages.map((message) => {
          const isUser = message.role === 'user'
          return (
            <div
              key={message.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${isUser
                  ? 'bg-secondary/15 ring-1 ring-secondary/20'
                  : 'bg-primary/10 ring-1 ring-primary/15'
                }`}>
                {isUser
                  ? <UserIcon className="w-3.5 h-3.5 text-secondary" />
                  : <MoonIcon className="w-3.5 h-3.5 text-primary fill-primary/30" />
                }
              </div>

              {/* Bubble */}
              <div
                className={`max-w-[78%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed ${isUser
                    ? 'bg-secondary/10 border border-secondary/10 text-foreground rounded-tr-sm'
                    : 'bg-white/[0.03] border border-white/[0.06] text-card-foreground rounded-tl-sm'
                  }`}
              >
                {isUser ? (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                ) : (
                  <FormattedMessage content={message.content} />
                )}
              </div>
            </div>
          )
        })}

        {/* Loading */}
        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary/10 ring-1 ring-primary/15 flex items-center justify-center">
              <SparklesIcon className="w-3.5 h-3.5 text-primary animate-pulse" />
            </div>
            <div className="bg-white/[0.03] border border-white/[0.06] px-4 py-2.5 rounded-2xl rounded-tl-sm">
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:0ms]" />
                <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:150ms]" />
                <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ─── INPUT ─── */}
      <div className="relative z-20 px-5 py-4 border-t border-white/[0.05] bg-card/30 backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about your documents..."
            className="flex-1 bg-white/[0.04] border border-white/[0.07] hover:border-white/[0.10] rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/25 focus:border-primary/20 transition-all"
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg shadow-primary/10 transition-all hover:shadow-primary/20 hover:scale-[1.03] disabled:opacity-30 disabled:hover:scale-100"
          >
            <SendIcon className="w-4 h-4" />
          </Button>
        </form>
        <p className="text-center text-[9px] text-muted-foreground/40 mt-2">AI can make mistakes. Verify important information.</p>
      </div>
    </div>
  )
}
