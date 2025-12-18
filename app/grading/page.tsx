"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Maximize01Icon,
  Minimize01Icon,
  Cancel01Icon,
  ZoomInAreaIcon,
  ZoomOutAreaIcon,
  ArrowReloadHorizontalIcon,
  Book02Icon,
  Note01Icon,
  Image01Icon,
  CursorMove01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Layout01Icon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

type PanelType = "question" | "memo" | "answer"

interface PanelState {
  id: PanelType
  title: string
  icon: any
  isVisible: boolean
  isMaximized: boolean
}

const INITIAL_PANELS: PanelState[] = [
  {
    id: "question",
    title: "Question Paper",
    icon: Book02Icon,
    isVisible: true,
    isMaximized: false,
  },
  {
    id: "memo",
    title: "Memorandum",
    icon: Note01Icon,
    isVisible: true,
    isMaximized: false,
  },
  {
    id: "answer",
    title: "Answer Sheet",
    icon: Image01Icon,
    isVisible: true,
    isMaximized: false,
  },
]

export default function GradingPage() {
  const [panels, setPanels] = React.useState<PanelState[]>(INITIAL_PANELS)
  const [zoom, setZoom] = React.useState(100)
  const [direction, setDirection] = React.useState<"horizontal" | "vertical">("horizontal")
  const [draggedPanel, setDraggedPanel] = React.useState<PanelType | null>(null)

  const toggleVisibility = (id: PanelType) => {
    setPanels((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isVisible: !p.isVisible } : p))
    )
  }

  const toggleMaximize = (id: PanelType) => {
    setPanels((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isMaximized: !p.isMaximized } : { ...p, isMaximized: false }))
    )
  }

  const resetLayout = () => {
    setPanels(INITIAL_PANELS)
    setZoom(100)
    setDirection("horizontal")
  }

  const handleDragStart = (id: PanelType) => {
    setDraggedPanel(id)
  }

  const handleDrop = (targetId: PanelType) => {
    if (!draggedPanel || draggedPanel === targetId) return
    
    setPanels((prev) => {
      const newPanels = [...prev]
      const draggedIdx = newPanels.findIndex((p) => p.id === draggedPanel)
      const targetIdx = newPanels.findIndex((p) => p.id === targetId)
      
      const [removed] = newPanels.splice(draggedIdx, 1)
      newPanels.splice(targetIdx, 0, removed)
      
      return newPanels
    })
    setDraggedPanel(null)
  }

  const visiblePanels = panels.filter((p) => p.isVisible)
  const maximizedPanel = panels.find((p) => p.isMaximized)

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-12rem)] gap-4">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-2 bg-muted/30 rounded-xl border border-border/50 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold px-4">Teacher Grading</h1>
            <div className="h-6 w-px bg-border mx-2" />
            {panels.map((panel) => (
              <Button
                key={panel.id}
                variant={panel.isVisible ? "secondary" : "ghost"}
                size="sm"
                onClick={() => toggleVisibility(panel.id)}
                className={cn(
                  "gap-2 h-8",
                  panel.isVisible && "bg-primary/10 text-primary hover:bg-primary/20"
                )}
              >
                <HugeiconsIcon icon={panel.icon} size={14} />
                {panel.title}
              </Button>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDirection(direction === "horizontal" ? "vertical" : "horizontal")}
              className="h-8 gap-2"
            >
              <HugeiconsIcon icon={CursorMove01Icon} size={14} />
              {direction === "horizontal" ? "Split Vertically" : "Split Horizontally"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetLayout}
              className="h-8 gap-2 text-muted-foreground hover:text-foreground"
            >
              <HugeiconsIcon icon={ArrowReloadHorizontalIcon} size={14} />
              Reset Layout
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-0 border rounded-2xl bg-background overflow-hidden shadow-2xl relative">
          {maximizedPanel ? (
            <PanelContent 
              panel={maximizedPanel} 
              onClose={() => toggleMaximize(maximizedPanel.id)}
              onMinimize={() => toggleMaximize(maximizedPanel.id)}
              zoom={zoom}
              setZoom={setZoom}
              isMaximized={true}
            />
          ) : visiblePanels.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4">
              <HugeiconsIcon icon={Layout01Icon} size={48} className="opacity-20" />
              <p>No panels visible. Select a panel from the toolbar to begin grading.</p>
              <Button onClick={resetLayout} variant="outline">Restore Default Layout</Button>
            </div>
          ) : (
            <ResizablePanelGroup direction={direction} className="h-full">
              {visiblePanels.map((panel, index) => (
                <React.Fragment key={panel.id}>
                  <ResizablePanel 
                    defaultSize={100 / visiblePanels.length}
                    minSize={15}
                    className="relative group"
                  >
                    <div 
                      className="h-full flex flex-col"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => handleDrop(panel.id)}
                    >
                      <PanelHeader 
                        panel={panel}
                        onClose={() => toggleVisibility(panel.id)}
                        onMaximize={() => toggleMaximize(panel.id)}
                        onDragStart={() => handleDragStart(panel.id)}
                      />
                      <div className="flex-1 min-h-0">
                        <PanelContent 
                          panel={panel} 
                          zoom={zoom}
                          setZoom={setZoom}
                        />
                      </div>
                    </div>
                  </ResizablePanel>
                  {index < visiblePanels.length - 1 && <ResizableHandle withHandle />}
                </React.Fragment>
              ))}
            </ResizablePanelGroup>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

function PanelHeader({ 
  panel, 
  onClose, 
  onMaximize,
  onDragStart
}: { 
  panel: PanelState, 
  onClose: () => void, 
  onMaximize: () => void,
  onDragStart: () => void
}) {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border/50 select-none">
      <div 
        className="flex items-center gap-2 cursor-grab active:cursor-grabbing"
        draggable
        onDragStart={onDragStart}
      >
        <HugeiconsIcon icon={CursorMove01Icon} size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        <HugeiconsIcon icon={panel.icon} size={16} className="text-primary" />
        <span className="text-sm font-semibold truncate">{panel.title}</span>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon-sm" className="h-7 w-7" onClick={onMaximize}>
          <HugeiconsIcon icon={Maximize01Icon} size={14} />
        </Button>
        <Button variant="ghost" size="icon-sm" className="h-7 w-7 hover:text-destructive" onClick={onClose}>
          <HugeiconsIcon icon={Cancel01Icon} size={14} />
        </Button>
      </div>
    </div>
  )
}

function PanelContent({ 
  panel, 
  zoom, 
  setZoom,
  isMaximized,
  onClose,
  onMinimize
}: { 
  panel: PanelState, 
  zoom: number, 
  setZoom: (z: number) => void,
  isMaximized?: boolean,
  onClose?: () => void,
  onMinimize?: () => void
}) {
  return (
    <div className="h-full flex flex-col">
      {isMaximized && (
        <div className="flex items-center justify-between px-6 py-3 bg-primary/5 border-b border-primary/10">
          <div className="flex items-center gap-3">
            <HugeiconsIcon icon={panel.icon} size={20} className="text-primary" />
            <h2 className="text-lg font-bold">{panel.title}</h2>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Maximized View</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onMinimize} className="gap-2">
              <HugeiconsIcon icon={Minimize01Icon} size={14} />
              Minimize
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <HugeiconsIcon icon={Cancel01Icon} size={18} />
            </Button>
          </div>
        </div>
      )}
      
      <ScrollArea className="flex-1">
        <div className="p-6">
          {panel.id === "question" && <QuestionContent />}
          {panel.id === "memo" && <MemoContent />}
          {panel.id === "answer" && <AnswerSheetContent zoom={zoom} setZoom={setZoom} />}
        </div>
      </ScrollArea>
    </div>
  )
}

