'use client'

import React, { useState, useRef, useEffect } from 'react'
import { askAssistant } from '@/actions/chat-action'
import { SendIcon, BotIcon, UserIcon, SparklesIcon, MoonIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

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

  // Auto-scroll
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
      {/* Decorative Background for Chat Area */}
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

              {/* Bubble */}
              <div
                className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-sm text-sm leading-relaxed ${isUser
                    ? 'bg-secondary text-secondary-foreground rounded-br-none'
                    : 'bg-card border border-border text-foreground rounded-bl-none'
                  }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          )
        })}
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
