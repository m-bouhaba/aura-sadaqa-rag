'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, Moon } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-pattern pointer-events-none" />

      {/* Decorative Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[128px]" />

      <main className="container max-w-6xl px-4 py-16 flex flex-col items-center text-center z-10">

        {/* Hero Title */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          Ramadan <span className="text-primary">AI Assistant</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-xl text-muted-foreground max-w-2xl mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          Simplify your activities this holy month. Chat with your documents, organize schedules, and manage resources with our dedicated AI companion.
        </p>

        {/* CTA Button */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <Link href="/dashboard">
            <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:scale-105">
              Go to Dashboard
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>

        {/* Hero Image */}
        <div className="mt-16 w-full max-w-4xl relative animate-in fade-in zoom-in-95 duration-1000 delay-500">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-30" />
          <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-2xl">
            <Image
              src="/ramadan.png"
              alt="Ramadan Dashboard Preview"
              width={1200}
              height={675}
              className="w-full h-auto object-cover bg-card"
              priority
            />
            {/* Fallback placeholder if image is missing/loading */}
            <div className="absolute inset-0 flex items-center justify-center bg-card/50 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity duration-500">
              <div className="text-center">
                <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
                <p className="text-lg font-medium">Experience the serenity</p>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full py-6 mt-auto border-t border-border/40 text-center text-sm text-muted-foreground">
        <p>© 2026 Aura Sadaqa. Built with ❤️ for the Ummah.</p>
      </footer>
    </div>
  )
}