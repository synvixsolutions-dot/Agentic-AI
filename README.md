# Agentic AI Club — Combined Team Project


A responsive website for the Agentic AI Club at the Roux Institute, Northeastern University. The site introduces the club, shares its activities and events, showcases projects, and provides ways for students to get involved or contact the organizers.

## What's changed in this version

Compared with the previous `Agentic-AI-Kabilan` project folder, this version includes the following updates.

### 1. Homepage expanded with new content sections

The homepage (`index.html`) now includes additional preview sections between the hero and the existing full-page sections:

- **About the club:** Introduces the club and links visitors to `about.html`.
- **What we do:** Presents Learn, Build, and Collaborate as three visual themes.
- **Upcoming events:** Adds homepage event cards for “Coffee and Agents” and a planned “Building Your First AI Agent” workshop.

These sections use new CSS classes such as `.home-section`, `.editorial-grid`, `.project-strip`, and `.home-events`.

### 2. Animated visual assets added

Three GIFs were added to `assets/` and are used in the homepage's “What we do” section:

- `assets/Learn.gif`
- `assets/Build.gif`
- `assets/Collab.gif`

The favicon remains at `assets/favicon.svg`.

### 3. CSS updated

The project now uses `css/style.css` for the main page styling. Compared with the previous version:

- `about.html` now links to `css/style.css`.
- `style.css` includes additional layout rules for `.gif-container1` and `.gif-container2` to align and size the new GIFs.

### 4. Navigation updated

The homepage navigation has changed:

- The in-page **Blog** link has been removed from the top navigation.
- **Join** now links to a Microsoft Forms URL instead of the `#join` homepage section.
- Contact and FAQ links remain in the navigation.

The homepage's Blog and Join embedded section placeholders are commented out in `index.html`. Their standalone pages (`blog.html` and `join.html`) remain in the project.

### 5. Standalone page edits

The separate pages are still included. Changes identified against the previous version include:

- **`about.html`:** Uses `css/style.css` and changes the page heading from “About the Club” to “About Us”.
- **`projects.html`:** Removes the “Coming soon” label and comments out the optional project-list and call-to-action sections.
- **`events.html`:** The optional upcoming-events section is commented out.
- **`join.html`:** Comments out the “Why Join” section and removes the newsletter checkbox from the form.
- **`contact.html`:** Adds LinkedIn and GitHub links, comments out the X/social link and quick-FAQ block, and embeds a Google Map for the Roux Institute.
- **`faq.html`:** Removes the visible “FAQ” eyebrow label.
- **`blog.html`:** No content differences were detected compared with the previous project version.

### 6. JavaScript and editor settings

The following JavaScript files are retained without content changes compared with the previous project:

- `js/club.js`
- `js/main.js`
- `js/section-loader.js`

A VS Code workspace settings file was also added at `.vscode/settings.json`.

## Project structure

```text
Agentic-AI-Kabilan/
├── .vscode/
│   └── settings.json
├── assets/
│   ├── Build.gif
│   ├── Collab.gif
│   ├── Learn.gif
│   └── favicon.svg
├── css/
│   └── style.css
├── js/
│   ├── club.js
│   ├── main.js
│   └── section-loader.js
├── about.html
├── blog.html
├── contact.html
├── events.html
├── faq.html
├── index.html
├── join.html
├── projects.html
└── README.md
```

> Note: The current ZIP's file listing contains only `css/style.css`. Restore that stylesheet or update the HTML references before running the site if the ZIP is representative of your working folder.

## Run locally

Because the site uses JavaScript to load standalone HTML sections, run it through a local web server rather than opening files directly with a `file://` URL.

1. Open the project folder in Visual Studio Code.
2. Start the project with the Live Server extension, or use another local HTTP server.
3. Open `index.html` through the server.
4. Test the navigation, page sections, forms, map, and mobile layout.

## Items to review before publishing

- **Join link:** Confirm that the Microsoft Forms URL is the intended public membership form.
- **Event date:** The homepage and events page contain the date October 17, 2026 for “Coffee and Agents.” As this date has passed, update the event content if the site is being published now.
- **Form behavior:** Confirm that the join, newsletter, and contact forms are connected to a real submission service. Frontend markup alone does not guarantee submissions are stored or delivered.
- **External links:** Verify the LinkedIn, GitHub, Google Maps embed, and any social links.
- **Commented-out sections:** HTML inside comments will not display. Uncomment a section only after confirming its content and functionality are ready.

## Project purpose

The Agentic AI Club website is intended to help Roux Institute students learn about agentic AI, connect with peers, participate in club events, collaborate on projects, and contact the club organizers.
