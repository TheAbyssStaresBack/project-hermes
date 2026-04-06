'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchIncidents } from '@/lib/supabase/reports';
import * as React from 'react';
import KanbanContent from './kanban-view/content';
import { ReportTableCard } from './report-table-view/report-table-card';
import { ChatBox } from './report-view/chatbox';
import { ReportContainer } from './report-view/report-container';
import IncidentCard from './report-view/report-list/incidents-card';

export function IncidentTabs() {
  const [selectedIncidentID, setSelectedIncidentID] = React.useState<
    string | null
  >(null);

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
    <Tabs defaultValue="reports" className="w-full h-full flex flex-col">
      <TabsList variant="line" className="w-full flex-row max-h-50">
        <TabsTrigger value="reports" className="max-h-50">
          Reports
        </TabsTrigger>
        <TabsTrigger value="kanban" className="max-h-50">
          Kanban
        </TabsTrigger>
        <TabsTrigger value="reportTable" className="max-h-50">
          Report Table
        </TabsTrigger>
      </TabsList>
      <TabsContent
        value="reports"
        className="flex flex-row w-full gap-4 h-full"
      >
        <IncidentCard onIncidentSelect={handleOnIncidentClick} />
        <ChatBox incidentId={selectedIncidentID} />
        <ReportContainer incident={selectedIncidentID} />
      </TabsContent>
      <TabsContent value="kanban" className="flex flex-row w-full gap-4 h-full">
        <KanbanContent title="New" />
        <KanbanContent title="Validated" />
        <KanbanContent title="In_Progress" />
        <KanbanContent title="Resolved" />
        <KanbanContent title="Dismissed" />
      </TabsContent>
      <TabsContent
        value="reportTable"
        className="flex flex-row w-full gap-4 h-full"
      >
        <ReportTableCard />
      </TabsContent>
    </Tabs>
  );
}
