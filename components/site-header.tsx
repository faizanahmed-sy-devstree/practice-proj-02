"use client"

import * as React from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  Search01Icon, 
  Notification03Icon, 
  UserCircleIcon,
  CommandIcon,
  AiCloudIcon,
  Menu01Icon
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Kbd } from "@/components/ui/kbd"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-4 md:gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <HugeiconsIcon icon={AiCloudIcon} size={20} strokeWidth={2.5} />
            </div>
            <span className="hidden font-bold sm:inline-block text-lg tracking-tight">
              Nexus
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Button variant="ghost" size="sm" className="h-8 px-3">Feedback</Button>
            <Button variant="ghost" size="sm" className="h-8 px-3 text-muted-foreground">Changelog</Button>
            <Button variant="ghost" size="sm" className="h-8 px-3 text-muted-foreground">Help</Button>
            <Button variant="ghost" size="sm" className="h-8 px-3 text-muted-foreground">Docs</Button>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end gap-4">
          <div className="relative hidden w-full max-w-[300px] md:flex">
            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
              <HugeiconsIcon icon={Search01Icon} size={16} />
            </div>
            <Input
              type="search"
              placeholder="Search..."
              className="h-9 w-full bg-muted/50 pl-9 pr-12 focus-visible:bg-background transition-all"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <Kbd className="h-5 px-1.5 text-[10px]">
                <HugeiconsIcon icon={CommandIcon} size={10} className="mr-0.5" />
                K
              </Kbd>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9 relative">
              <HugeiconsIcon icon={Notification03Icon} size={20} />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary border-2 border-background" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-8 w-8 border">
                      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                  </Button>
                }
              />
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">John Doe</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      john.doe@example.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <HugeiconsIcon icon={UserCircleIcon} size={16} className="mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="ghost" size="icon" className="h-9 w-9 md:hidden">
              <HugeiconsIcon icon={Menu01Icon} size={20} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
