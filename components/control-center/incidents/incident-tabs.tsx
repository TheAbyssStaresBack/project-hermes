'use client';

import { fetchIncidents, Incident } from '@/lib/supabase/reports';
import * as React from 'react';
import KanbanContent from './kanban-view/content';
import ChatBox from './report-view/chatbox';
import { ReportContainer } from './report-view/report-container';
import IncidentCard from './report-view/report-list/incidents-card';

interface TabsProps {
  defaultTab?: string;
}

function getLatestIncident(): string | null {
  const latestIncident = fetchIncidents(1);
  let latestIncidentID: string | null = null;

  latestIncident.then((incident: Incident[] | null) => {
    if (incident) latestIncidentID = incident[0].id;
  });

  return latestIncidentID;
}

export function IncidentTabs({ defaultTab = 'reports' }: TabsProps) {
  // prevent scrolling by the user
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
  }, []);

  const [activeTab, setActiveTab] = React.useState(defaultTab);
  const [selectedIncidentID, setSelectedIncidentID] = React.useState<
    string | null
  >(getLatestIncident());

  const handleOnIncidentClick = (clickedIncidentID: string) => {
    setSelectedIncidentID(clickedIncidentID);
  };

  const tabs = [
    {
      id: 'reports',
      label: 'Reports',
      content: (
        <div className="p-4 flex flex-ro gap-4 overflow-auto">
          <IncidentCard onIncidentSelect={handleOnIncidentClick} />
          <ChatBox />
          <ReportContainer incident={selectedIncidentID} />
        </div>
      ),
    },
    {
      id: 'resources',
      label: 'Kanban Board',
      content: (
        <div className="p-4 flex flex-row flex-1 w-full gap-4">
          <KanbanContent title="New" />
          <KanbanContent title="Validated" />
          <KanbanContent title="In Progress" />
          <KanbanContent title="Resolved" />
          <KanbanContent title="Dismissed" />
        </div>
      ),
    },
  ];

  return (
    <div className="w-full flex flex-col">
      {/* Tab Navigation */}
      <div className="flex w-full border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-6 py-3 font-medium transition-colors text-center ${
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
      <div className="w-full max-h-[calc(100vh-150px)] min-h-0 min-w-0">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            role="tabpanel"
            hidden={activeTab !== tab.id}
            className={activeTab === tab.id ? 'block w-full' : 'hidden'}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReportContainer;