function QuestionContent() {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <h3 className="text-primary">Section A: Multiple Choice</h3>
      <div className="space-y-6">
        {[1, 2, 3].map((q) => (
          <div key={q} className="p-4 rounded-lg border bg-muted/20">
            <p className="font-bold mb-2">Question {q}:</p>
            <p>What is the primary function of the mitochondria in a eukaryotic cell?</p>
            <ol className="list-[lower-alpha] ml-6 mt-2 space-y-1">
              <li>Protein synthesis</li>
              <li>Energy production (ATP)</li>
              <li>Waste management</li>
              <li>Genetic storage</li>
            </ol>
          </div>
        ))}
      </div>
      <h3 className="text-primary mt-8">Section B: Short Answer</h3>
      <div className="p-4 rounded-lg border bg-muted/20">
        <p className="font-bold mb-2">Question 4:</p>
        <p>Explain the process of photosynthesis in your own words. (5 marks)</p>
      </div>
    </div>
  )
}

function MemoContent() {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <h3 className="text-emerald-600">Marking Scheme - Section A</h3>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Q#</th>
            <th className="text-left py-2">Answer</th>
            <th className="text-left py-2">Marks</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="py-2">1</td>
            <td className="py-2 font-bold">B</td>
            <td className="py-2">1</td>
          </tr>
          <tr className="border-b">
            <td className="py-2">2</td>
            <td className="py-2 font-bold">A</td>
            <td className="py-2">1</td>
          </tr>
          <tr className="border-b">
            <td className="py-2">3</td>
            <td className="py-2 font-bold">D</td>
            <td className="py-2">1</td>
          </tr>
        </tbody>
      </table>
      <h3 className="text-emerald-600 mt-8">Marking Scheme - Section B</h3>
      <div className="p-4 rounded-lg border border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20">
        <p className="font-bold text-emerald-700 dark:text-emerald-400">Q4 Rubric:</p>
        <ul className="mt-2 space-y-1">
          <li>Mention of light energy conversion (1 mark)</li>
          <li>Chlorophyll involvement (1 mark)</li>
          <li>Water and CO2 as reactants (1 mark)</li>
          <li>Glucose and Oxygen as products (1 mark)</li>
          <li>Overall clarity (1 mark)</li>
        </ul>
      </div>
    </div>
  )
}

