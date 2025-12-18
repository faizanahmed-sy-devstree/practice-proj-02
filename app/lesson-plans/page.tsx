"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Editor } from "@/components/editor"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  Download01Icon, 
  AiMagicIcon, 
  Layout01Icon,
  AiLearningIcon,
  WhiteboardIcon,
  AbacusIcon,
  CheckmarkCircle02Icon,
  ArrowRight01Icon
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"

const TEMPLATES = [
  {
    id: "standard",
    title: "Standard Lesson",
    description: "General purpose lesson plan structure.",
    icon: Layout01Icon,
    color: "text-blue-500 bg-blue-500/10",
    content: `
      <h1>Standard Lesson Plan</h1>
      <p><strong>Subject:</strong> [Enter Subject]</p>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      <hr />
      <h2>Objectives</h2>
      <ul>
        <li>Students will be able to...</li>
        <li>Students will understand...</li>
      </ul>
      <h2>Materials Needed</h2>
      <ul>
        <li>Textbook page [X]</li>
        <li>Whiteboard markers</li>
      </ul>
      <h2>Introduction (10 mins)</h2>
      <p>Hook the students with a question or a short activity...</p>
      <h2>Main Activity (30 mins)</h2>
      <p>Step-by-step instructions for the core lesson...</p>
      <h2>Conclusion (10 mins)</h2>
      <p>Summary and exit ticket...</p>
    `
  },
  {
    id: "science",
    title: "Science Lab",
    description: "Ideal for experiments and observations.",
    icon: AiLearningIcon,
    color: "text-emerald-500 bg-emerald-500/10",
    content: `
      <h1>Science Lab Plan</h1>
      <p><strong>Experiment:</strong> [Enter Experiment Name]</p>
      <hr />
      <h2>Hypothesis</h2>
      <p>If [independent variable], then [dependent variable] because...</p>
      <h2>Variables</h2>
      <ul>
        <li><strong>Independent:</strong> [X]</li>
        <li><strong>Dependent:</strong> [Y]</li>
        <li><strong>Controlled:</strong> [Z]</li>
      </ul>
      <h2>Procedure</h2>
      <ol>
        <li>Gather all materials.</li>
        <li>Set up the apparatus.</li>
        <li>Perform the experiment.</li>
      </ol>
      <h2>Safety Precautions</h2>
      <p>Wear goggles and handle chemicals with care...</p>
    `
  },
  {
    id: "arts",
    title: "Creative Arts",
    description: "Focused on projects and expression.",
    icon: WhiteboardIcon,
    color: "text-pink-500 bg-pink-500/10",
    content: `
      <h1>Creative Arts Lesson</h1>
      <p><strong>Project:</strong> [Enter Project Name]</p>
      <hr />
      <h2>Artistic Goals</h2>
      <p>Explore the use of [medium/technique] to express [theme]...</p>
      <h2>Inspiration</h2>
      <p>Look at the works of [Artist Name] and discuss...</p>
      <h2>Studio Time</h2>
      <p>Students will work on their individual pieces while the teacher provides feedback...</p>
      <h2>Critique & Reflection</h2>
      <p>Share work with the class and discuss the process...</p>
    `
  },
  {
    id: "math",
    title: "Math Workshop",
    description: "Structured for problem solving and practice.",
    icon: AbacusIcon,
    color: "text-purple-500 bg-purple-500/10",
    content: `
      <h1>Math Workshop Plan</h1>
      <p><strong>Topic:</strong> [Enter Math Topic]</p>
      <hr />
      <h2>Number Sense Warm-up</h2>
      <p>Quick mental math activity (5 mins)...</p>
      <h2>Mini-Lesson</h2>
      <p>Demonstrate the new concept using visual aids...</p>
      <h2>Guided Practice</h2>
      <p>Work through 3-5 problems as a class...</p>
      <h2>Independent Stations</h2>
      <ul>
        <li>Station 1: Problem solving</li>
        <li>Station 2: Math games</li>
        <li>Station 3: Teacher-led small group</li>
      </ul>
    `
  }
]

export default function LessonPlansPage() {
  const [content, setContent] = React.useState(TEMPLATES[0].content)
  const [activeTemplate, setActiveTemplate] = React.useState(TEMPLATES[0].id)
  const [isExporting, setIsExporting] = React.useState(false)
  const editorRef = React.useRef<HTMLDivElement>(null)

  const handleTemplateSelect = (template: typeof TEMPLATES[0]) => {
    setContent(template.content)
    setActiveTemplate(template.id)
    toast.success(`${template.title} template applied!`)
  }

  const exportToPDF = async () => {
    if (!editorRef.current) return

    setIsExporting(true)
    const toastId = toast.loading("Generating PDF...")

    try {
      const element = editorRef.current.querySelector('.tiptap') as HTMLElement
      if (!element) throw new Error("Editor content not found")

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff"
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4'
      })

      const imgProps = pdf.getImageProperties(imgData)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save(`lesson-plan-${new Date().getTime()}.pdf`)

      toast.success("PDF exported successfully!", { id: toastId })
    } catch (error) {
      console.error("PDF Export Error:", error)
      toast.error("Failed to export PDF", { id: toastId })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Lesson Plan Generator</h1>
            <p className="text-muted-foreground">
              Create, edit, and export professional lesson plans in seconds.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={exportToPDF} 
              disabled={isExporting}
              className="shadow-lg shadow-primary/20"
            >
              <HugeiconsIcon icon={Download01Icon} size={18} className="mr-2" />
              {isExporting ? "Exporting..." : "Export to PDF"}
            </Button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          {/* Sidebar: Templates */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <HugeiconsIcon icon={AiMagicIcon} size={20} className="text-primary" />
              Templates
            </h2>
            <div className="grid gap-3">
              {TEMPLATES.map((template) => (
                <Card 
                  key={template.id}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md border-2",
                    activeTemplate === template.id ? "border-primary bg-primary/5" : "border-transparent"
                  )}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border", template.color)}>
                        <HugeiconsIcon icon={template.icon} size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm truncate">{template.title}</h3>
                        <p className="text-xs text-muted-foreground truncate">{template.description}</p>
                      </div>
                      {activeTemplate === template.id && (
                        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} className="text-primary" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-none shadow-md bg-muted/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Pro Tip</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Use the toolbar to format your text. You can add headings, lists, and quotes to make your lesson plan more readable.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content: Editor */}
          <div className="space-y-4" ref={editorRef}>
            <Editor content={content} onChange={setContent} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
