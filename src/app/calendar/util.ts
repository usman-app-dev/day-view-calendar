import { CalendarEvent, PositionedEvent } from './model';

export const DAY_START_HOUR = 9;
export const DAY_END_HOUR = 18;
export const DAY_DURATION_MINUTES = (DAY_END_HOUR - DAY_START_HOUR) * 60;

export function formatClockTime(minutesSinceDayStart: number): string {
  const totalMinutes = DAY_START_HOUR * 60 + minutesSinceDayStart;
  const hour24 = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  return `${hour24.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}

export function generateRowLabels(): string[] {
  const labels: string[] = [];
  for (let hour = DAY_START_HOUR; hour < DAY_END_HOUR; hour++) {
    labels.push(formatClockTime((hour - DAY_START_HOUR) * 60));
  }
  return labels;
}

export function positionEvents(events: CalendarEvent[]): PositionedEvent[] {
  const sorted = [...events].sort((a, b) => a.start - b.start || a.end - b.end);

  const clusters: CalendarEvent[][] = [];
  let current: CalendarEvent[] = [];
  let currentEnd = -Infinity;

  for (const event of sorted) {
    if (current.length === 0 || event.start < currentEnd) {
      current.push(event);
      currentEnd = Math.max(currentEnd, event.end);
    } else {
      clusters.push(current);
      current = [event];
      currentEnd = event.end;
    }
  }
  if (current.length > 0) {
    clusters.push(current);
  }

  const positioned: PositionedEvent[] = [];

  for (const cluster of clusters) {
    const laneEndTimes: number[] = [];
    const eventLaneIndex: number[] = [];

    for (const event of cluster) {
      let lane = laneEndTimes.findIndex((end) => end <= event.start);
      if (lane === -1) {
        lane = laneEndTimes.length;
        laneEndTimes.push(event.end);
      } else {
        laneEndTimes[lane] = event.end;
      }
      eventLaneIndex.push(lane);
    }

    const laneCount = laneEndTimes.length;

    cluster.forEach((event, i) => {
      positioned.push({
        ...event,
        top: (event.start / DAY_DURATION_MINUTES) * 100,
        height: ((event.end - event.start) / DAY_DURATION_MINUTES) * 100,
        left: (eventLaneIndex[i] / laneCount) * 100,
        width: (1 / laneCount) * 100,
      });
    });
  }

  return positioned;
}
