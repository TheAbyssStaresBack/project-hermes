import { ChartAreaInteractive } from '@/components/control-center/chart-area-interactive';
import { DashboardAdvisoryQueuePanels } from '@/components/control-center/dashboard-advisory-queue-panels';
import { DashboardMapPreview } from '@/components/control-center/dashboard-map-preview';
import { SectionCards } from '@/components/control-center/section-cards';
import { requireUser } from '@/lib/auth/dal';
import { getControlCenterDashboardPayload } from '@/lib/control-center-dashboard';

export default async function Page() {
  const viewer = await requireUser();
  const dashboard = await getControlCenterDashboardPayload(viewer);

  return (
    <div className="@container/main flex flex-1 flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
      <SectionCards kpis={dashboard.kpis} />
      <ChartAreaInteractive trendSeries={dashboard.trendSeries} />
      <DashboardMapPreview mapMarkers={dashboard.mapMarkers} />
      <DashboardAdvisoryQueuePanels
        advisorySummary={dashboard.advisorySummary}
        kpis={dashboard.kpis}
        workflowSummary={dashboard.workflowSummary}
      />
    </div>
  );
}
