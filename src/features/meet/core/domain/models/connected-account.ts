// @generated from LucentMeet/src/features/calendar/domain/models/connected-account.ts — DO NOT EDIT. Run `yarn meet:sync`.
import type { ProviderType, SyncStatus } from './types';

export class ConnectedAccount {
  constructor(
    readonly accountId: string,
    readonly provider: ProviderType,
    readonly accountEmail: string,
    readonly syncStatus: SyncStatus,
    readonly lastSyncedAt: Date | null,
    readonly tokenExpiry: Date | null,
    readonly lastError: string | null = null,
  ) {}

  get needsReauth(): boolean {
    return this.syncStatus === 'REVOKED';
  }

  isTokenExpired(now: Date = new Date()): boolean {
    return (
      this.tokenExpiry !== null && this.tokenExpiry.getTime() <= now.getTime()
    );
  }
}
