"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowDown01Icon,
  Layout01Icon,
  PackageIcon,
  ChartLineData01Icon,
  Settings02Icon,
  ActivityIcon,
  Database01Icon,
  Calendar01Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navItems = [
  {
    title: "Overview",
    href: "/",
    icon: Layout01Icon,
  },
  {
    title: "Calendar",
    href: "/calendar",
    icon: Calendar01Icon,
  },
  {
    title: "Deployments",
    href: "/deployments",
    icon: PackageIcon,
  },
  {
    title: "Activity",
    href: "/activity",
    icon: ActivityIcon,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: ChartLineData01Icon,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings02Icon,
  },
];

export function ContextBar() {
  const pathname = usePathname()

  return (
    <div className="border-b bg-background">
      <div className="container mx-auto w-full max-w-7xl px-4 md:px-8">
        <div className="flex h-14 items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" className="h-9 gap-2 px-2 font-semibold hover:bg-muted/50">
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/10 text-primary">
                    <span className="text-[10px] font-bold">NX</span>
                  </div>
                  nexus-dashboard
                  <HugeiconsIcon icon={ArrowDown01Icon} size={14} className="text-muted-foreground" />
                </Button>
              }
            />
            <DropdownMenuContent align="start" className="w-[200px]">
              <DropdownMenuItem className="font-medium">nexus-dashboard</DropdownMenuItem>
              <DropdownMenuItem className="text-muted-foreground">nexus-api</DropdownMenuItem>
              <DropdownMenuItem className="text-muted-foreground">nexus-web</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="h-4 w-px bg-border" />
          
          <div className="flex items-center gap-2">
            <div className="flex h-5 items-center rounded-full bg-muted px-2 text-[10px] font-medium text-muted-foreground">
              Production
            </div>
          </div>
        </div>
        
        <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex h-10 items-center gap-2 px-3 text-sm font-medium transition-colors hover:text-foreground",
                pathname === item.href 
                  ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-primary" 
                  : "text-muted-foreground"
              )}
            >
              <HugeiconsIcon icon={item.icon} size={16} />
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
