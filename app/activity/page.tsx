"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  GitBranchIcon, 
  PackageIcon, 
  Settings02Icon, 
  UserGroupIcon,
  Message01Icon,
  ZapIcon
} from "@hugeicons/core-free-icons"

const activities = [
  {
    id: "1",
    user: { name: "John Doe", avatar: "https://i.pravatar.cc/150?u=1" },
    action: "deployed",
    target: "nexus-dashboard",
    detail: "to production",
    time: "2 minutes ago",
    icon: ZapIcon,
    iconColor: "text-amber-500 bg-amber-500/10",
  },
  {
    id: "2",
    user: { name: "Alice Smith", avatar: "https://i.pravatar.cc/150?u=2" },
    action: "pushed to",
    target: "main",
    detail: "feat: add analytics dashboard",
    time: "45 minutes ago",
    icon: GitBranchIcon,
    iconColor: "text-blue-500 bg-blue-500/10",
  },
  {
    id: "3",
    user: { name: "Bob Wilson", avatar: "https://i.pravatar.cc/150?u=3" },
    action: "updated",
    target: "project settings",
    detail: "changed framework preset to Next.js",
    time: "2 hours ago",
    icon: Settings02Icon,
    iconColor: "text-purple-500 bg-purple-500/10",
  },
  {
    id: "4",
    user: { name: "John Doe", avatar: "https://i.pravatar.cc/150?u=1" },
    action: "invited",
    target: "Sarah Connor",
    detail: "as a developer",
    time: "5 hours ago",
    icon: UserGroupIcon,
    iconColor: "text-emerald-500 bg-emerald-500/10",
  },
  {
    id: "5",
    user: { name: "Sarah Connor", avatar: "https://i.pravatar.cc/150?u=4" },
    action: "commented on",
    target: "deployment #a1b2c3d",
    detail: '"Looks great! Ready for production."',
    time: "1 day ago",
    icon: Message01Icon,
    iconColor: "text-pink-500 bg-pink-500/10",
  },
]

export default function ActivityPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-3xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activity</h1>
          <p className="text-muted-foreground">
            Recent events and updates across your project.
          </p>
        </div>

        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-border before:to-transparent">
          {activities.map((activity) => (
            <div key={activity.id} className="relative flex items-start gap-6">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-background shadow-sm z-10 ${activity.iconColor}`}>
                <HugeiconsIcon icon={activity.icon} size={18} />
              </div>
              <Card className="flex-1 border-none shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-6 w-6 border">
                        <AvatarImage src={activity.user.avatar} />
                        <AvatarFallback>{activity.user.name[0]}</AvatarFallback>
                      </Avatar>
                      <p className="text-sm">
                        <span className="font-semibold">{activity.user.name}</span>
                        {" "}{activity.action}{" "}
                        <span className="font-medium text-foreground">{activity.target}</span>
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                  </div>
                  {activity.detail && (
                    <div className="mt-2 ml-9">
                      <p className="text-sm text-muted-foreground italic">
                        {activity.detail}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
