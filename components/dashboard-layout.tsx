"use client"

import * as React from "react"
import { SiteHeader } from "@/components/site-header"
import { ContextBar } from "@/components/context-bar"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col bg-muted/20">
      <SiteHeader />
      <ContextBar />
      <main className="flex-1">
        <div className="container mx-auto w-full max-w-7xl py-8 px-4 md:px-8">
          {children}
        </div>
      </main>
      <footer className="border-t bg-background py-6">
        <div className="container mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 md:h-16 md:flex-row px-4 md:px-8">
          <p className="text-sm text-muted-foreground">
            &copy; 2025 Nexus Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="#" className="hover:underline">Privacy</Link>
            <Link href="#" className="hover:underline">Terms</Link>
            <Link href="#" className="hover:underline">Status</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

import Link from "next/link"
