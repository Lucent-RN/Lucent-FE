// @generated from LucentMeet/src/features/calendar/domain/models/types.ts — DO NOT EDIT. Run `yarn meet:sync`.
export type ProviderType = 'GOOGLE' | 'APPLE';
export type AvailabilityStatus = 'BUSY' | 'FREE' | 'TENTATIVE';
export type EventLifecycleState =
  'DRAFT' | 'SYNCED' | 'CONFLICTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type ConflictType =
  'DIRECT_OVERLAP' | 'BUFFER_VIOLATION' | 'OUTSIDE_WORKING_HOURS';
export type SyncStatus = 'IDLE' | 'SYNCING' | 'OK' | 'ERROR' | 'REVOKED';
