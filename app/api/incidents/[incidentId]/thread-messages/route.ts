import { ThreadImpl, deriveChannelId } from 'chat';

import { requireRole } from '@/lib/auth/dal';
import { adapters, state as botState } from '@/lib/bot/adapters';
import { createAdminClient } from '@/lib/supabase/admin';
import type { Database } from '@/types/supabase';

type AdapterName = keyof typeof adapters;

type ThreadMessageResponse = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
};

type ThreadResolution = {
  thread: ThreadImpl;
  threadId: string;
};

const MESSAGE_HISTORY_LIMIT = 100;

async function resolveIncidentThread(
  incidentId: string
): Promise<ThreadResolution | null> {
  const supabase = createAdminClient();

  const { data: incident, error: incidentError } = await supabase
    .from('incidents')
    .select('reported_by')
    .eq('id', incidentId)
    .maybeSingle();

  if (incidentError) {
    throw new Error('Failed to resolve incident.');
  }

  if (!incident?.reported_by) {
    return null;
  }

  const { data: resident, error: residentError } = await supabase
    .from('residents')
    .select('thread_id, platform')
    .eq('id', incident.reported_by)
    .maybeSingle();

  if (residentError) {
    throw new Error('Failed to resolve incident thread.');
  }

  if (!resident?.thread_id) {
    return null;
  }

  const adapterName = resident.thread_id.split(':', 1)[0] as AdapterName;
  const adapter =
    adapters[adapterName] ??
    adapters[
      resident.platform as Database['public']['Enums']['resident_platform']
    ];

  if (!adapter) {
    return null;
  }

  const thread = new ThreadImpl({
    id: resident.thread_id,
    channelId: deriveChannelId(adapter, resident.thread_id),
    adapter,
    stateAdapter: botState,
    isDM: true,
  });

  return {
    thread,
    threadId: resident.thread_id,
  };
}

export async function GET(
  _request: Request,
  context: RouteContext<'/api/incidents/[incidentId]/thread-messages'>
) {
  await requireRole(['responder', 'admin', 'super_admin']);

  const { incidentId } = await context.params;

  if (!incidentId) {
    return Response.json(
      { error: 'Incident id is required.' },
      { status: 400 }
    );
  }

  let resolution: ThreadResolution | null = null;

  try {
    resolution = await resolveIncidentThread(incidentId);
  } catch (error) {
    console.error('Failed to resolve incident thread for history:', {
      incidentId,
      error,
    });

    return Response.json(
      { error: 'Failed to resolve incident thread.' },
      { status: 500 }
    );
  }

  if (!resolution) {
    return Response.json({ messages: [] });
  }

  const messages: ThreadMessageResponse[] = [];

  try {
    for await (const message of resolution.thread.allMessages) {
      if (!message.text || !message.text.trim()) {
        continue;
      }

      messages.push({
        id: message.id,
        content: message.text,
        role: message.author.isMe ? 'assistant' : 'user',
        timestamp: message.metadata.dateSent.toISOString(),
      });

      if (messages.length >= MESSAGE_HISTORY_LIMIT) {
        break;
      }
    }

    return Response.json({ messages });
  } catch (error) {
    console.error('Failed to fetch thread history for incident:', {
      incidentId,
      threadId: resolution.threadId,
      error,
    });

    return Response.json(
      { error: 'Failed to read thread history.' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  context: RouteContext<'/api/incidents/[incidentId]/thread-messages'>
) {
  await requireRole(['responder', 'admin', 'super_admin']);

  const { incidentId } = await context.params;

  if (!incidentId) {
    return Response.json(
      { error: 'Incident id is required.' },
      { status: 400 }
    );
  }

  let message = '';

  try {
    const body = (await request.json()) as { message?: unknown };
    message = typeof body.message === 'string' ? body.message.trim() : '';
  } catch {
    return Response.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  if (!message) {
    return Response.json({ error: 'Message is required.' }, { status: 400 });
  }

  let resolution: ThreadResolution | null = null;

  try {
    resolution = await resolveIncidentThread(incidentId);
  } catch (error) {
    console.error('Failed to resolve incident thread for send:', {
      incidentId,
      error,
    });

    return Response.json(
      { error: 'Failed to resolve incident thread.' },
      { status: 500 }
    );
  }

  if (!resolution) {
    return Response.json(
      { error: 'No thread found for this incident.' },
      { status: 404 }
    );
  }

  try {
    const sent = await resolution.thread.post(message);

    return Response.json({
      message: {
        id: sent.id,
        content: sent.text,
        role: sent.author.isMe ? 'assistant' : 'user',
        timestamp: sent.metadata.dateSent.toISOString(),
      } as ThreadMessageResponse,
    });
  } catch (error) {
    console.error('Failed to send thread message for incident:', {
      incidentId,
      threadId: resolution.threadId,
      error,
    });

    return Response.json({ error: 'Failed to send message.' }, { status: 500 });
  }
}
