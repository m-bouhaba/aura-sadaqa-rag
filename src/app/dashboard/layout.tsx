import React from "react"
import { Moon, Bell, Settings, Search } from "lucide-react"
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

      {/* Global Header */}
      <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-50 relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
            <Moon className="w-6 h-6 text-primary fill-primary/20" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight leading-none text-foreground">Aura Sadaqa</h1>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Ramadan 1447</p>
          </div>
        </div>

        

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Bell className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Settings className="w-5 h-5" />
          </Button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary ml-2 border-2 border-background shadow-lg" />
        </div>
      </header>

      {/* Main Content using Resizable Panels */}
      <main className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-50 pointer-events-none" />

        {/* Using the Client Component Wrapper */}
        <ResizableLayout explorer={explorer} chat={chat} />

      </main>
    </div>
  )
}
