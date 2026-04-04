'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import React, { useState } from 'react';
import Location from './location';
import ReportDetails from './report-details';

interface ReportContainerProps {
  defaultTab?: string;
  incident: string | null;
}

export const ReportContainer: React.FC<ReportContainerProps> = ({
  defaultTab = 'details',
  incident,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const tabs = [
    {
      id: 'details',
      label: 'Report Details',
      content: (
        <div className="p-4">
          <ReportDetails incidentID={incident} />
        </div>
      ),
    },
    {
      id: 'location',
      label: 'Location',
      content: (
        <div className="p-4">
          <Location />
        </div>
      ),
    },
  ];

  return (
    <ScrollArea
      className={`max-h-[calc(100vh-175px)] w-full rounded-md border`}
    >
      <div className="w-full">
        {/* Tab Navigation */}
        <div className="flex w-full border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-row flex-1 px-6 py-3 font-medium transition-colors text-center ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              aria-selected={activeTab === tab.id}
              role="tab"
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-0">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              role="tabpanel"
              hidden={activeTab !== tab.id}
              className={activeTab === tab.id ? 'block' : 'hidden'}
            >
              {tab.content}
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};

export default ReportContainer;
