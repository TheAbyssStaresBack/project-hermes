'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect, unstable_rethrow } from 'next/navigation';
import { z } from 'zod';

import { requireRole, userHasRole } from './dal';
import {
  createInviteToken,
  getSiteUrl,
  hashInviteToken,
  normalizeEmail,
} from './utils';
import type { AppRole, AuthActionState } from './types';

const passwordSchema = z
  .string()
  .trim()
  .min(8, 'Password must be at least 8 characters long.')
  .regex(/[a-zA-Z]/, 'Password must contain at least one letter.')
  .regex(/[0-9]/, 'Password must contain at least one number.');

const optionalNameSchema = z
  .string()
  .trim()
  .min(2, 'Full name must be at least 2 characters long.')
  .max(100, 'Full name must be 100 characters or fewer.')
  .or(z.literal(''))
  .transform((value) => value.trim());

const bootstrapAdminSchema = z
  .object({
    fullName: optionalNameSchema,
    email: z
      .string()
      .trim()
      .min(1, 'Email is required.')
      .email('Enter a valid email address.')
      .transform(normalizeEmail),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

const optionalExpirationSchema = z.preprocess(
  (value) => (value === '' ? undefined : value),
  z.coerce
    .number()
    .int('Expiration must be a whole number of days.')
    .min(1, 'Expiration must be at least 1 day.')
    .max(30, 'Expiration cannot exceed 30 days.')
    .optional()
);

const createInviteSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required.')
    .email('Enter a valid email address.')
    .transform(normalizeEmail),
  role: z.enum(['admin', 'responder']),
  expiresInDays: optionalExpirationSchema,
});

const acceptInviteSchema = z
  .object({
    token: z.string().trim().min(1, 'Invite token is required.'),
    fullName: optionalNameSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

const INITIAL_STATE: AuthActionState = {
  status: 'idle',
};

function asErrorState(
  message: string,
  fieldErrors?: Record<string, string[] | undefined>
): AuthActionState {
  return {
    status: 'error',
    message,
    fieldErrors,
  };
}

function inviteRoleAllowed(role: AppRole, canInviteAdmins: boolean) {
  if (role === 'responder') {
    return true;
  }

  return canInviteAdmins && role === 'admin';
}

async function releaseBootstrapClaim(email: string) {
  const supabase = await createClient();
  await supabase.rpc('release_bootstrap_admin_claim', {
    target_email: email,
  });
}

async function releaseInviteClaim(tokenHash: string) {
  const adminClient = createAdminClient();

  await adminClient.rpc('release_account_invite_claim', {
    target_token_hash: tokenHash,
  });
}

export async function createBootstrapAdminAction(
  previousState: AuthActionState = INITIAL_STATE,
  formData: FormData
): Promise<AuthActionState> {
  void previousState;

  const validatedFields = bootstrapAdminSchema.safeParse({
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!validatedFields.success) {
    return asErrorState(
      'Review the highlighted fields and try again.',
      validatedFields.error.flatten().fieldErrors
    );
  }

  const { fullName, email, password } = validatedFields.data;
  const supabase = await createClient();
  const adminClient = createAdminClient();

  let claimReserved = false;

  try {
    const { data: canBootstrap, error: bootstrapError } = await supabase.rpc(
      'bootstrap_registration_open'
    );

    if (bootstrapError) {
      throw bootstrapError;
    }

    if (!canBootstrap) {
      return asErrorState(
        'Initial registration is closed. Ask an admin to provision your account.'
      );
    }

    const { data: claimGranted, error: claimError } = await supabase.rpc(
      'claim_bootstrap_admin',
      {
        target_email: email,
      }
    );

    if (claimError) {
      throw claimError;
    }

    if (!claimGranted) {
      return asErrorState(
        'Initial registration is no longer available. Reload the page and try again.'
      );
    }

    claimReserved = true;

    const { error: createUserError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName || undefined,
      },
    });

    if (createUserError) {
      await releaseBootstrapClaim(email);
      claimReserved = false;

      return asErrorState(
        createUserError.message.includes('already')
          ? 'That email address is already registered.'
          : createUserError.message
      );
    }

    revalidatePath('/auth/login');
    revalidatePath('/auth/sign-up');
    revalidatePath('/');
  } catch (error) {
    unstable_rethrow(error);

    if (claimReserved) {
      await releaseBootstrapClaim(email);
    }

    return asErrorState(
      error instanceof Error
        ? error.message
        : 'Unable to create the initial admin account right now.'
    );
  }

  redirect('/auth/login?notice=bootstrap-admin-created');
}

export async function createAccountInviteAction(
  previousState: AuthActionState = INITIAL_STATE,
  formData: FormData
): Promise<AuthActionState> {
  void previousState;

  const inviter = await requireRole(['admin', 'super_admin']);
  const canInviteAdmins = userHasRole(inviter, 'super_admin');

  const validatedFields = createInviteSchema.safeParse({
    email: formData.get('email'),
    role: formData.get('role'),
    expiresInDays: formData.get('expiresInDays'),
  });

  if (!validatedFields.success) {
    return asErrorState(
      'Review the highlighted fields and try again.',
      validatedFields.error.flatten().fieldErrors
    );
  }

  const { email, role, expiresInDays } = validatedFields.data;

  if (!inviteRoleAllowed(role, canInviteAdmins)) {
    return asErrorState('You are not allowed to create invites for that role.');
  }

  const adminClient = createAdminClient();
  const sessionClient = await createClient();
  const token = createInviteToken();
  const tokenHash = hashInviteToken(token);
  const now = new Date();
  const expiresAt = expiresInDays
    ? new Date(
        now.getTime() + expiresInDays * 24 * 60 * 60 * 1000
      ).toISOString()
    : null;

  try {
    const { data: existingUsers, error: listUsersError } =
      await adminClient.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
      });

    if (listUsersError) {
      throw listUsersError;
    }

    if (
      existingUsers.users.some(
        (user) => normalizeEmail(user.email ?? '') === email
      )
    ) {
      return asErrorState('That email address already belongs to an account.');
    }

    await adminClient
      .from('account_invites')
      .update({
        revoked_at: now.toISOString(),
      })
      .eq('email', email)
      .is('accepted_at', null)
      .is('revoked_at', null)
      .lt('expires_at', now.toISOString());

    const { error: insertError } = await sessionClient
      .from('account_invites')
      .insert({
        email,
        role,
        invited_by: inviter.id,
        token_hash: tokenHash,
        expires_at: expiresAt,
      });

    if (insertError) {
      if (insertError.message.includes('account_invites_active_email_idx')) {
        return asErrorState(
          'There is already a pending invite for that email address.'
        );
      }

      throw insertError;
    }
  } catch (error) {
    unstable_rethrow(error);

    return asErrorState(
      error instanceof Error ? error.message : 'Unable to create invite.'
    );
  }

  const inviteUrl = `${getSiteUrl()}/auth/invite?token=${encodeURIComponent(
    token
  )}`;
  const mailBody = encodeURIComponent(
    `You have been invited to Project HERMES.\n\nOpen this link to finish your account setup:\n${inviteUrl}`
  );

  revalidatePath('/admin/invites');

  return {
    status: 'success',
    message: 'Invite created. Share the link directly or send it by email.',
    inviteUrl,
    inviteMailtoUrl: `mailto:${encodeURIComponent(
      email
    )}?subject=Project%20HERMES%20Invite&body=${mailBody}`,
    inviteEmail: email,
    inviteRole: role,
  };
}

