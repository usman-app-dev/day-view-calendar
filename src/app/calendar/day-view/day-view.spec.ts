import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarEvent } from '../model';
import { DayView } from './day-view';

describe('DayView', () => {
  let component: DayView;
  let fixture: ComponentFixture<DayView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DayView],
    }).compileComponents();

    fixture = TestBed.createComponent(DayView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  function eventBoxes(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.event'));
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders one hour row for every hour label', () => {
    const rows = fixture.nativeElement.querySelectorAll('.hour-row');
    expect(rows.length).toBe(9);
  });

  it('renders no event boxes when there are no events', () => {
    expect(eventBoxes()).toHaveLength(0);
  });

  it('renders a full-width box for a single event', async () => {
    const dayEvents: CalendarEvent[] = [{ start: 30, end: 120 }];
    fixture.componentRef.setInput('dayEvents', dayEvents);
    await fixture.whenStable();

    const [box] = eventBoxes();
    expect(box.style.left).toBe('0%');
    expect(box.style.width).toBe('100%');
    expect(box.textContent?.trim()).toBe('09:30 - 11:00');
  });

  it('splits overlapping events into equal-width columns', async () => {
    const dayEvents: CalendarEvent[] = [
      { start: 300, end: 330 },
      { start: 290, end: 330 },
    ];
    fixture.componentRef.setInput('dayEvents', dayEvents);
    await fixture.whenStable();

    const boxes = eventBoxes();
    expect(boxes).toHaveLength(2);
    expect(boxes.every((box) => box.style.width === '50%')).toBe(true);
    expect(boxes.map((box) => box.style.left).sort()).toEqual(['0%', '50%']);
  });

  it('replaces previously rendered events when dayEvents changes', async () => {
    fixture.componentRef.setInput('dayEvents', [{ start: 0, end: 60 }]);
    await fixture.whenStable();
    expect(eventBoxes()).toHaveLength(1);

    fixture.componentRef.setInput('dayEvents', [
      { start: 30, end: 120 },
      { start: 300, end: 330 },
      { start: 290, end: 330 },
    ]);
    await fixture.whenStable();
    expect(eventBoxes()).toHaveLength(3);
  });
});
