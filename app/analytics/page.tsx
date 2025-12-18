"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart"
import { 
  Area, 
  AreaChart, 
  CartesianGrid, 
  XAxis, 
  YAxis,
  ResponsiveContainer
} from "recharts"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  ChartLineData01Icon, 
  GlobalIcon, 
  Clock01Icon, 
  AlertCircleIcon,
  ArrowUp01Icon,
  ArrowDown01Icon
} from "@hugeicons/core-free-icons"
import { Badge } from "@/components/ui/badge"

const chartData = [
  { date: "2024-01-01", requests: 1200, latency: 45 },
  { date: "2024-01-02", requests: 1500, latency: 42 },
  { date: "2024-01-03", requests: 1100, latency: 48 },
  { date: "2024-01-04", requests: 1800, latency: 40 },
  { date: "2024-01-05", requests: 2100, latency: 38 },
  { date: "2024-01-06", requests: 1900, latency: 41 },
  { date: "2024-01-07", requests: 2400, latency: 35 },
]

const chartConfig = {
  requests: {
    label: "Requests",
    color: "hsl(var(--primary))",
  },
  latency: {
    label: "Latency",
    color: "hsl(var(--chart-2))",
  },
}

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Monitor your application performance and traffic.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-none shadow-md">
            <CardHeader className="pb-2">
              <CardDescription>Total Requests</CardDescription>
              <CardTitle className="text-2xl">142.8k</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-xs text-emerald-500">
                <HugeiconsIcon icon={ArrowUp01Icon} size={12} />
                <span>12% from last week</span>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md">
            <CardHeader className="pb-2">
              <CardDescription>Avg. Response Time</CardDescription>
              <CardTitle className="text-2xl">38ms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-xs text-emerald-500">
                <HugeiconsIcon icon={ArrowDown01Icon} size={12} />
                <span>4ms improvement</span>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md">
            <CardHeader className="pb-2">
              <CardDescription>Error Rate</CardDescription>
              <CardTitle className="text-2xl">0.02%</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <HugeiconsIcon icon={AlertCircleIcon} size={12} />
                <span>Stable performance</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-lg overflow-hidden">
          <CardHeader>
            <CardTitle>Traffic Overview</CardTitle>
            <CardDescription>Daily requests over the last 7 days.</CardDescription>
          </CardHeader>
          <CardContent className="px-2 sm:p-6">
            <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="fillRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-requests)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-requests)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  tickLine={false} 
                  axisLine={false} 
                  tickMargin={8}
                  tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { weekday: "short" })}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area 
                  type="monotone" 
                  dataKey="requests" 
                  stroke="var(--color-requests)" 
                  fillOpacity={1} 
                  fill="url(#fillRequests)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Top Regions</CardTitle>
              <CardDescription>Where your traffic is coming from.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "United States", value: "45%", color: "bg-primary" },
                  { name: "Europe", value: "30%", color: "bg-primary/70" },
                  { name: "Asia", value: "15%", color: "bg-primary/40" },
                  { name: "Others", value: "10%", color: "bg-muted" },
                ].map((region) => (
                  <div key={region.name} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{region.name}</span>
                      <span className="font-medium">{region.value}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div className={`h-full ${region.color}`} style={{ width: region.value }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Performance Insights</CardTitle>
              <CardDescription>AI-powered suggestions for your app.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <HugeiconsIcon icon={ChartLineData01Icon} size={16} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Optimize Image Assets</p>
                    <p className="text-xs text-muted-foreground">
                      Your landing page images could be compressed by 40% to improve LCP by ~200ms.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <HugeiconsIcon icon={Clock01Icon} size={16} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Edge Caching Opportunity</p>
                    <p className="text-xs text-muted-foreground">
                      Enabling edge caching for `/api/products` could reduce latency for Asian users by 60%.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
