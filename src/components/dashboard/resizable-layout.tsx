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
      className="h-full w-full"
    >
      {/* Left Panel: Explorer */}
      <ResizablePanel
        defaultSize={55}
        minSize={15}
       
        className="bg-gradient-to-b from-card/80 via-card/60 to-card/40"
      >
        <div className="h-full w-full overflow-hidden">
          {explorer}
        </div>
      </ResizablePanel>

      {/* Resize Handle */}
      <ResizableHandle
        withHandle
        className="bg-transparent data-[panel-group-direction=horizontal]:w-px"
      />

      {/* Right Panel: Chat */}
      <ResizablePanel defaultSize={45} minSize={40}>
        <div className="h-full w-full relative">
          {chat}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
