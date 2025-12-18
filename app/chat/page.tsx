"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  BubbleChatIcon,
  SearchIcon,
  MoreHorizontalIcon,
  UserIcon,
  AttachmentIcon,
  SmileIcon,
  MailSend01Icon,
  Video01Icon,
  CallIcon,
  Tick01Icon,
  TickDouble02Icon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

export default function ChatPage() {
  const [activeTab, setActiveTab] = React.useState("john")
  const [messages, setMessages] = React.useState<Record<string, any[]>>({
    john: [
      { text: "Hey! Did you see the new boilerplate updates?", me: false, time: "10:24 AM", status: "read" },
      { text: "Yeah, it looks amazing! The new patterns are really clean.", me: true, time: "10:25 AM", status: "read" },
      { text: "I'm working on the chat UI right now. What do you think about the glassmorphism?", me: true, time: "10:26 AM", status: "read" },
      { text: "I love it. Makes it feel very modern and premium.", me: false, time: "10:28 AM", status: "read" },
    ],
    sarah: [
      { text: "Can we review the design today?", me: false, time: "09:15 AM", status: "read" },
      { text: "Sure, let's jump on a call at 2 PM.", me: true, time: "09:20 AM", status: "read" },
    ],
    mike: [
      { text: "Sent you the project files for the new dashboard.", me: false, time: "Yesterday", status: "read" },
    ],
  })
  const [input, setInput] = React.useState("")
  const [isTyping, setIsTyping] = React.useState(false)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const send = () => {
    if (!input.trim()) return
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setMessages(prev => ({
      ...prev,
      [activeTab]: [...prev[activeTab], { text: input, me: true, time, status: "sent" }]
    }))
    setInput("")
    
    // Mock auto-reply
    setTimeout(() => {
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        setMessages(prev => ({
          ...prev,
          [activeTab]: [...prev[activeTab], { text: "That sounds like a plan! I'll get right on it.", me: false, time: "Just now", status: "read" }]
        }))
      }, 2500)
    }, 1500)
  }

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, activeTab, isTyping])

  const contacts = [
    { id: "john", name: "John Doe", last: "I love it. Makes it feel...", online: true, avatar: "JD", color: "bg-blue-500" },
    { id: "sarah", name: "Sarah Smith", last: "Sure, let's jump on a...", online: false, avatar: "SS", color: "bg-purple-500" },
    { id: "mike", name: "Mike Ross", last: "Sent you the project...", online: true, avatar: "MR", color: "bg-emerald-500" },
    { id: "anna", name: "Anna Wright", last: "See you tomorrow!", online: false, avatar: "AW", color: "bg-orange-500" },
  ]

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-8rem)] bg-card border-2 rounded-3xl overflow-hidden shadow-2xl">
        {/* Sidebar */}
        <div className="w-80 border-r flex flex-col bg-muted/10">
          <div className="p-6 border-b space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">Messages</h1>
              <Button variant="ghost" size="icon-sm" className="rounded-full bg-primary/10 text-primary">
                <HugeiconsIcon icon={BubbleChatIcon} size={16} />
              </Button>
            </div>
            <div className="relative">
              <HugeiconsIcon icon={SearchIcon} size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search conversations..." className="h-10 pl-9 bg-background/50 border-none shadow-inner" />
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-1">
              {contacts.map(user => (
                <button
                  key={user.id}
                  onClick={() => setActiveTab(user.id)}
                  className={cn(
                    "w-full p-3 rounded-2xl flex items-center gap-4 transition-all duration-300 group",
                    activeTab === user.id 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                      : "hover:bg-muted/50"
                  )}
                >
                  <div className="relative shrink-0">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-md", activeTab === user.id ? "bg-white/20" : user.color)}>
                      {user.avatar}
                    </div>
                    {user.online && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-card rounded-full" />
                    )}
                  </div>
                  <div className="text-left overflow-hidden flex-1">
                    <div className="flex justify-between items-center mb-0.5">
                      <p className="text-sm font-bold truncate">{user.name}</p>
                      <span className={cn("text-[10px]", activeTab === user.id ? "text-primary-foreground/70" : "text-muted-foreground")}>10:28 AM</span>
                    </div>
                    <p className={cn("text-xs truncate", activeTab === user.id ? "text-primary-foreground/80" : "text-muted-foreground")}>
                      {user.last}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-background/50 backdrop-blur-sm">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between bg-background/80 backdrop-blur-xl z-10">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md", contacts.find(c => c.id === activeTab)?.color)}>
                  {contacts.find(c => c.id === activeTab)?.avatar}
                </div>
                {contacts.find(c => c.id === activeTab)?.online && (
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-background rounded-full" />
                )}
              </div>
              <div>
                <p className="text-sm font-bold capitalize">{activeTab === "john" ? "John Doe" : activeTab === "sarah" ? "Sarah Smith" : "Mike Ross"}</p>
                <div className="flex items-center gap-1.5">
                  <div className={cn("w-1.5 h-1.5 rounded-full", contacts.find(c => c.id === activeTab)?.online ? "bg-emerald-500" : "bg-muted-foreground")} />
                  <p className="text-[10px] text-muted-foreground font-medium">
                    {contacts.find(c => c.id === activeTab)?.online ? "Active Now" : "Offline"}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="rounded-xl hover:bg-muted"><HugeiconsIcon icon={CallIcon} size={18} /></Button>
              <Button variant="ghost" size="icon" className="rounded-xl hover:bg-muted"><HugeiconsIcon icon={Video01Icon} size={18} /></Button>
              <div className="w-px h-6 bg-border mx-1" />
              <Button variant="ghost" size="icon" className="rounded-xl hover:bg-muted"><HugeiconsIcon icon={MoreHorizontalIcon} size={18} /></Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-6" viewportRef={scrollRef}>
            <div className="space-y-8 pb-4">
              <div className="flex justify-center">
                <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-widest bg-muted/50 px-4 py-1 rounded-full">Today</Badge>
              </div>
              {(messages[activeTab] || []).map((m, i) => (
                <div key={i} className={cn("flex flex-col gap-2", m.me ? "items-end" : "items-start")}>
                  <div className={cn(
                    "max-w-[70%] p-4 rounded-3xl text-sm shadow-sm relative group",
                    m.me 
                      ? "bg-primary text-primary-foreground rounded-tr-none" 
                      : "bg-card border rounded-tl-none"
                  )}>
                    {m.text}
                    <div className={cn(
                      "absolute bottom-[-20px] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
                      m.me ? "right-0" : "left-0"
                    )}>
                      <span className="text-[9px] text-muted-foreground font-medium">{m.time}</span>
                      {m.me && (
                        <HugeiconsIcon 
                          icon={m.status === "read" ? TickDouble02Icon : Tick01Icon} 
                          size={10} 
                          className={m.status === "read" ? "text-blue-500" : "text-muted-foreground"} 
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-start gap-3">
                  <div className="bg-card border p-4 rounded-3xl rounded-tl-none flex gap-1.5 shadow-sm">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-6 bg-background/80 backdrop-blur-xl border-t">
            <div className="flex items-end gap-3 bg-muted/30 p-3 rounded-3xl border-2 border-transparent focus-within:border-primary/30 focus-within:bg-background transition-all shadow-inner">
              <Button variant="ghost" size="icon" className="shrink-0 rounded-2xl hover:bg-primary/10 hover:text-primary transition-colors">
                <HugeiconsIcon icon={AttachmentIcon} size={20} />
              </Button>
              <textarea 
                placeholder="Write a message..." 
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm resize-none py-2 max-h-32 min-h-[40px] font-medium" 
                rows={1}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())}
              />
              <Button variant="ghost" size="icon" className="shrink-0 rounded-2xl hover:bg-primary/10 hover:text-primary transition-colors">
                <HugeiconsIcon icon={SmileIcon} size={20} />
              </Button>
              <Button size="icon" className="shrink-0 rounded-2xl w-11 h-11 shadow-lg shadow-primary/30" onClick={send} disabled={!input.trim()}>
                <HugeiconsIcon icon={MailSend01Icon} size={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
