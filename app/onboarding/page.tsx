"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight01Icon,
  ArrowLeft01Icon,
  Tick01Icon,
  UserIcon,
  Settings02Icon,
  AiMagicIcon,
  CheckmarkBadge01Icon,
  Mail01Icon,
  Building01Icon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export default function OnboardingPage() {
  const [step, setStep] = React.useState(1)
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    role: "developer",
    company: "",
    theme: "dark",
    notifications: true,
    newsletter: false
  })
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (step === 1) {
      if (!formData.name) newErrors.name = "Full name is required"
      if (!formData.email.includes("@")) newErrors.email = "Please enter a valid email"
    }
    if (step === 2) {
      if (!formData.company) newErrors.company = "Company name is required"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const next = () => {
    if (validate()) setStep(s => s + 1)
  }

  const finish = () => {
    toast.success("Welcome to Nexus!", {
      description: "Your account has been successfully configured."
    })
    // Reset or redirect
  }

  const steps = [
    { id: 1, title: "Personal Info", icon: UserIcon },
    { id: 2, title: "Organization", icon: Building01Icon },
    { id: 3, title: "Preferences", icon: Settings02Icon },
    { id: 4, title: "Review", icon: CheckmarkBadge01Icon },
  ]

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-12">
        <div className="text-center mb-12 space-y-4">
          <Badge variant="secondary" className="px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary border-primary/20">
            Step {step} of 4
          </Badge>
          <h1 className="text-4xl font-black tracking-tight">Let's set up your workspace</h1>
          <p className="text-muted-foreground max-w-md mx-auto">Customize your experience to get the most out of our platform.</p>
        </div>

        {/* Progress Stepper */}
        <div className="flex justify-between items-center mb-16 relative px-4">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2 z-0 rounded-full" />
          <div 
            className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-700 rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)]" 
            style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
          />
          {steps.map(s => (
            <div key={s.id} className="relative z-10 flex flex-col items-center gap-3">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-4 border-background shadow-xl",
                step >= s.id ? "bg-primary text-primary-foreground scale-110 rotate-3" : "bg-muted text-muted-foreground"
              )}>
                {step > s.id ? <HugeiconsIcon icon={Tick01Icon} size={20} /> : <HugeiconsIcon icon={s.icon} size={20} />}
              </div>
              <span className={cn("text-[10px] font-black uppercase tracking-widest", step >= s.id ? "text-primary" : "text-muted-foreground")}>
                {s.title}
              </span>
            </div>
          ))}
        </div>

        <Card className="border-2 shadow-2xl rounded-3xl overflow-hidden bg-card/50 backdrop-blur-xl">
          <CardContent className="p-10">
            {step === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Full Name</label>
                    <div className="relative">
                      <HugeiconsIcon icon={UserIcon} size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input 
                        placeholder="Johnathan Doe" 
                        className={cn("h-12 pl-12 bg-muted/20 border-2 focus:border-primary transition-all rounded-xl", errors.name && "border-destructive")}
                        value={formData.name}
                        onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                      />
                    </div>
                    {errors.name && <p className="text-xs text-destructive font-medium">{errors.name}</p>}
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Email Address</label>
                    <div className="relative">
                      <HugeiconsIcon icon={Mail01Icon} size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input 
                        type="email"
                        placeholder="john@nexus.com" 
                        className={cn("h-12 pl-12 bg-muted/20 border-2 focus:border-primary transition-all rounded-xl", errors.email && "border-destructive")}
                        value={formData.email}
                        onChange={e => setFormData(f => ({ ...f, email: e.target.value }))}
                      />
                    </div>
                    {errors.email && <p className="text-xs text-destructive font-medium">{errors.email}</p>}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Company Name</label>
                  <div className="relative">
                    <HugeiconsIcon icon={Building01Icon} size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input 
                      placeholder="Nexus Industries" 
                      className={cn("h-12 pl-12 bg-muted/20 border-2 focus:border-primary transition-all rounded-xl", errors.company && "border-destructive")}
                      value={formData.company}
                      onChange={e => setFormData(f => ({ ...f, company: e.target.value }))}
                    />
                  </div>
                  {errors.company && <p className="text-xs text-destructive font-medium">{errors.company}</p>}
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Your Primary Role</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {["developer", "designer", "manager", "other"].map(r => (
                      <button
                        key={r}
                        onClick={() => setFormData(f => ({ ...f, role: r }))}
                        className={cn(
                          "p-4 rounded-2xl border-2 text-xs font-bold capitalize transition-all duration-300",
                          formData.role === r 
                            ? "border-primary bg-primary/10 text-primary shadow-lg shadow-primary/10 scale-105" 
                            : "hover:bg-muted/50 border-transparent bg-muted/20"
                        )}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-6 rounded-3xl border-2 border-primary/20 bg-primary/5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-bold">Push Notifications</p>
                        <p className="text-[10px] text-muted-foreground">Real-time updates on your projects</p>
                      </div>
                      <Checkbox 
                        checked={formData.notifications} 
                        onCheckedChange={v => setFormData(f => ({ ...f, notifications: !!v }))}
                        className="w-6 h-6 rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="p-6 rounded-3xl border-2 border-muted bg-muted/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-bold">Weekly Newsletter</p>
                        <p className="text-[10px] text-muted-foreground">Best practices and industry news</p>
                      </div>
                      <Checkbox 
                        checked={formData.newsletter} 
                        onCheckedChange={v => setFormData(f => ({ ...f, newsletter: !!v }))}
                        className="w-6 h-6 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Interface Theme</label>
                  <div className="flex gap-4">
                    {["light", "dark", "system"].map(t => (
                      <button
                        key={t}
                        onClick={() => setFormData(f => ({ ...f, theme: t }))}
                        className={cn(
                          "flex-1 p-4 rounded-2xl border-2 text-xs font-bold capitalize transition-all",
                          formData.theme === t ? "border-primary bg-primary/10 text-primary" : "bg-muted/20 border-transparent"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-8 animate-in zoom-in-95 duration-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ReviewItem label="Full Name" value={formData.name} />
                  <ReviewItem label="Email" value={formData.email} />
                  <ReviewItem label="Company" value={formData.company} />
                  <ReviewItem label="Role" value={formData.role} />
                </div>
                <div className="p-6 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/20 flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg">
                    <HugeiconsIcon icon={AiMagicIcon} size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Everything looks great!</p>
                    <p className="text-xs text-muted-foreground">Click the button below to finalize your setup and enter the dashboard.</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-12 pt-8 border-t">
              <Button 
                variant="ghost" 
                size="lg" 
                className="rounded-2xl px-8 h-14 font-bold"
                disabled={step === 1} 
                onClick={() => setStep(s => s - 1)}
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} size={18} className="mr-2" />
                Previous
              </Button>
              <Button 
                size="lg" 
                className="rounded-2xl px-12 h-14 font-black shadow-xl shadow-primary/30"
                onClick={step === 4 ? finish : next}
              >
                {step === 4 ? "Enter Dashboard" : "Continue"}
                <HugeiconsIcon icon={ArrowRight01Icon} size={18} className="ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

function ReviewItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="p-4 rounded-2xl bg-muted/20 border-2 border-transparent">
      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
      <p className="text-sm font-bold">{value || "Not specified"}</p>
    </div>
  )
}
