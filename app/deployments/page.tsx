"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  GitBranchIcon, 
  Clock01Icon, 
  GithubIcon,
  MoreHorizontalCircle01Icon,
  Search01Icon,
  FilterIcon
} from "@hugeicons/core-free-icons"
import { Input } from "@/components/ui/input"

const deployments = [
  {
    id: "1",
    commit: "feat: add analytics dashboard",
    hash: "a1b2c3d",
    branch: "main",
    status: "Ready",
    time: "2m ago",
    author: "John Doe",
  },
  {
    id: "2",
    commit: "fix: mobile navigation issue",
    hash: "e5f6g7h",
    branch: "main",
    status: "Ready",
    time: "45m ago",
    author: "John Doe",
  },
  {
    id: "3",
    commit: "chore: update dependencies",
    hash: "i9j0k1l",
    branch: "develop",
    status: "Error",
    time: "2h ago",
    author: "Alice Smith",
  },
  {
    id: "4",
    commit: "feat: implement dark mode",
    hash: "m2n3o4p",
    branch: "main",
    status: "Ready",
    time: "5h ago",
    author: "John Doe",
  },
  {
    id: "5",
    commit: "refactor: optimize database queries",
    hash: "q5r6s7t",
    branch: "main",
    status: "Ready",
    time: "1d ago",
    author: "Bob Wilson",
  },
]

export default function DeploymentsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Deployments</h1>
            <p className="text-muted-foreground">
              A history of all your project deployments.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <HugeiconsIcon icon={Search01Icon} size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search deployments..." className="pl-9" />
          </div>
          <Button variant="outline" size="sm">
            <HugeiconsIcon icon={FilterIcon} size={16} className="mr-2" />
            Filter
          </Button>
        </div>

        <Card className="border-none shadow-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[400px]">Deployment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Author</TableHead>
                <TableHead className="text-right">Created</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deployments.map((deployment) => (
                <TableRow key={deployment.id} className="group cursor-pointer hover:bg-muted/30">
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-medium group-hover:text-primary transition-colors">
                        {deployment.commit}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <HugeiconsIcon icon={GithubIcon} size={12} />
                        <span className="font-mono">{deployment.hash}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={deployment.status === "Ready" ? "secondary" : "destructive"} className="font-medium">
                      {deployment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <HugeiconsIcon icon={GitBranchIcon} size={14} />
                      <span className="text-sm">{deployment.branch}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{deployment.author}</span>
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    <div className="flex items-center justify-end gap-1.5">
                      <HugeiconsIcon icon={Clock01Icon} size={14} />
                      {deployment.time}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <HugeiconsIcon icon={MoreHorizontalCircle01Icon} size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </DashboardLayout>
  )
}