export async function acceptAccountInviteAction(
  previousState: AuthActionState = INITIAL_STATE,
  formData: FormData
): Promise<AuthActionState> {
  void previousState;

  const validatedFields = acceptInviteSchema.safeParse({
    token: formData.get('token'),
    fullName: formData.get('fullName'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!validatedFields.success) {
    return asErrorState(
      'Review the highlighted fields and try again.',
      validatedFields.error.flatten().fieldErrors
    );
  }

  const { token, fullName, password } = validatedFields.data;
  const tokenHash = hashInviteToken(token);
  const adminClient = createAdminClient();

  let createdUserId: string | null = null;
  try {
    const { data: claimRows, error: claimError } = await adminClient.rpc(
      'claim_account_invite',
      {
        target_token_hash: tokenHash,
      }
    );

    if (claimError) {
      throw claimError;
    }

    const claimedInvite = Array.isArray(claimRows) ? claimRows[0] : null;

    if (!claimedInvite) {
      return asErrorState(
        'This invite is invalid, expired, or has already been used.'
      );
    }

    const { data: existingUsers, error: listUsersError } =
      await adminClient.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
      });

    if (listUsersError) {
      throw listUsersError;
    }

    if (
      existingUsers.users.some(
        (user) =>
          normalizeEmail(user.email ?? '') ===
          normalizeEmail(claimedInvite.email)
      )
    ) {
      await releaseInviteClaim(tokenHash);

      return asErrorState(
        'That invite email already belongs to an existing account.'
      );
    }

    const { data: createdUser, error: createUserError } =
      await adminClient.auth.admin.createUser({
        email: claimedInvite.email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName || undefined,
        },
      });

    if (createUserError || !createdUser.user) {
      await releaseInviteClaim(tokenHash);

      return asErrorState(
        createUserError?.message ?? 'Unable to create your account.'
      );
    }

    createdUserId = createdUser.user.id;

    const { data: completionRows, error: completionError } =
      await adminClient.rpc('complete_account_invite', {
        target_token_hash: tokenHash,
        target_user_id: createdUserId,
      });

    if (completionError) {
      throw completionError;
    }

    if (!Array.isArray(completionRows) || completionRows.length === 0) {
      throw new Error('Invite completion failed.');
    }

    revalidatePath('/admin/invites');
    revalidatePath('/auth/login');
  } catch (error) {
    unstable_rethrow(error);

    if (createdUserId) {
      await adminClient.auth.admin.deleteUser(createdUserId);
    }

    await releaseInviteClaim(tokenHash);

    return asErrorState(
      error instanceof Error ? error.message : 'Unable to accept this invite.'
    );
  }

  redirect('/auth/login?notice=invite-accepted');
}
