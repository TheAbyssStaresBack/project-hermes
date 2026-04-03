import ChatBox from '@/components/control-center/incidents/chatbox';
import { IncidentList } from '@/components/control-center/incidents/incident-list';
import { ReportContainer } from '@/components/control-center/incidents/report-container';

export default function Page() {
  return (
    <div className="@container/main flex flex-1 flex-row gap-2 px-2 py-4 md:gap-2 md:py-6 lg:px-6 h-screen">
      <IncidentList />
      <ChatBox />
      <ReportContainer />
    </div>
  );
}
