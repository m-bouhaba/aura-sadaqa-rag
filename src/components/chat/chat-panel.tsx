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
        // Headings — bold and slightly larger
        h1: ({ children }) => (
          <h1 className="text-lg font-bold mb-2 mt-1">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-base font-bold mb-2 mt-1">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-sm font-bold mb-1 mt-1">{children}</h3>
        ),

        // Paragraphs — normal text with spacing
        p: ({ children }) => (
          <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
        ),

        // Bold text
        strong: ({ children }) => (
          <strong className="font-semibold text-foreground">{children}</strong>
        ),

        // Italic text
        em: ({ children }) => (
          <em className="italic">{children}</em>
        ),

        // Unordered lists (bullet points)
        ul: ({ children }) => (
          <ul className="list-disc list-inside mb-2 space-y-1 pl-1">{children}</ul>
        ),

        // Ordered lists (numbered)
        ol: ({ children }) => (
          <ol className="list-decimal list-inside mb-2 space-y-1 pl-1">{children}</ol>
        ),

        // List items
        li: ({ children }) => (
          <li className="leading-relaxed">{children}</li>
        ),

        // Inline code (e.g. `variable`)
        code: ({ children }) => (
          <code className="bg-muted/70 text-primary px-1.5 py-0.5 rounded text-xs font-mono">
            {children}
          </code>
        ),

        // Code blocks (```)
        pre: ({ children }) => (
          <pre className="bg-muted/50 border border-border rounded-lg p-3 mb-2 overflow-x-auto text-xs font-mono">
            {children}
          </pre>
        ),

        // Tables — clean and readable
        table: ({ children }) => (
          <div className="overflow-x-auto mb-2 rounded-lg border border-border">
            <table className="w-full text-xs">{children}</table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-muted/60 border-b border-border">{children}</thead>
        ),
        tbody: ({ children }) => (
          <tbody className="divide-y divide-border/50">{children}</tbody>
        ),
        tr: ({ children }) => (
          <tr className="hover:bg-muted/30 transition-colors">{children}</tr>
        ),
        th: ({ children }) => (
          <th className="px-3 py-2 text-left font-semibold text-foreground">{children}</th>
        ),
        td: ({ children }) => (
          <td className="px-3 py-2 text-muted-foreground">{children}</td>
        ),

        // Blockquotes
        blockquote: ({ children }) => (
          <blockquote className="border-l-3 border-primary/50 pl-3 italic text-muted-foreground mb-2">
            {children}
          </blockquote>
        ),

        // Horizontal rule
        hr: () => (
          <hr className="my-3 border-border/50" />
        ),

        // Links
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80 transition-colors">
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
    <div className="flex flex-col h-full bg-background relative">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-[url('/islamic-pattern-opacity.png')] bg-repeat opacity-[0.03] pointer-events-none" />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 z-10">
        {messages.map((message) => {
          const isUser = message.role === 'user'
          return (
            <div
              key={message.id}
              className={`flex items-end gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isUser ? 'bg-secondary text-secondary-foreground' : 'bg-primary text-primary-foreground'
                }`}>
                {isUser ? <UserIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5 fill-current" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-sm text-sm ${isUser
                    ? 'bg-secondary text-secondary-foreground rounded-br-none'
                    : 'bg-card border border-border text-foreground rounded-bl-none'
                  }`}
              >
                {/* 
                  KEY CHANGE: 
                  - User messages = plain text (no markdown needed)
                  - Assistant messages = rendered as formatted markdown
                */}
                {isUser ? (
                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                ) : (
                  <FormattedMessage content={message.content} />
                )}
              </div>
            </div>
          )
        })}

        {/* Loading Animation */}
        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
              <SparklesIcon className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-card px-4 py-2 rounded-lg border border-border shadow-sm">
              <span className="text-xs text-muted-foreground flex gap-1">
                <span className="animate-bounce delay-0">.</span>
                <span className="animate-bounce delay-150">.</span>
                <span className="animate-bounce delay-300">.</span>
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-card/80 backdrop-blur-md border-t border-border z-20">
        <form onSubmit={handleSubmit} className="relative flex items-center gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about the uploaded documents..."
            className="flex-1 bg-muted/50 hover:bg-muted transition-colors border-0 rounded-full px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-inner"
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-110"
          >
            <SendIcon className="w-5 h-5 ml-0.5" />
          </Button>
        </form>
        <div className="text-center mt-2">
          <p className="text-[10px] text-muted-foreground opacity-60">AI can make mistakes. Please verify important information.</p>
        </div>
      </div>
    </div>
  )
}
