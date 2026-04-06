import { createPostgresState } from '@chat-adapter/state-pg';
import { createTelegramAdapter } from '@chat-adapter/telegram';
import { createMessengerAdapter } from 'chat-adapter-messenger';

const telegram = createTelegramAdapter({
  mode: 'webhook',
});

const messenger = createMessengerAdapter();

export const adapters = { telegram, messenger };

export const state = createPostgresState();
