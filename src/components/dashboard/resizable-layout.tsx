'use client'

import React from "react"
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable"

interface ResizableLayoutProps {
  explorer: React.ReactNode
  chat: React.ReactNode
}

export function ResizableLayout({ explorer, chat }: ResizableLayoutProps) {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full w-full bg-gradient-to-br from-amber-50/40 via-background to-emerald-50/40 dark:from-emerald-950/40"
    >
      {/* Left Panel: Explorer */}
      <ResizablePanel
        defaultSize={55}
        minSize={15}
        
        className="bg-card/60 backdrop-blur-sm border-r border-border/50"
      >
        <div className="h-full w-full overflow-hidden">
          {explorer}
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      {/* Right Panel: Chat */}
      <ResizablePanel defaultSize={45} minSize={40}>
        <div className="h-full w-full relative">
          {chat}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
