// @generated from LucentMeet/src/features/ai-assistant/domain/history.ts — DO NOT EDIT. Run `yarn meet:sync`.
import type { ApiMessage } from './types';

/**
 * Keeps the request small without ever sending an invalid conversation: the
 * window must start with a plain user message (never a dangling tool_result).
 */
export function trimHistory(history: ApiMessage[], max = 30): ApiMessage[] {
  if (history.length <= max) return history;
  const tail = history.slice(-max);
  const start = tail.findIndex(
    m => m.role === 'user' && typeof m.content === 'string',
  );
  return start === -1 ? history.slice(-1) : tail.slice(start);
}
