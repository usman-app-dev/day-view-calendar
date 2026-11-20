import { CalendarEvent } from './model';
import { DAY_DURATION_MINUTES, formatClockTime, generateRowLabels, positionEvents } from './util';

describe('formatClockTime', () => {
  it('formats minutes since day start as hh:mm', () => {
    expect(formatClockTime(0)).toBe('09:00');
    expect(formatClockTime(90)).toBe('10:30');
  });
});

describe('generateRowLabels', () => {
  it('produces one label per hour', () => {
    expect(generateRowLabels()).toEqual([
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
    ]);
  });
});

describe('positionEvents', () => {
  it('returns an empty array for no events', () => {
    expect(positionEvents([])).toEqual([]);
  });

  it('gives a single event the full width', () => {
    const events: CalendarEvent[] = [{ start: 30, end: 120 }];
    const [event] = positionEvents(events);

    expect(event.left).toBe(0);
    expect(event.width).toBe(100);
  });

  it('computes top/height as a percentage of the day duration', () => {
    const events: CalendarEvent[] = [{ start: 30, end: 120 }];
    const [event] = positionEvents(events);

    expect(event.top).toBeCloseTo((30 / DAY_DURATION_MINUTES) * 100);
    expect(event.height).toBeCloseTo((90 / DAY_DURATION_MINUTES) * 100);
  });

  it('splits two overlapping events into equal width columns', () => {
    const events: CalendarEvent[] = [
      { start: 300, end: 330 },
      { start: 290, end: 330 },
    ];
    const positioned = positionEvents(events);

    expect(positioned).toHaveLength(2);
    expect(positioned.every((event) => event.width === 50)).toBe(true);
    expect(positioned.map((event) => event.left).sort()).toEqual([0, 50]);
  });

  it('does not treat back-to-back events as colliding', () => {
    const events: CalendarEvent[] = [
      { start: 0, end: 60 },
      { start: 60, end: 120 },
    ];
    const positioned = positionEvents(events);

    for (const event of positioned) {
      expect(event.left).toBe(0);
      expect(event.width).toBe(100);
    }
  });
});
