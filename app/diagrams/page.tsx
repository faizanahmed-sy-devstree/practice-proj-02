"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import dynamic from "next/dynamic"

const Tldraw = dynamic(async () => (await import("tldraw")).Tldraw, {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-muted/10">
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground font-medium">Loading whiteboard...</p>
      </div>
    </div>
  ),
})
import "tldraw/tldraw.css"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  PaintBrush01Icon, 
  Download01Icon, 
  Delete02Icon,
  ArrowReloadHorizontalIcon
} from "@hugeicons/core-free-icons"
import { toast } from "sonner"

export default function DiagramsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-12rem)] gap-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Diagrams & Whiteboard</h1>
            <p className="text-muted-foreground">
              Sketch ideas, draw diagrams, and visualize workflows.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => toast.info("Export feature coming soon!")}>
              <HugeiconsIcon icon={Download01Icon} size={18} className="mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="flex-1 min-h-0 border rounded-2xl bg-background overflow-hidden shadow-2xl relative">
          <div className="absolute inset-0">
            <Tldraw 
              inferDarkMode 
              persistenceKey="nexus-diagrams"
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
