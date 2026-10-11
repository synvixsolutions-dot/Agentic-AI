# Agentic AI Club Website — Project README

A student-led website for the Agentic AI Club at the Roux Institute, Northeastern University. The project uses HTML, CSS, and vanilla JavaScript and is structured so that the individual page files can be maintained separately while their content is displayed as sections on one continuous homepage.

## What Changed Compared with the Previous Project

### 1. Single continuous homepage with separately editable page files

The earlier project had the section content embedded directly in `index.html`, alongside standalone HTML files for the individual pages. In this version, `index.html` provides the shared header, navigation, hero, footer, and section placeholders. `js/section-loader.js` fetches each standalone page and inserts its `<main>` content into the matching homepage section.

The following page files are loaded into the homepage:

- `about.html` — About
- `events.html` — Events
- `projects.html` — Projects
- `blog.html` — Blog and Newsletter
- `join.html` — Join / Register
- `faq.html` — Frequently Asked Questions
- `contact.html` — Contact

This keeps the site as one scrollable experience while preserving individual files for editing. After changing one of these HTML files, reload the homepage to see the updated content. The page loader uses `cache: "no-cache"` for these fetch requests.

### 2. Dynamic section loader

The new `js/section-loader.js`:

- Maps each homepage section to its standalone HTML file.
- Fetches all seven page files and extracts their `<main>` content.
- Inserts the extracted content into the corresponding `data-section-content` containers.
- Converts links between standalone pages into section anchors such as `#about`, `#events`, and `#contact` where applicable.
- Loads `js/main.js` after the page sections have been inserted, so its page-specific interactions can find the dynamically added elements.
- Attempts to honor a URL hash after sections load, so direct links to a section can scroll to the relevant area.
- Displays an error message if a section cannot be fetched.

### 3. Updated hero headline and calls to action

The homepage hero headline has been changed from:

> Building the next generation of agentic AI innovators.

to:

> Where Agentic AI Moves from Theory to Reality.

The phrase **Agentic AI** uses the existing `accent` styling. The hero button now reads **About the Club**, and the supporting keywords are **Learn**, **Experiment**, **Build**, and **Innovate**.

### 4. One combined stylesheet

The previous project contained two CSS files, `css/club.css` and `css/style.css`. The current project has one stylesheet, `css/style.css`, with the combined styles. `index.html` links to this single file.

The combined stylesheet retains the original stylesheet rules in sequence. If both files previously defined the same selector, normal CSS cascade order still matters; review the result in a browser after future CSS edits.

### 5. Navigation and homepage structure

The homepage navigation points to section IDs rather than separate page URLs. The page sections are ordered as About, Events, Projects, Blog, Contact, Join, and FAQ in the current `index.html` structure. The navigation also includes Home and the links for all seven sections. The footer uses in-page anchors for navigation.

### 6. JavaScript files and their roles

- `js/section-loader.js` — fetches standalone page content and inserts it into the homepage.
- `js/club.js` — handles the shared site navigation and club-page interactions.
- `js/main.js` — handles interactions associated with the dynamically loaded page content, including blog/newsletter, contact, and FAQ behavior where implemented.

Keep these script files in the `js/` directory and preserve their order in `index.html`: load `section-loader.js` before `club.js`. The section loader injects `main.js` after the sections have loaded.

## Project Structure

```text
Agentic-AI-Kabilan/
├── index.html
├── about.html
├── events.html
├── projects.html
├── blog.html
├── join.html
├── faq.html
├── contact.html
├── README.md
├── assets/
│   └── favicon.svg
├── css/
│   └── style.css
└── js/
    ├── club.js
    ├── main.js
    └── section-loader.js
```

## How to Run the Website

Because the loader uses JavaScript `fetch()` to read the standalone HTML files, run the project through a local web server. Opening `index.html` directly with a `file://` URL may prevent the sections from loading.

### Using Visual Studio Code

1. Open the project folder in VS Code.
2. Install the **Live Server** extension if it is not already installed.
3. Right-click `index.html` and select **Open with Live Server**.
4. Navigate through the site and check that every section appears.
5. After editing a standalone page, refresh the homepage to see the changes.

You can also serve the directory using another local development server.

## How to Update Content

- Change the homepage hero, shared navigation, section placeholders, or footer in `index.html`.
- Change the About content in `about.html`.
- Change Events in `events.html`.
- Change Projects in `projects.html`.
- Change Blog and Newsletter content in `blog.html`.
- Change Join / Register content in `join.html`.
- Change FAQ content in `faq.html`.
- Change Contact content in `contact.html`.
- Change visual styling in `css/style.css`.
- Change section fetching and page-link conversion in `js/section-loader.js`.
- Change shared navigation behavior in `js/club.js`.
- Change page-specific interactions in `js/main.js`.

## Important Notes and Current Limitations

- This is a front-end HTML/CSS/JavaScript project. The presence of a newsletter or contact form does not by itself mean submissions are stored or sent to an administrator; that requires a working backend or an external form service.
- The current section loader fetches each HTML file's `<main>` content. Keep the relevant content inside a `<main>` element in each standalone page.
- When standalone content is inserted into `index.html`, the original page's `<head>` is not copied. Shared CSS and JavaScript should therefore be loaded by the homepage, not relied on from each standalone page's `<head>`.
- Confirm that images, links, form behavior, mobile navigation, and section scrolling work after content or script changes.
- This README describes the code structure and changes visible in the project. It does not claim that every interaction has been fully browser-tested.