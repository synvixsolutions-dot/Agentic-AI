# Agentic-AI
This is the website for Roux Institute's Agentic AI Club

This README covers the **Events & Activities**, **Our Projects** and **Join the Club** pages. They are plain HTML, CSS and JavaScript, with no build step and no dependencies.

---

## Pages

| Page | File | What it shows |
| --- | --- | --- |
| Events & Activities | `events.html` | The next event (Coffee and Agents, Sat Oct 17), with an "Add to calendar" button, and a note that more events are coming |
| Our Projects | `projects.html` | A "coming soon" page explaining how club projects will work, with a call to pitch ideas |
| Join the Club | `join.html` | Member benefits, the sign-up form, what happens after signing up, and an FAQ |

## Files

```
events.html
projects.html
join.html
css/
  club.css         shared styles for all three pages
js/
  club.js          navigation, event list, calendar download, project filters, join form
assets/
  favicon.svg      logo mark used as the browser tab icon
```

These pages don't load `style.css` or `main.js` from the Blog and Contact pages, and those files haven't been changed.

## Running locally

You can open the HTML files directly, but running a local server is closer to how the site will behave once it's hosted:

```bash
python -m http.server 5501
```

Then open:

- http://localhost:5501/events.html
- http://localhost:5501/projects.html
- http://localhost:5501/join.html

The VS Code / Cursor **Live Server** extension works too.

---

## Design

The palette comes from the club logo: a near-black tile, a white `>` prompt and a red cursor bar. Red is used sparingly, in the same way the logo uses its cursor.

| Token | Value | Used for |
| --- | --- | --- |
| `--ink` | `#151a26` | Page headers, footer, dark buttons, headings |
| `--slate` | `#5d6577` | Body text on light backgrounds |
| `--slate-light` | `#8a93a6` | Secondary labels (matches the logo subtitle) |
| `--paper` / `--paper-warm` | `#ffffff` / `#f6f6f3` | Page backgrounds |
| `--red` | `#c62f3b` | One primary button per page, labels, active nav underline |
| `--red-bright` | `#e2545e` | Red accents on dark backgrounds |

- **Fonts:** IBM Plex Sans for text and IBM Plex Mono for small labels, loaded from Google Fonts.
- **Logo:** redrawn as an inline SVG in the header and footer so it stays sharp at any size.
- **Terminal motif:** the `>_` labels, the blinking red cursor after page titles and the terminal window on the Projects page all echo the logo.
- **Breakpoints:**
  - 1040px: the nav collapses into a menu button.
  - 960px: two-column layouts stack.
  - 720px: phone layout.
  - 480px: small phones.

All colours and sizes are CSS variables at the top of `css/club.css`.

---

## Adding an event

Events live in `events.html`.

**Changing the next event:** edit the `<article class="feature">` block. Update the `data-start`, `data-end` and `data-location` attributes as well as the visible text, because the "Add to calendar" file is built from them.

**Adding more events:** the "Upcoming" section is already written but commented out. Uncomment it and copy one `<article class="event">` block per event:

```html
<article class="event" data-type="workshop"
    data-start="2026-11-05T18:00:00-05:00"
    data-end="2026-11-05T20:00:00-05:00"
    data-location="Room 201, Roux Institute, 100 Fore St, Portland, ME">
    ...
    <h3 class="event__title" data-ev-title>Event title</h3>
    <p class="event__desc" data-ev-desc>One or two sentences about the event.</p>
    ...
</article>
```

- `data-type` must match one of the filter buttons (`meetup`, `workshop`, `talk`). Add a new button if you need a new type.
- `data-start` and `data-end` use ISO format with the Eastern offset: `-04:00` until daylight saving ends in early November, `-05:00` after that.
- The calendar file takes its title and description from the elements marked `data-ev-title` and `data-ev-desc`.
- Events in the list hide themselves automatically once `data-end` has passed.

## Adding a project

Projects live in `projects.html`. The "All projects" section, with its status filters and search, is commented out. Uncomment it and copy one `<article class="project">` block per project:

- `data-status`: `in-progress` or `shipped`
- `data-open`: `true` if the team wants contributors, which puts the card under the "Open to contributors" filter

Search matches any text inside the card: title, description, tech stack and so on. The "Showing X of Y projects" count updates on its own.

## The join form

The form in `join.html` checks its fields in the browser. Error messages appear inline, and a personalised thank-you panel replaces the form on success.

| Field | Required | Check |
| --- | --- | --- |
| First name, last name | Yes | Not empty |
| Email | Yes | Valid email format |
| Program | Yes | An option is selected |
| Expected graduation | No | |
| Experience with AI | Yes | One option chosen |
| Interests | Yes | At least one chosen |
| What you'd like to build | No | 500 characters max, with a live counter |
| Newsletter | No | Checkbox |

**Submissions aren't sent anywhere yet.** To collect them, send the data in the `submit` handler inside `initJoinForm()` in `js/club.js`, just before the success panel is shown. A form service like Formspree or a Google Apps Script endpoint is the simplest option:

```js
await fetch("YOUR_FORM_ENDPOINT", { method: "POST", body: new FormData(form) });
```

---

## Accessibility

- A "Skip to content" link, semantic landmarks and one `h1` per page.
- The menu button reports whether the menu is open (`aria-expanded`), and Escape closes the menu.
- Filter buttons use `aria-pressed`. Result counts and form errors are announced to screen readers.
- Form errors are linked to their fields with `aria-describedby`, and focus moves to the first invalid field.
- The FAQ uses native `<details>` elements, so it works with a keyboard and without JavaScript.
- Animations turn off for users who have reduced motion enabled.

## Still to do

- [ ] Connect the join form to a real endpoint.
- [ ] Replace the `#` social links in the footer (LinkedIn, GitHub, Instagram).
- [ ] Confirm the Coffee and Agents description, and the "free / open to all students" wording.
- [ ] Replace the Coffee and Agents card after Oct 17, since it doesn't hide itself.
- [ ] Agree on one visual style with the Blog and Contact pages, which use a different purple theme and nav.
- [ ] Home and About pages: they're linked from the nav but don't exist yet.
