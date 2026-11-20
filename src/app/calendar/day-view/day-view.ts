import { Component, computed, input, InputSignal, Signal } from '@angular/core';
import { CalendarEvent, PositionedEvent } from '../model';
import { formatClockTime, generateRowLabels, positionEvents } from '../util';

@Component({
  selector: 'day-view',
  imports: [],
  templateUrl: './day-view.html',
  styleUrl: './day-view.scss',
})
export class DayView {
  public readonly dayEvents: InputSignal<CalendarEvent[]> = input<CalendarEvent[]>([]);
  protected readonly hours: string[] = generateRowLabels();
  protected readonly positionedEvents: Signal<PositionedEvent[]> = computed(() =>
    positionEvents(this.dayEvents()),
  );

  protected eventLabel(event: PositionedEvent): string {
    return `${formatClockTime(event.start)} - ${formatClockTime(event.end)}`;
  }
}
