'use client'

import React from "react"
import { Bell, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ResizableLayout } from "@/components/dashboard/resizable-layout"

export default function DashboardLayout({
  children,
  chat,
  explorer,
}: {
  children: React.ReactNode
  chat: React.ReactNode
  explorer: React.ReactNode
}) {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden font-sans">

      {/* ─── HEADER ─── */}
      <header className="h-14 border-b border-white/[0.06] bg-background/80 backdrop-blur-2xl flex items-center justify-between px-6 shrink-0 z-50 relative">

        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-secondary/10 ring-1 ring-white/[0.06]">
            <img
              src="/logo.png"
              alt="Aura Sadaqa"
              className="object-contain w-6 h-6"
            />
          </div>
          <div>
            <h1 className="font-semibold text-sm tracking-tight leading-none text-foreground">
              Aura Sadaqa
            </h1>
            <p className="text-[9px] font-medium text-primary/70 uppercase tracking-[0.2em] mt-0.5">
              Ramadan 1447
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:text-foreground hover:bg-white/[0.04] rounded-lg transition-colors">
            <Bell className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:text-foreground hover:bg-white/[0.04] rounded-lg transition-colors">
            <Settings className="w-4 h-4" />
          </Button>
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary via-secondary to-primary ml-2 ring-2 ring-background shadow-lg" />
        </div>

      </header>

      {/* ─── MAIN WORKSPACE ─── */}
      <main className="flex-1 overflow-hidden relative p-3">

        {/* Background Atmosphere */}
        <div className="absolute inset-0 bg-pattern pointer-events-none z-0" />
        <div className="absolute top-0 left-1/3 w-[600px] h-[400px] bg-primary/[0.04] rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[350px] bg-secondary/[0.05] rounded-full blur-[130px] pointer-events-none" />

        {/* Workspace Container — the "premium glass card" */}
        <div className="relative z-10 h-full w-full rounded-2xl border border-white/[0.07] bg-card/40 backdrop-blur-xl overflow-hidden glow-indigo shadow-2xl shadow-black/40">
          <ResizableLayout explorer={explorer} chat={chat} />
        </div>

      </main>
    </div>
  )
}
