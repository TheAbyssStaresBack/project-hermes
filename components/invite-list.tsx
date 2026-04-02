'use client';

import { useActionState } from 'react';

import { reissueAccountInviteAction } from '@/lib/auth/actions';
import type { AuthActionState, InviteRecord } from '@/lib/auth/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const INITIAL_STATE: AuthActionState = {
  status: 'idle',
};

function formatTimestamp(value: string | null) {
  if (!value) {
    return 'Never';
  }

  return new Intl.DateTimeFormat('en-PH', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function getInviteStatus(
  invite: Pick<InviteRecord, 'accepted_at' | 'revoked_at' | 'expires_at'>
) {
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

function canReissue(invite: InviteRecord) {
  return invite.accepted_at === null;
}

export function InviteList({ invites }: { invites: InviteRecord[] }) {
  const [state, action, pending] = useActionState(
    reissueAccountInviteAction,
    INITIAL_STATE
  );

  return (
    <div className="flex flex-col gap-4">
      {state.message ? (
        <p
          className={cn(
            'text-sm',
            state.status === 'success' ? 'text-emerald-600' : 'text-red-500'
          )}
        >
          {state.message}
        </p>
      ) : null}

      {state.inviteUrl ? (
        <Card>
          <CardHeader>
            <CardTitle>Reissued invite ready</CardTitle>
            <CardDescription>
              Fresh single-use link for {state.inviteEmail}.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="reissued-invite-link">Secure invite link</Label>
              <Input
                id="reissued-invite-link"
                value={state.inviteUrl}
                readOnly
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <a href={state.inviteUrl}>Open invite</a>
              </Button>
              {state.inviteMailtoUrl ? (
                <Button asChild variant="outline">
                  <a href={state.inviteMailtoUrl}>Send by email</a>
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Recent invites</CardTitle>
          <CardDescription>
            Pending, expired, revoked, and completed invite records.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {invites.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-muted-foreground">
                  <tr className="border-b">
                    <th className="py-3 pr-4 font-medium">Email</th>
                    <th className="py-3 pr-4 font-medium">Role</th>
                    <th className="py-3 pr-4 font-medium">Status</th>
                    <th className="py-3 pr-4 font-medium">Created</th>
                    <th className="py-3 pr-4 font-medium">Expires</th>
                    <th className="py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {invites.map((invite) => (
                    <tr key={invite.id} className="border-b align-top">
                      <td className="py-3 pr-4">{invite.email}</td>
                      <td className="py-3 pr-4">{invite.role}</td>
                      <td className="py-3 pr-4">{getInviteStatus(invite)}</td>
                      <td className="py-3 pr-4">
                        {formatTimestamp(invite.created_at)}
                      </td>
                      <td className="py-3 pr-4">
                        {invite.expires_at
                          ? formatTimestamp(invite.expires_at)
                          : 'No expiration'}
                      </td>
                      <td className="py-3">
                        {canReissue(invite) ? (
                          <form action={action}>
                            <input
                              type="hidden"
                              name="inviteId"
                              value={invite.id}
                            />
                            <Button
                              type="submit"
                              size="sm"
                              variant="outline"
                              disabled={pending}
                            >
                              Reissue
                            </Button>
                          </form>
                        ) : (
                          <span className="text-muted-foreground">
                            Unavailable
                          </span>
                        )}
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
  );
}
