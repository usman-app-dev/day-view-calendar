import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { DayView } from './calendar/day-view/day-view';
import { CalendarEvent } from './calendar/model';

declare global {
  interface Window {
    renderDay?: (events: unknown) => void;
  }
}

@Component({
  selector: 'app-root',
  imports: [DayView],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit, OnDestroy {
  protected readonly calendarEvents = signal<CalendarEvent[]>([]);

  ngOnInit(): void {
    window.renderDay = (events: unknown) => {
      if (!this.isValidEventList(events)) {
        console.error(
          'renderDay expects an array of { start: number, end: number } objects where start >= 0 and end > start.',
        );
        return;
      }
      this.calendarEvents.set(structuredClone(events));
    };
  }

  ngOnDestroy(): void {
    delete window.renderDay;
  }

  private isValidEventList(events: unknown): events is CalendarEvent[] {
    return Array.isArray(events) && events.every(this.isValidEvent);
  }

  private isValidEvent(event: unknown): event is CalendarEvent {
    if (typeof event !== 'object' || event === null) {
      return false;
    }

    const { start, end } = event as Record<string, unknown>;

    return (
      typeof start === 'number' &&
      Number.isFinite(start) &&
      start >= 0 &&
      typeof end === 'number' &&
      Number.isFinite(end) &&
      end > start
    );
  }
}
