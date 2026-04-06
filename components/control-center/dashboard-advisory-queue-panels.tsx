'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { DashboardPayload } from '@/lib/control-center-dashboard';

const queueChartConfig = {
  count: {
    label: 'Incidents',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

type DashboardAdvisoryQueuePanelsProps = {
  advisorySummary: DashboardPayload['advisorySummary'];
  workflowSummary: DashboardPayload['workflowSummary'];
  criticalFeed: DashboardPayload['criticalFeed'];
};

function formatDate(value: string) {
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatStatusLabel(status: string) {
  return status.replace('_', ' ');
}

export function DashboardAdvisoryQueuePanels({
  advisorySummary,
  workflowSummary,
  criticalFeed,
}: DashboardAdvisoryQueuePanelsProps) {
  const queueChartData = [
    { status: 'new', count: workflowSummary.counts.new },
    { status: 'validated', count: workflowSummary.counts.validated },
    { status: 'in_progress', count: workflowSummary.counts.in_progress },
    { status: 'resolved', count: workflowSummary.counts.resolved },
    { status: 'dismissed', count: workflowSummary.counts.dismissed },
  ];

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Advisory Status</CardTitle>
          <CardDescription>
            Delivery health and recent advisory publishing activity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="recent">
            <TabsList variant="line" className="w-full">
              <TabsTrigger value="recent">Recent advisories</TabsTrigger>
              <TabsTrigger value="critical">Critical feed</TabsTrigger>
            </TabsList>
            <TabsContent value="recent" className="mt-4 flex flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">
                  {advisorySummary.advisoriesSent24h.toLocaleString()} sent
                  (24h)
                </Badge>
                <Badge variant="outline">
                  Delivery{' '}
                  {advisorySummary.deliverySuccessRate !== null
                    ? `${(advisorySummary.deliverySuccessRate * 100).toFixed(1)}%`
                    : 'N/A'}
                </Badge>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Published</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {advisorySummary.recentAdvisories.length > 0 ? (
                    advisorySummary.recentAdvisories.map((advisory) => (
                      <TableRow key={advisory.id}>
                        <TableCell className="max-w-[260px] truncate">
                          {advisory.title}
                        </TableCell>
                        <TableCell className="capitalize">
                          {advisory.channel.replace('_', ' ')}
                        </TableCell>
                        <TableCell>{formatDate(advisory.createdAt)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-muted-foreground">
                        No advisories posted yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="critical" className="mt-4">
              <ScrollArea className="h-60 pr-3">
                <div className="flex flex-col gap-2">
                  {criticalFeed.length > 0 ? (
                    criticalFeed.map((item) => (
                      <div
                        key={item.id}
                        className="bg-background flex flex-col gap-1 rounded-md border p-3"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium">{item.title}</p>
                          <Badge variant="outline">{item.level}</Badge>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {item.detail}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-muted-foreground rounded-md border p-3 text-sm">
                      No critical events in the feed.
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Incident Queue Health</CardTitle>
          <CardDescription>
            Workflow status distribution and SLA aging pressure.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <ChartContainer config={queueChartConfig} className="h-56 w-full">
            <BarChart data={queueChartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="status"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatStatusLabel(value)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar dataKey="count" fill="var(--color-count)" radius={6} />
            </BarChart>
          </ChartContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Queue metric</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Oldest open incident</TableCell>
                <TableCell>
                  {workflowSummary.oldestOpenIncidentMinutes !== null
                    ? `${workflowSummary.oldestOpenIncidentMinutes} min`
                    : 'N/A'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Over SLA incidents</TableCell>
                <TableCell>
                  {workflowSummary.overSlaCount.toLocaleString()}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
