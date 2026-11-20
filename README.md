# Day View Calendar

A single-day calendar view built with Angular 22. It takes a list of events and lays them out on a 9am–6pm grid so that overlapping events never cover each other and each event uses as much horizontal space as it can.

## How it works

Events are plain objects whose times are in **minutes since 9am**:

```js
renderDay([
  { start: 30, end: 120 },   // 09:30 – 11:00
  { start: 300, end: 330 },  // 14:00 – 14:30
  { start: 290, end: 330 },  // 13:50 – 14:30
]);
```

`window.renderDay` is exposed globally, so you can try it straight from the browser console. Input is validated: anything that isn't an array of `{ start, end }` with `0 <= start < end` is rejected with a console error.

### Layout algorithm

All the layout logic is in one pure function, `positionEvents` in [`src/app/calendar/util.ts`](src/app/calendar/util.ts). It doesn't touch the DOM or Angular, so it's easy to unit test.

1. **Sort** events by start time (then end time).
2. **Cluster** them: walk the sorted list and keep a running end time. Any event that starts before the cluster ends joins it. Otherwise a new cluster starts. Events in different clusters never affect each other's width.
3. **Assign lanes** within each cluster: each event goes into the first lane that is free by its start time. If none is free, a new lane opens.
4. **Size** every event in the cluster at `1 / laneCount` of the width, offset by its lane index. `top` and `height` are percentages of the working day.

This runs in O(n log n) for the sort plus O(n · lanes) for lane assignment.

### Structure

| File | Role |
| --- | --- |
| `src/app/app.ts` | Holds event state in a signal, registers `window.renderDay`, validates input |
| `src/app/calendar/model.ts` | `CalendarEvent` and `PositionedEvent` types |
| `src/app/calendar/util.ts` | Time formatting, hour labels and the layout algorithm |
| `src/app/calendar/day-view/` | Presentational component: draws the hour grid and positioned events |

Built as a standalone, signal-based Angular app (`input()`, `computed()`).

## Getting started

```bash
npm install
npm start          # dev server at http://localhost:4200
npm test           # unit tests (Vitest)
npm run build      # production build
```

`npm run build` also runs `scripts/fix-index-html.mjs`, which removes `type="module"` from the built script tag. That means `dist/day-view-calendar/browser/index.html` can be opened directly from disk with no server.

## License

[MIT](LICENSE)
