'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardAction,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useIsMobile } from '@/hooks/use-mobile';
import type { DashboardPayload } from '@/lib/control-center-dashboard';

export const description = 'Incident reporting and advisory trends';

const chartConfig = {
  incidentsReported: {
    label: 'Incidents reported',
    theme: {
      light: 'hsl(12 76% 61%)',
      dark: 'hsl(0 0% 96%)',
    },
  },
  advisoriesPublished: {
    label: 'Advisories published',
    theme: {
      light: 'hsl(173 58% 39%)',
      dark: 'hsl(0 0% 88%)',
    },
  },
  resolvedIncidents: {
    label: 'Resolved incidents',
    theme: {
      light: 'hsl(197 37% 24%)',
      dark: 'hsl(0 0% 78%)',
    },
  },
} satisfies ChartConfig;

type ChartAreaInteractiveProps = {
  trendSeries: DashboardPayload['trendSeries'];
};

export function ChartAreaInteractive({
  trendSeries,
}: ChartAreaInteractiveProps) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState('90d');
  const [metric, setMetric] = React.useState<
    'both' | 'incidents' | 'advisories'
  >('both');

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange('7d');
    }
  }, [isMobile]);

  const filteredData = trendSeries.points.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date();
    const daysToSubtract =
      timeRange === '30d' ? 30 : timeRange === '7d' ? 7 : 90;
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="@container/card">
      <CardHeader className="gap-4">
        <div className="space-y-1">
          <CardTitle>Incident Trends</CardTitle>
          <CardDescription className="max-w-prose">
            Last{' '}
            {timeRange === '90d'
              ? '3 months'
              : timeRange === '30d'
                ? '30 days'
                : '7 days'}{' '}
            of incident and advisory activity
          </CardDescription>
        </div>
        <CardAction className="w-full sm:w-auto">
          <div className="flex w-full flex-col gap-3 sm:items-end">
            <Tabs
              value={metric}
              onValueChange={(value) =>
                setMetric(value as 'both' | 'incidents' | 'advisories')
              }
              className="w-full sm:w-auto"
            >
              <TabsList
                variant="line"
                className="flex w-full justify-start overflow-x-auto whitespace-nowrap sm:w-fit"
              >
                <TabsTrigger value="both">Overview</TabsTrigger>
                <TabsTrigger value="incidents">Incidents</TabsTrigger>
                <TabsTrigger value="advisories">Advisories</TabsTrigger>
              </TabsList>
            </Tabs>

            <ToggleGroup
              type="single"
              value={timeRange}
              onValueChange={(value) => {
                if (value) setTimeRange(value);
              }}
              variant="outline"
              className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
            >
              <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
              <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
              <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
            </ToggleGroup>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger
                className="flex w-full **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden sm:w-40"
                size="sm"
                aria-label="Select a value"
              >
                <SelectValue placeholder="Last 3 months" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="90d" className="rounded-lg">
                  Last 3 months
                </SelectItem>
                <SelectItem value="30d" className="rounded-lg">
                  Last 30 days
                </SelectItem>
                <SelectItem value="7d" className="rounded-lg">
                  Last 7 days
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-2 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-56 w-full sm:h-62.5"
        >
          <AreaChart
            data={filteredData}
            margin={{ top: 8, right: 4, left: 0, bottom: isMobile ? 8 : 0 }}
          >
            <defs>
              <linearGradient
                id="fillIncidentsReported"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-incidentsReported)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-incidentsReported)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient
                id="fillAdvisoriesPublished"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-advisoriesPublished)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-advisoriesPublished)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient
                id="fillResolvedIncidents"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-resolvedIncidents)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-resolvedIncidents)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={isMobile ? 20 : 32}
              tick={{ fontSize: isMobile ? 11 : 12 }}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              }
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })
                  }
                  indicator="dot"
                />
              }
            />
            {metric !== 'incidents' ? (
              <Area
                dataKey="advisoriesPublished"
                type="natural"
                fill="url(#fillAdvisoriesPublished)"
                stroke="var(--color-advisoriesPublished)"
                stackId="a"
              />
            ) : null}
            {metric !== 'advisories' ? (
              <Area
                dataKey="incidentsReported"
                type="natural"
                fill="url(#fillIncidentsReported)"
                stroke="var(--color-incidentsReported)"
                stackId="a"
              />
            ) : null}
            {metric === 'both' ? (
              <Area
                dataKey="resolvedIncidents"
                type="natural"
                fill="url(#fillResolvedIncidents)"
                stroke="var(--color-resolvedIncidents)"
                stackId="a"
              />
            ) : null}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
