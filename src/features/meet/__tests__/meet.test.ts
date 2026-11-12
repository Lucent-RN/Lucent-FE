import { describe, expect, it } from 'vitest';
import { executeTool, type ToolEnv } from '../core/assistant/tool-executor';
import { ConflictDetectionEngine, SchedulingPreference } from '../core/domain';
import { layoutDayEvents } from '../core/layout/layout-day-events';
import { buildDemoData } from '../data/demo-data';
import { fromInputValue, tint, toInputValue } from '../lib/datetime';

const NOW = new Date(2030, 0, 7, 8, 0); // Monday, local time

describe('demo workspace', () => {
  const d = buildDemoData(NOW);
  const engine = new ConflictDetectionEngine();

  it('has accounts across providers, sources and events', () => {
    expect(new Set(d.accounts.map((a) => a.provider))).toEqual(
      new Set(['GOOGLE', 'APPLE'])
    );
    expect(d.sources.length).toBeGreaterThanOrEqual(3);
    expect(d.events.length).toBeGreaterThan(10);
  });

  it('shows real clashes through the shared conflict engine', () => {
    const found = engine.detectAllConflicts(d.events, {
      preference: d.preference,
      timeZone: 'UTC'
    });
    // design review 10:00–11:00 vs sprint planning 10:30–11:30 on the same day
    expect(found.some((c) => c.type === 'DIRECT_OVERLAP')).toBe(true);
  });
});

describe('time grid layout', () => {
  it('puts overlapping events side by side', () => {
    const d = buildDemoData(NOW);
    const overlapping = d.events.filter(
      (e) => e.startTime.getDate() === NOW.getDate() && !e.isAllDay
    );
    const placed = layoutDayEvents(overlapping, new Date(2030, 0, 7));
    const twoCols = placed.filter((p) => p.columns === 2);
    expect(twoCols.length).toBeGreaterThanOrEqual(2);
    expect(new Set(twoCols.map((p) => p.column)).size).toBe(2);
  });
});

describe('assistant tools run in the browser', () => {
  const d = buildDemoData(NOW);
  const env: ToolEnv = {
    events: d.events,
    allEvents: d.events,
    sources: d.sources,
    preference: new SchedulingPreference({
      preferenceId: 'p',
      workingDays: [1, 2, 3, 4, 5],
      workStartTime: '09:00',
      workEndTime: '18:00',
      bufferMinutesAfterMeeting: 0,
      defaultReminderMinutes: 10
    }),
    timeZone: 'UTC',
    engine: new ConflictDetectionEngine(),
    now: NOW
  };

  it('lists events in a range', () => {
    const out = JSON.parse(
      executeTool(
        'list_events',
        {
          from: new Date(2030, 0, 7).toISOString(),
          to: new Date(2030, 0, 8).toISOString()
        },
        env
      ).content
    );
    expect(out.count).toBeGreaterThan(3);
  });

  it('proposals never create anything by themselves', () => {
    const before = env.events.length;
    const r = executeTool(
      'propose_create_event',
      {
        title: 'Sync',
        start: new Date(2030, 0, 7, 10, 15).toISOString(),
        end: new Date(2030, 0, 7, 10, 45).toISOString()
      },
      env
    );
    expect(r.proposal?.kind).toBe('create');
    expect(env.events).toHaveLength(before);
  });
});

describe('datetime helpers', () => {
  it('round-trips datetime-local values', () => {
    const d = new Date(2030, 4, 9, 14, 5);
    expect(toInputValue(d)).toBe('2030-05-09T14:05');
    expect(fromInputValue('2030-05-09T14:05')?.getTime()).toBe(d.getTime());
    expect(toInputValue(d, true)).toBe('2030-05-09');
    expect(fromInputValue('')).toBeNull();
  });
  it('tints a hex colour', () => {
    expect(tint('#4285F4', 0.5)).toBe('#4285F480');
  });
});