function AnswerSheetContent({ zoom, setZoom }: { zoom: number, setZoom: (z: number) => void }) {
  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-10 flex items-center justify-between p-2 bg-background/80 backdrop-blur border rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon-sm" onClick={() => setZoom(Math.max(50, zoom - 10))}>
            <HugeiconsIcon icon={ZoomOutAreaIcon} size={14} />
          </Button>
          <span className="text-xs font-medium w-12 text-center">{zoom}%</span>
          <Button variant="outline" size="icon-sm" onClick={() => setZoom(Math.min(200, zoom + 10))}>
            <HugeiconsIcon icon={ZoomInAreaIcon} size={14} />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon-sm">
            <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
          </Button>
          <span className="text-xs">Page 1 of 4</span>
          <Button variant="ghost" size="icon-sm">
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
          </Button>
        </div>
      </div>
      
      <div className="flex justify-center overflow-auto p-4 bg-zinc-100 dark:bg-zinc-900 rounded-xl border min-h-[600px]">
        <div 
          className="bg-white shadow-xl transition-transform duration-200 origin-top"
          style={{ 
            width: "100%", 
            maxWidth: "800px",
            transform: `scale(${zoom / 100})`,
          }}
        >
          {/* Simulated Handwritten Answer Sheet */}
          <div className="aspect-[1/1.41] p-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
            <div className="space-y-12 font-serif italic text-blue-800 dark:text-blue-400 text-xl">
              <div className="space-y-4">
                <p className="text-sm not-italic font-sans text-muted-foreground border-b pb-1">Student: Alex Johnson | ID: 2024-0892</p>
                <p className="underline decoration-blue-300">Section A</p>
                <div className="grid grid-cols-2 gap-4">
                  <p>1. B</p>
                  <p>2. A</p>
                  <p>3. D</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="underline decoration-blue-300">Section B</p>
                <p>Q4. Photosynthesis is how plants make food. They use sunlight, water and CO2. The green stuff in leaves (chlorophyll) catches the light. It turns them into sugar for the plant to grow and they release oxygen for us to breathe.</p>
              </div>
              
              <div className="h-40 border-2 border-dashed border-blue-200 rounded-lg flex items-center justify-center text-blue-300 not-italic text-sm">
                [Drawing of a leaf with arrows showing CO2 in and O2 out]
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
