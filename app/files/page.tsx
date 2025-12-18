"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Folder01Icon,
  File01Icon,
  SearchIcon,
  GridIcon,
  MoreHorizontalIcon,
  ArrowRight01Icon,
  CloudUploadIcon,
  Delete02Icon,
  Download01Icon,
  Share01Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

export default function FilesPage() {
  const [path, setPath] = React.useState(["Root", "Projects", "Design"])
  const [view, setView] = React.useState<"grid" | "list">("grid")
  const [selected, setSelected] = React.useState<string | null>("Dashboard_Final.fig")
  const [search, setSearch] = React.useState("")
  
  const files = [
    { name: "Assets", type: "folder", size: "1.2GB", date: "2h ago", items: 24 },
    { name: "Archive", type: "folder", size: "450MB", date: "5h ago", items: 12 },
    { name: "Dashboard_Final.fig", type: "design", size: "24.5MB", date: "10:24 AM", color: "bg-blue-500" },
    { name: "User_Flow_v2.pdf", type: "pdf", size: "1.2MB", date: "Yesterday", color: "bg-red-500" },
    { name: "Brand_Identity.zip", type: "archive", size: "85MB", date: "Dec 12", color: "bg-amber-500" },
    { name: "App_Icon_Export.png", type: "image", size: "850KB", date: "Dec 12", color: "bg-emerald-500" },
    { name: "README.md", type: "code", size: "4KB", date: "Dec 10", color: "bg-zinc-500" },
    { name: "Contract_Signed.pdf", type: "pdf", size: "2.1MB", date: "Dec 08", color: "bg-red-500" },
  ]

  const filtered = files.filter(f => f.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)] bg-card border-2 rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between bg-muted/10">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-black tracking-tight">File Explorer</h1>
            <div className="flex items-center gap-1 bg-background/50 p-1 rounded-xl border shadow-inner">
              {path.map((p, i) => (
                <React.Fragment key={p}>
                  <Button variant="ghost" size="sm" className="h-8 px-3 text-xs font-bold hover:bg-background transition-all">
                    {p === "Root" ? <HugeiconsIcon icon={Folder01Icon} size={14} className="mr-2" /> : null}
                    {p}
                  </Button>
                  {i < path.length - 1 && <HugeiconsIcon icon={ArrowRight01Icon} size={12} className="text-muted-foreground mx-1" />}
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <HugeiconsIcon icon={SearchIcon} size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search files..." 
                className="pl-9 h-10 bg-background/50 border-none shadow-inner" 
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <Button className="h-10 px-6 font-bold shadow-lg shadow-primary/20">
              <HugeiconsIcon icon={CloudUploadIcon} size={18} className="mr-2" />
              Upload
            </Button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between bg-background/50">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-xs font-bold h-8">All Files</Button>
                <Button variant="ghost" size="sm" className="text-xs font-medium h-8 text-muted-foreground">Recent</Button>
                <Button variant="ghost" size="sm" className="text-xs font-medium h-8 text-muted-foreground">Starred</Button>
              </div>
              <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-lg border">
                <Button 
                  variant="ghost" 
                  size="icon-sm" 
                  onClick={() => setView("list")} 
                  className={cn("h-7 w-7", view === "list" && "bg-background shadow-sm")}
                >
                  <HugeiconsIcon icon={MoreHorizontalIcon} size={14} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon-sm" 
                  onClick={() => setView("grid")} 
                  className={cn("h-7 w-7", view === "grid" && "bg-background shadow-sm")}
                >
                  <HugeiconsIcon icon={GridIcon} size={14} />
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1 p-6">
              <div className={cn(
                "pb-12",
                view === "grid" ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6" : "space-y-1"
              )}>
                {filtered.map((f, i) => (
                  <button
                    key={i}
                    onClick={() => setSelected(f.name)}
                    className={cn(
                      "w-full transition-all duration-300 group relative",
                      view === "list" 
                        ? "p-3 rounded-xl flex items-center justify-between hover:bg-muted/50" 
                        : "p-6 rounded-3xl border-2 flex flex-col items-center gap-4 hover:border-primary/50 hover:bg-primary/5",
                      selected === f.name && (view === "list" ? "bg-primary/10 text-primary" : "border-primary bg-primary/5 shadow-xl shadow-primary/5")
                    )}
                  >
                    <div className={cn("flex items-center gap-4", view === "grid" && "flex-col")}>
                      <div className={cn(
                        "p-4 rounded-2xl shadow-sm transition-transform group-hover:scale-110 duration-500",
                        f.type === "folder" ? "bg-amber-100 text-amber-600 dark:bg-amber-950/30" : cn(f.color, "text-white")
                      )}>
                        <HugeiconsIcon icon={f.type === "folder" ? Folder01Icon : File01Icon} size={view === "grid" ? 32 : 20} />
                      </div>
                      <div className={view === "grid" ? "text-center" : "text-left flex-1"}>
                        <p className="text-sm font-bold truncate max-w-[140px]">{f.name}</p>
                        <p className="text-[10px] text-muted-foreground font-medium">
                          {f.type === "folder" ? `${f.items} items` : f.size} • {f.date}
                        </p>
                      </div>
                    </div>
                    {view === "list" && (
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon-sm" className="h-8 w-8 rounded-lg"><HugeiconsIcon icon={Download01Icon} size={14} /></Button>
                        <Button variant="ghost" size="icon-sm" className="h-8 w-8 rounded-lg"><HugeiconsIcon icon={Share01Icon} size={14} /></Button>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Preview Pane */}
          {selected && (
            <div className="w-96 border-l bg-muted/5 p-8 flex flex-col animate-in slide-in-from-right-8 duration-500">
              <div className="flex-1 space-y-8">
                <div className="aspect-square rounded-3xl bg-background border-4 border-dashed border-muted flex flex-col items-center justify-center text-muted-foreground gap-4 shadow-inner">
                  <HugeiconsIcon icon={File01Icon} size={64} className="opacity-10" />
                  <div className="text-center px-6">
                    <p className="text-xs font-bold uppercase tracking-widest mb-1">Preview</p>
                    <p className="text-[10px]">No visual preview available for this file type.</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-black truncate pr-4">{selected}</h2>
                    <Button variant="ghost" size="icon-sm" className="rounded-full"><HugeiconsIcon icon={InformationCircleIcon} size={18} /></Button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <PropertyItem label="Size" value={files.find(f => f.name === selected)?.size || "Unknown"} />
                    <PropertyItem label="Modified" value={files.find(f => f.name === selected)?.date || "Unknown"} />
                    <PropertyItem label="Type" value={selected.split('.').pop()?.toUpperCase() || "FOLDER"} />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4">
                    <Button className="h-12 rounded-2xl font-bold shadow-lg shadow-primary/20">
                      <HugeiconsIcon icon={Download01Icon} size={18} className="mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" className="h-12 rounded-2xl font-bold">
                      <HugeiconsIcon icon={Share01Icon} size={18} className="mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full h-12 rounded-2xl text-xs font-bold text-destructive hover:text-destructive hover:bg-destructive/5 mt-8"
                onClick={() => setSelected(null)}
              >
                <HugeiconsIcon icon={Delete02Icon} size={16} className="mr-2" />
                Delete File
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

function PropertyItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-center p-3 rounded-2xl bg-background/50 border shadow-sm">
      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className="text-xs font-bold">{value}</span>
    </div>
  )
}
