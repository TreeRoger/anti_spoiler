# UI Improvement Ideas

## Popup

| Idea | Impact | Effort |
|------|--------|--------|
| **Status line** – e.g. "Protecting 3 shows" below the toggle | High | Low |
| **Empty state** – Icon + short tip instead of plain text | High | Low |
| **Show count badge** – Number on extension icon or in header | Medium | Medium |
| **Pill/chip style** for shows – Rounded chips with × to remove | Medium | Low |
| **Keyboard support** – Enter to add show, focus management | Medium | Low |
| **Smooth list animations** – Fade-in when adding/removing | Low | Low |
| **Settings link** – Icon button + "Settings" label, open in tab | Low | Low |

## Options Page

| Idea | Impact | Effort |
|------|--------|--------|
| **Toasts instead of alert()** – "Keywords saved" as a small toast | High | Low |
| **Custom range slider** – Purple track, visible thumb | Medium | Low |
| **Card sections** – Each section in a subtle card with icon | Medium | Low |
| **Reset confirmation modal** – Custom modal instead of `confirm()` | Medium | Medium |
| **Back to extension** – Link to popup or "Done" that closes tab | Low | Low |
| **Tabs** – General / Shows / Data to reduce scrolling | Medium | High |

## Blocked Page

| Idea | Impact | Effort |
|------|--------|--------|
| **"Continue anyway"** – Link that opens blocked URL in new tab | High | Low |
| **Clearer hierarchy** – Subtitle under "Page Blocked" | Medium | Low |
| **Softer palette** – Same purple gradient, less harsh red | Low | Low |

## Spoiler Warning Overlay (on sites)

| Idea | Impact | Effort |
|------|--------|--------|
| **Backdrop blur** – `backdrop-filter: blur()` behind overlay | High | Low |
| **Enter animation** – Fade + scale in | Medium | Low |
| **"Don't warn for this site"** – Checkbox + store in storage | High | Medium |
| **Softer warning color** – Amber/orange instead of bright red | Low | Low |

## Cross-cutting

- **Dark mode** – Respect `prefers-color-scheme` or add toggle in options.
- **Consistent spacing** – Use a 4px or 8px grid everywhere.
- **Focus states** – Visible focus ring on all interactive elements (accessibility).
- **Loading states** – Skeleton or spinner when loading settings.

Pick a few from each section to implement next; the table above gives a rough sense of impact vs effort.
