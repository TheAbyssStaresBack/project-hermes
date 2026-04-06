'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { useIsMobile } from '@/hooks/use-mobile';
import { fetchIncidents } from '@/lib/supabase/reports';
import * as React from 'react';
import KanbanContent from './kanban-view/content';
import { ChatBox } from './report-view/chatbox';
import { ReportContainer } from './report-view/report-container';
import IncidentCard from './report-view/report-list/incidents-card';

export function IncidentTabs() {
  const [selectedIncidentID, setSelectedIncidentID] = React.useState<
    string | null
  >(null);
  const isMobile = useIsMobile();

  React.useEffect(() => {
    const loadInitialIncident = async () => {
      const incidents = await fetchIncidents(undefined, undefined, 1);
      if (incidents && incidents.length > 0) {
        setSelectedIncidentID(incidents[0].id);
      }
    };
    loadInitialIncident();
  }, []);

  const handleOnIncidentClick = (clickedIncidentID: string) => {
    setSelectedIncidentID(clickedIncidentID);
  };

  return (
    <Tabs defaultValue="reports" className="w-full">
      <TabsList variant="line" className="w-full flex flex-1 flex-row">
        <TabsTrigger value="reports">Reports</TabsTrigger>
        <TabsTrigger value="kanban">Kanban</TabsTrigger>
      </TabsList>
      <TabsContent value="reports" className="w-full">
        {isMobile ? (
          <div className="flex w-full flex-col gap-4">
            <IncidentCard onIncidentSelect={handleOnIncidentClick} />
            <ChatBox incidentId={selectedIncidentID} />
            <ReportContainer incident={selectedIncidentID} />
          </div>
        ) : (
          <ResizablePanelGroup
            orientation="horizontal"
            className="min-h-[calc(100vh-180px)] w-full rounded-xl border"
          >
            <ResizablePanel defaultSize="24%" minSize="20%">
              <IncidentCard onIncidentSelect={handleOnIncidentClick} />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize="33%" minSize="25%">
              <ChatBox incidentId={selectedIncidentID} />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize="43%" minSize="30%">
              <ReportContainer incident={selectedIncidentID} />
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </TabsContent>
      <TabsContent value="kanban" className="flex flex-row w-full gap-4">
        <KanbanContent title="New" />
        <KanbanContent title="Validated" />
        <KanbanContent title="In_Progress" />
        <KanbanContent title="Resolved" />
        <KanbanContent title="Dismissed" />
      </TabsContent>
    </Tabs>
  );
}
