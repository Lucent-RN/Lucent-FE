// @generated from LucentMeet/src/features/calendar/domain/models/types.ts — DO NOT EDIT. Run `yarn meet:sync`.
/** GOOGLE = legacy API link; APPLE = calendars read from the phone (EventKit / Calendar Provider); ICS = subscribed iCal feed. */
export type ProviderType = 'GOOGLE' | 'APPLE' | 'ICS';

export const providerLabel = (p: ProviderType) => (p === 'GOOGLE' ? 'Google' : p === 'ICS' ? 'iCal feed' : 'Phone');
export type AvailabilityStatus = 'BUSY' | 'FREE' | 'TENTATIVE';
export type EventLifecycleState = 'DRAFT' | 'SYNCED' | 'CONFLICTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type ConflictType = 'DIRECT_OVERLAP' | 'BUFFER_VIOLATION' | 'OUTSIDE_WORKING_HOURS';
export type SyncStatus = 'IDLE' | 'SYNCING' | 'OK' | 'ERROR' | 'REVOKED';
