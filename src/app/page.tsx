'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Moon } from 'lucide-react'
import { Sparkles } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden text-foreground">

      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover scale-105 blur-none"
      >
        <source src="/delete.mp4" type="video/mp4" />
      </video>

      {/* Overlays */}
      <div className="absolute inset-0 bg-black/65" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black/90" />

      {/* Content */}
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-4">

        <div className="mb-6 flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 backdrop-blur ring-1 ring-primary/30">
          <img
            src="/logo.png"   // ← mets ici le nom exact de ton image
            alt="Aura Sadaqa logo"
            width={150}
            height={150}
            className="object-contain"
           
          />
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-4">
          Ramadan <span className="text-primary">AI Assistant</span>
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-10">
          Upload your documents. Ask questions.
          Understand faster — powered by AI.
        </p>

        <Link href="/dashboard">
          <Button
            size="lg"
            className="h-14 px-10 text-lg rounded-full bg-primary hover:bg-primary/90 shadow-xl shadow-primary/30 transition-all hover:scale-105"
          >
            Go to Dashboard
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </main>

      <footer className="relative z-10 w-full py-6 text-center text-sm text-muted-foreground border-t border-white/10">
        © 2026 Aura Sadaqa — AI for meaningful impact
      </footer>
    </div>
  )
}
