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
  return (
    <Tabs defaultValue="reportDetails" className="w-full border-1 rounded-xl">
      <TabsList variant="default" className="w-full">
        <TabsTrigger value="reportDetails">Report Details</TabsTrigger>
        <TabsTrigger value="location">Location</TabsTrigger>
      </TabsList>
      <TabsContent value="reportDetails" className="max-h-[calc(100vh-225px)]">
        <ScrollArea className="h-full w-full">
          <ReportDetails incidentID={incident} />
        </ScrollArea>
      </TabsContent>
      <TabsContent value="location">
        <Location incidentID={incident} />
      </TabsContent>
    </Tabs>
  );
};

export default ReportContainer;
