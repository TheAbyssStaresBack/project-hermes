import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { AdvisoryListItem } from '@/lib/advisories/types';
import { formatSmartDateTime } from '@/lib/date';

export function AdvisoryCard({ advisory }: { advisory: AdvisoryListItem }) {
  const authorName = advisory.creator_name?.trim() || 'Response team';

  return (
    <Card>
      <CardHeader>
        <CardDescription className="flex flex-wrap items-center gap-1.5">
          <span>{authorName}</span>
          <span>posted {formatSmartDateTime(advisory.created_at)}</span>
        </CardDescription>
        <div className="space-y-1">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Title
          </p>
          <CardTitle className="text-lg leading-tight">
            {advisory.title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Message
        </p>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
          {advisory.message}
        </p>
      </CardContent>
    </Card>
  );
}
