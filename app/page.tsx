"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  GithubIcon,
  GlobalIcon,
  Clock01Icon,
  CheckmarkCircle02Icon,
  AlertCircleIcon,
  ArrowUpRight01Icon,
  MoreHorizontalCircle01Icon,
  GitBranchIcon,
  ZapIcon,
  AiCloudIcon,
  Database01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";

const deployments = [
  {
    id: "1",
    project: "nexus-dashboard",
    commit: "feat: add analytics dashboard",
    branch: "main",
    status: "Ready",
    time: "2m ago",
    author: "JD",
  },
  {
    id: "2",
    project: "nexus-dashboard",
    commit: "fix: mobile navigation issue",
    branch: "main",
    status: "Ready",
    time: "45m ago",
    author: "JD",
  },
  {
    id: "3",
    project: "nexus-dashboard",
    commit: "chore: update dependencies",
    branch: "develop",
    status: "Error",
    time: "2h ago",
    author: "AS",
  },
  {
    id: "4",
    project: "nexus-dashboard",
    commit: "feat: implement dark mode",
    branch: "main",
    status: "Ready",
    time: "5h ago",
    author: "JD",
  },
];

export default function Page() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Project Overview Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
            <p className="text-muted-foreground">
              Manage your project deployments and monitor performance.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9">
              <HugeiconsIcon icon={GithubIcon} size={16} className="mr-2" />
              Repository
            </Button>
            <Button size="sm" className="h-9 shadow-lg shadow-primary/20">
              <HugeiconsIcon icon={ZapIcon} size={16} className="mr-2" />
              New Deployment
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="overflow-hidden border-none shadow-md bg-background/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Requests
              </CardTitle>
              <HugeiconsIcon
                icon={GlobalIcon}
                size={16}
                className="text-muted-foreground"
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.2M</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card className="overflow-hidden border-none shadow-md bg-background/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Latency
              </CardTitle>
              <HugeiconsIcon
                icon={Clock01Icon}
                size={16}
                className="text-muted-foreground"
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42ms</div>
              <p className="text-xs text-muted-foreground">
                -4ms from last week
              </p>
            </CardContent>
          </Card>
          <Card className="overflow-hidden border-none shadow-md bg-background/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Uptime</CardTitle>
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                size={16}
                className="text-primary"
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">99.99%</div>
              <p className="text-xs text-muted-foreground">
                Consistent performance
              </p>
            </CardContent>
          </Card>
          <Card className="overflow-hidden border-none shadow-md bg-background/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Users
              </CardTitle>
              <HugeiconsIcon
                icon={UserGroupIcon}
                size={16}
                className="text-muted-foreground"
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+573</div>
              <p className="text-xs text-muted-foreground">
                +12 since last hour
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content: Deployments */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Deployments</h2>
              <Button variant="link" size="sm" className="text-primary">
                View all
              </Button>
            </div>
            <Card className="border-none shadow-lg overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[300px]">Deployment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead className="text-right">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deployments.map((deployment) => (
                    <TableRow
                      key={deployment.id}
                      className="group cursor-pointer hover:bg-muted/30"
                    >
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="font-medium group-hover:text-primary transition-colors">
                            {deployment.commit}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {deployment.project}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-2 w-2 rounded-full ${
                              deployment.status === "Ready"
                                ? "bg-emerald-500"
                                : "bg-destructive"
                            }`}
                          />
                          <span className="text-sm font-medium">
                            {deployment.status}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <HugeiconsIcon icon={GitBranchIcon} size={14} />
                          <span className="text-sm">{deployment.branch}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
                        {deployment.time}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>

          {/* Sidebar Content: Project Details & Activity */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Project Details</h2>
              <Card className="border-none shadow-md">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <HugeiconsIcon icon={AiCloudIcon} size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Deployment URL</p>
                        <p className="text-xs text-muted-foreground">
                          nexus-dashboard.vercel.app
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <HugeiconsIcon icon={ArrowUpRight01Icon} size={16} />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <HugeiconsIcon icon={Database01Icon} size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Database</p>
                        <p className="text-xs text-muted-foreground">
                          PostgreSQL (AWS us-east-1)
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="font-normal">
                      Healthy
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/30 py-3">
                  <Button variant="ghost" size="sm" className="w-full text-xs">
                    Configure Project
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Activity Feed</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4">
                    <Avatar className="h-8 w-8 border">
                      <AvatarImage src={`https://i.pravatar.cc/150?u=${i}`} />
                      <AvatarFallback>U{i}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="text-sm">
                        <span className="font-semibold">Alex Smith</span> pushed
                        to{" "}
                        <span className="font-mono text-xs bg-muted px-1 rounded">
                          main
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        2 hours ago
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full">
                View Activity Log
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
