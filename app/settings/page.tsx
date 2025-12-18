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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  Settings02Icon, 
  UserCircleIcon, 
  Notification03Icon, 
  ShieldIcon,
  GithubIcon,
  GlobalIcon
} from "@hugeicons/core-free-icons"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your project configuration and team preferences.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
          <aside className="flex flex-col gap-2">
            <Button variant="ghost" className="justify-start font-semibold bg-muted/50">
              <HugeiconsIcon icon={Settings02Icon} size={16} className="mr-2" />
              General
            </Button>
            <Button variant="ghost" className="justify-start text-muted-foreground">
              <HugeiconsIcon icon={UserCircleIcon} size={16} className="mr-2" />
              Team
            </Button>
            <Button variant="ghost" className="justify-start text-muted-foreground">
              <HugeiconsIcon icon={Notification03Icon} size={16} className="mr-2" />
              Notifications
            </Button>
            <Button variant="ghost" className="justify-start text-muted-foreground">
              <HugeiconsIcon icon={ShieldIcon} size={16} className="mr-2" />
              Security
            </Button>
            <Button variant="ghost" className="justify-start text-muted-foreground">
              <HugeiconsIcon icon={GlobalIcon} size={16} className="mr-2" />
              Domains
            </Button>
          </aside>

          <div className="space-y-6">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
                <CardDescription>Update your project name and description.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Project Name</Label>
                  <Input id="name" defaultValue="nexus-dashboard" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe your project..." 
                    defaultValue="A modern project management and deployment platform for high-performance teams."
                  />
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/20 py-4">
                <Button size="sm">Save Changes</Button>
              </CardFooter>
            </Card>

            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle>Deployment Settings</CardTitle>
                <CardDescription>Configure how your project is built and deployed.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Automatic Deployments</Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically deploy when you push to the main branch.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Preview Comments</Label>
                    <p className="text-xs text-muted-foreground">
                      Enable Vercel-like comments on preview deployments.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="grid gap-2">
                  <Label htmlFor="framework">Framework Preset</Label>
                  <Select defaultValue="nextjs">
                    <SelectTrigger id="framework">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nextjs">Next.js</SelectItem>
                      <SelectItem value="vite">Vite</SelectItem>
                      <SelectItem value="astro">Astro</SelectItem>
                      <SelectItem value="remix">Remix</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive/20 border-2 shadow-md">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>Irreversible actions for this project.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Delete Project</Label>
                    <p className="text-xs text-muted-foreground">
                      Permanently delete this project and all its data.
                    </p>
                  </div>
                  <Button variant="destructive" size="sm">Delete</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
