'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React from 'react';
import { Location } from './location';
import ReportDetails from './report-details';

interface ReportContainerProps {
  defaultTab?: string;
  incident: string | null;
}

export const ReportContainer: React.FC<ReportContainerProps> = ({
  incident,
}) => {
  const [activeTab, setActiveTab] = React.useState('reportDetails');

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="flex h-full w-full flex-col"
    >
      <TabsList variant="default" className="w-full">
        <TabsTrigger value="reportDetails">Details</TabsTrigger>
        <TabsTrigger value="location">Location</TabsTrigger>
      </TabsList>
      <TabsContent value="reportDetails" className="m-0 min-h-0 flex-1">
        <ScrollArea className="h-full w-full">
          <ReportDetails incidentID={incident} />
        </ScrollArea>
      </TabsContent>
      <TabsContent value="location" className="m-0 min-h-0 flex-1">
        <div className="h-full w-full overflow-hidden">
          <Location incidentID={incident} isActive={activeTab === 'location'} />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ReportContainer;
