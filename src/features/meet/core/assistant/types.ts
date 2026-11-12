// @generated from LucentMeet/src/features/ai-assistant/domain/types.ts — DO NOT EDIT. Run `yarn meet:sync`.
/** Wire format of one conversation turn (Anthropic Messages API shape). */
export type ContentBlock =
  | { type: 'text'; text: string }
  | {
      type: 'tool_use';
      id: string;
      name: string;
      input: Record<string, unknown>;
      /** Opaque provider token that must be echoed back unchanged. */
      signature?: string;
    }
  | {
      type: 'tool_result';
      tool_use_id: string;
      content: string;
      is_error?: boolean;
    };

export interface ApiMessage {
  role: 'user' | 'assistant';
  content: string | ContentBlock[];
}

export interface TurnResponse {
  content: ContentBlock[];
  stop_reason: string;
}

export type ProposalKind = 'create' | 'update' | 'delete';
export type ProposalStatus =
  'pending' | 'applying' | 'applied' | 'dismissed' | 'failed';

/** What the model asked for. Nothing happens until the user confirms. */
export interface ProposalDraft {
  kind: ProposalKind;
  title: string;
  start?: Date;
  end?: Date;
  location?: string;
  allDay?: boolean;
  calendarId?: string;
  calendarName?: string;
  eventId?: string;
  /** For update/delete: the event as it is now. */
  before?: { title: string; start: Date; end: Date };
  /** ConflictType codes that applying this would cause. */
  warnings: string[];
}

export interface Proposal extends ProposalDraft {
  id: string;
  status: ProposalStatus;
  error?: string;
}

export interface UiMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  proposals?: Proposal[];
  isError?: boolean;
  /** Reveal with the typewriter effect (only the freshly received reply). */
  animate?: boolean;
}

export type AssistantPhase = 'idle' | 'thinking' | 'acting';
