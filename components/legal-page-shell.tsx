import Link from 'next/link';

type LegalPageShellProps = {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
};

export function LegalPageShell({
  title,
  lastUpdated,
  children,
}: LegalPageShellProps) {
  return (
    <main className="min-h-svh bg-background">
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Home
          </Link>
          <nav className="flex gap-6 text-sm">
            <Link
              href="/terms"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy
            </Link>
          </nav>
        </div>
      </div>
      <article className="mx-auto max-w-3xl px-5 py-10 pb-16">
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
        </header>
        <div className="legal-doc space-y-6 text-sm leading-relaxed text-foreground/90">
          {children}
        </div>
      </article>
    </main>
  );
}
