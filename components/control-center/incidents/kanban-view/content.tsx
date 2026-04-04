'use client';

import IncidentEntry from '@/components/control-center/incidents/report-view/report-list//incident-entry';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { fetchKanbanCategoryContents, Incident } from '@/lib/supabase/reports';
import React, { useEffect, useState } from 'react';
import CategoryCard from './category';

interface KanbanContentProps {
  title: string;
  incidentCount?: number;
  onIncidentSelect?: (id: string) => void;
  className?: string;
}

function KanbanContent({
  title,
  incidentCount = 50,
  onIncidentSelect,
  className = '',
}: KanbanContentProps) {
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);
  const [incidents, setIncidents] = useState<Incident[] | null>(null);
  const [loading, setLoading] = useState(true);

  // Map title to category status
  const categoryMap: Record<string, string> = {
    New: 'new',
    Validated: 'validated',
    In_Progress: 'in_progress',
    Resolved: 'resolved',
    Dismissed: 'dismissed',
  };

  const handleIncidentClick = (id: string) => {
    setSelectedIncident(id);
    onIncidentSelect?.(id);
  };

  // Fetch incidents whenever title or incidentCount changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const category = categoryMap[title] || title.toLowerCase();
      const incidentArray = await fetchKanbanCategoryContents(
        category,
        incidentCount
      );
      setIncidents(incidentArray);
      setLoading(false);
    };

    fetchData();
  }, [title, incidentCount]); // ← Add dependency array

  return (
    <CategoryCard title={title} className={className}>
      <ScrollArea className="h-full rounded-md flex max-h-[calc(100vh-275px)]">
        <div className="p-4">
          {loading ? (
            <p className="text-sm text-gray-500">Loading incidents...</p>
          ) : incidents && incidents.length > 0 ? (
            incidents.map((incident, index) => (
              <React.Fragment key={incident.id}>
                <div className="text-sm">
                  <IncidentEntry
                    id={incident.incident_time}
                    isSelected={selectedIncident === incident.id}
                    onClick={handleIncidentClick}
                  />
                </div>
                {index < incidents.length - 1 && <Separator className="my-2" />}
              </React.Fragment>
            ))
          ) : (
            <p className="text-sm text-gray-500">No incidents found</p>
          )}
        </div>
      </ScrollArea>
    </CategoryCard>
  );
}

export default KanbanContent;
