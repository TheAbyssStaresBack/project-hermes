import { InviteCreateForm } from '@/components/invite-create-form';
import { requireRole, userHasRole } from '@/lib/auth/dal';
import { createClient } from '@/lib/supabase/server';
import type { AppRole } from '@/lib/auth/types';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { connection } from 'next/server';

function formatTimestamp(value: string | null) {
  if (!value) {
    return 'Never';
  }

  return new Intl.DateTimeFormat('en-PH', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function getInviteStatus(invite: {
  accepted_at: string | null;
  revoked_at: string | null;
  expires_at: string | null;
}) {
  if (invite.accepted_at) {
    return 'Accepted';
  }

  if (invite.revoked_at) {
    return 'Revoked';
  }

  if (
    invite.expires_at &&
    new Date(invite.expires_at).getTime() <= Date.now()
  ) {
    return 'Expired';
  }

  return 'Pending';
}

export default async function Page() {
  await connection();

  const user = await requireRole(['admin', 'super_admin']);
  const supabase = await createClient();
  const { data: invites, error } = await supabase
    .from('account_invites')
    .select('id, email, role, created_at, expires_at, accepted_at, revoked_at')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  const allowedRoles: AppRole[] = userHasRole(user, 'super_admin')
    ? ['responder', 'admin']
    : ['responder'];

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 p-6 md:p-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Account invites
            </h1>
            <p className="text-sm text-muted-foreground">
              Provision new staff accounts without reopening public
              registration.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/">Back to home</Link>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
          <InviteCreateForm allowedRoles={allowedRoles} />

          <Card>
            <CardHeader>
              <CardTitle>Recent invites</CardTitle>
              <CardDescription>
                Pending, expired, and completed invite records.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {invites && invites.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="text-muted-foreground">
                      <tr className="border-b">
                        <th className="py-3 pr-4 font-medium">Email</th>
                        <th className="py-3 pr-4 font-medium">Role</th>
                        <th className="py-3 pr-4 font-medium">Status</th>
                        <th className="py-3 pr-4 font-medium">Created</th>
                        <th className="py-3 font-medium">Expires</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invites.map((invite) => (
                        <tr key={invite.id} className="border-b align-top">
                          <td className="py-3 pr-4">{invite.email}</td>
                          <td className="py-3 pr-4">{invite.role}</td>
                          <td className="py-3 pr-4">
                            {getInviteStatus(invite)}
                          </td>
                          <td className="py-3 pr-4">
                            {formatTimestamp(invite.created_at)}
                          </td>
                          <td className="py-3">
                            {invite.expires_at
                              ? formatTimestamp(invite.expires_at)
                              : 'No expiration'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No invites have been created yet.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
