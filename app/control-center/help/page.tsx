import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function Page() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Help</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Useful links and health checks for running the system.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>System status page</CardTitle>
            <CardDescription>
              Human-readable health and readiness overview.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Open the status page here:
            </p>
            <Link
              href="/status"
              className="mt-3 inline-flex items-center text-sm font-medium underline underline-offset-4 hover:text-foreground"
            >
              /status
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Health check endpoints</CardTitle>
            <CardDescription>
              Use these endpoints for monitoring, load balancers, or CI probes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Liveness</p>
                <p className="text-sm text-muted-foreground">
                  <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                    GET /api/healthz
                  </code>
                </p>
              </div>

              <div>
                <p className="text-sm font-medium">Readiness</p>
                <p className="text-sm text-muted-foreground">
                  <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                    GET /api/readyz
                  </code>
                  <span className="ml-2 text-xs text-muted-foreground">
                    returns <span className="font-mono">503</span> when not
                    ready
                  </span>
                </p>
              </div>

              <div className="text-xs text-muted-foreground">
                Tip: you can also use <span className="font-mono">HEAD</span>{' '}
                for readiness/liveness when you only need status codes.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
