export interface CalendarEvent {
  start: number;
  end: number;
}

export interface PositionedEvent extends CalendarEvent {
  top: number;
  height: number;
  left: number;
  width: number;
}
