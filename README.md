# Agentic AI Club Website

The website for the Agentic AI Club at the Roux Institute, Northeastern University. It's a static site in plain HTML, CSS and JavaScript, with no build step and no dependencies.

---

## Pages

| Page | File | What it shows |
| --- | --- | --- |
| Home | `index.html` | Hero, what the club is about, what we do, and a call to learn more |
| About | `about.html` | Who we are, how to take part, and what the club focuses on |
| Events & Activities | `events.html` | The next event (Coffee and Agents, Sat Oct 17, 10 AM – 12 PM, Room 201) with an "Add to calendar" button |
| Our Projects | `projects.html` | A "coming soon" page explaining how club projects will work |
| Blog & Newsletter | `blog.html` | Blog posts with category filters and a newsletter sign-up |
| Contact | `contact.html` | Contact details and a contact form |
| Join the Club | `join.html` | Member benefits, the sign-up form, what happens next, and an FAQ |

## Files

```
index.html  about.html  events.html  projects.html  blog.html  contact.html  join.html
css/
  club.css         shared styles for every page
js/
  club.js          navigation, events, calendar download, projects, join form, blog filters, newsletter, contact form
assets/
  favicon.svg      logo mark used as the browser tab icon
```

Every page uses the same `css/club.css` and `js/club.js`.

## Running locally

Run a local server from the project folder:

```bash
python -m http.server 5502
```

Then open http://localhost:5502/. The VS Code / Cursor **Live Server** extension works too.

---

## Design

The palette comes from the club logo: a near-black tile, a white `>` prompt and a red cursor bar. Red is used sparingly, the same way the logo uses its cursor.

| Token | Value | Used for |
| --- | --- | --- |
| `--ink` | `#151a26` | Page headers, footer, dark buttons, headings |
| `--slate` | `#5d6577` | Body text on light backgrounds |
| `--slate-light` | `#8a93a6` | Secondary labels (matches the logo subtitle) |
| `--paper` / `--paper-warm` | `#ffffff` / `#f6f6f3` | Page backgrounds |
| `--red` | `#c62f3b` | Primary buttons, labels, active nav underline |
| `--red-bright` | `#e2545e` | Red accents on dark backgrounds |

- **Fonts:** IBM Plex Sans for text and IBM Plex Mono for small labels, loaded from Google Fonts.
- **Logo:** an inline SVG in the header and footer, so it stays sharp at any size.
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

Search matches any text inside the card. The "Showing X of Y projects" count updates on its own.

## Forms

None of the forms (Join, Contact, Newsletter) send data anywhere yet. They check their fields in the browser and show a confirmation.

The Join form has inline error messages and a personalised thank-you panel:

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

To collect sign-ups, send the data in the `submit` handler inside `initJoinForm()` in `js/club.js`, just before the success panel is shown. A form service like Formspree or a Google Apps Script endpoint is the simplest option:

```js
await fetch("YOUR_FORM_ENDPOINT", { method: "POST", body: new FormData(form) });
```

---

## Accessibility

- A "Skip to content" link, semantic landmarks and one `h1` per page.
- The menu button reports whether the menu is open (`aria-expanded`), and Escape closes the menu.
- Filter buttons use `aria-pressed`. Result counts and form errors are announced to screen readers.
- Join form errors are linked to their fields with `aria-describedby`, and focus moves to the first invalid field.
- The FAQ uses native `<details>` elements, so it works with a keyboard and without JavaScript.
- Animations turn off for users who have reduced motion enabled.

---

## Change log

### Oct 9, 2026 (`vin-branch`)

- **Home:** removed the small red "Agentic AI Club" label above the hero headline.
- **Home:** removed the sentence "Learn more about the club, what we are exploring and how students can get involved." from the red "Interested in building with us?" band.
- **About:** added a **Contact** link to the footer's Connect column, which opens `contact.html`.
- **Footers:** removed "A student club for people who want to build, test and understand AI agents." from the Events, Projects, Join, Blog and Contact footers.
- **README:** rewritten to describe the whole site. Mentions of `kabilan-style.css` and `kabilan-main.js`, which no longer exist, have been removed.

### Sep 30, 2026 (`main`)

- Combined all team work into one site.
- Added the Home and About pages.
- Moved Blog and Contact onto the shared `css/club.css` and `js/club.js`.

### Sep 29, 2026 (`vin-branch`)

- Added the Events & Activities, Our Projects and Join the Club pages, plus the shared `css/club.css`, `js/club.js` and `assets/favicon.svg`.

---

## Still to do

- [ ] Connect the Join, Contact and Newsletter forms to a real endpoint.
- [ ] Replace the `#` social links (LinkedIn, GitHub, Instagram, and the Mission link in the About footer).
- [ ] Make the footers match. Home and About use different columns and bottom-line text from the other five pages.
- [ ] Remove the duplicated Blog, Newsletter and Contact code at the end of `js/club.js`. It was pasted twice.
- [ ] Confirm the Coffee and Agents description, the Contact email address and the "free / open to all students" wording.
- [ ] Replace the Coffee and Agents card after Oct 17, since it doesn't hide itself.
- [ ] Decide whether to merge [PR #1](https://github.com/synvixsolutions-dot/Agentic-AI/pull/1), which turns the site into a single scrolling page.
