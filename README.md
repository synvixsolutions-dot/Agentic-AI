# Agentic AI Club — Combined Team Project

A responsive website for the Agentic AI Club at the Roux Institute,
Northeastern University. The website introduces the club, highlights its
learning and collaboration activities, showcases events and projects,
shares updates, answers common questions, and provides ways for students
to join or contact the organizers.

The site is built with HTML5, CSS3, and vanilla JavaScript. Its homepage
provides a continuous, scrollable experience, while individual content
pages remain organized in separate HTML files for easier editing.

## Features

### Homepage

-   Hero section with the headline **"Where Agentic AI Moves from Theory
    to Reality."**
-   Calls to action that guide visitors toward learning about the club
    and getting involved.
-   An introduction to the club and its purpose.
-   A "What We Do" section organized around **Learn**, **Build**, and
    **Collaborate**, supported by animated GIF assets.
-   Preview cards for upcoming events, including "Coffee and Agents" and
    a planned "Building Your First AI Agent" workshop.
-   Shared navigation and footer elements for moving around the website.

### Club information and activities

-   **About:** Introduces the club and its community.
-   **Events:** Presents club events and related information.
-   **Projects:** Provides a place to showcase project work and
    collaboration.
-   **Blog and Newsletter:** Provides a space for articles, updates, and
    newsletter signup.
-   **Join:** Presents membership or registration information.
-   **FAQ:** Answers frequently asked questions.
-   **Contact:** Provides contact information, social links, and a
    Google Maps embed for the Roux Institute.

The project includes standalone HTML files for these content areas. The
homepage can load their main content into corresponding sections,
allowing visitors to browse the site as one continuous page while
keeping the content organized in separate files.

## Technology

-   **HTML5** --- page structure and content
-   **CSS3** --- styling, layout, and responsive behavior
-   **Vanilla JavaScript** --- navigation and page interactions
-   **Google Fonts** --- IBM Plex Sans and IBM Plex Mono
-   **Microsoft Forms** --- membership form link, where configured
-   **Google Maps embed** --- location display on the Contact page
-   **Vercel serverless function + Resend** --- emails Contact form
    messages to the club inbox (`api/contact.js`)

There is no database. The Contact form is emailed through
`api/contact.js`; club sign-ups are collected by Microsoft Forms.

## Project structure

``` text
Agentic-AI-Kabilan/
├── api/
│   └── contact.js
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
├── index.html
├── about.html
├── events.html
├── projects.html
├── blog.html
├── join.html
├── faq.html
├── contact.html
├── .env.example
└── README.md
```

## How the website works

### Homepage and content sections

`index.html` contains the shared site layout, including the navigation,
hero, section containers, and footer. Content for the About, Events,
Projects, Blog, Join, FAQ, and Contact sections is maintained in the
matching standalone HTML files.

### Section loader

`js/section-loader.js` is responsible for loading the content of the
standalone pages into the corresponding homepage sections. It fetches
each page, extracts its `<main>` content, and inserts that content into
the appropriate section container. It also converts applicable links
between standalone pages into in-page section links, attempts to honor a
URL hash after the sections load, and displays an error message when a
section cannot be fetched.

Because this behavior uses `fetch()`, the website should be run through
a local web server rather than opened directly from a `file://` URL.

### JavaScript files

-   **`js/section-loader.js`** --- fetches standalone page content and
    inserts it into homepage sections.
-   **`js/club.js`** --- handles shared navigation and club-site
    interactions.
-   **`js/main.js`** --- handles interactions for page content,
    including blog/newsletter, contact, and FAQ behavior where
    implemented.

Keep the script files in the `js/` directory and preserve the
script-loading order used by `index.html`. The section loader should run
before interactions that depend on content being inserted into the page.

## Navigation and layout

The site uses a shared navigation system and section anchors for the
continuous homepage experience. The navigation includes links to the
main site areas, while the Join action may direct visitors to the
configured Microsoft Forms membership form. The Blog and Join sections
can also remain available as standalone pages even when their homepage
section placeholders are not displayed.

The layout includes responsive styling intended for desktop, tablet, and
mobile screens. The homepage uses visual cards and animated GIFs to
introduce the club's Learn, Build, and Collaborate themes.

## Run locally

1.  Download or clone the project repository.
2.  Open the project folder in Visual Studio Code.
3.  Start a local server using the **Live Server** extension or another
    local HTTP server.
4.  Open `index.html` through the local server.
5.  Check the homepage, navigation, section loading, images, external
    links, and responsive layout.

Do not rely on opening `index.html` directly with a `file://` URL:
browsers may block the `fetch()` requests used to load the standalone
page content.

## Editing the website

-   **Homepage, hero, navigation, section containers, and footer:**
    `index.html`
-   **About content:** `about.html`
-   **Events and event details:** `events.html`
-   **Projects:** `projects.html`
-   **Blog and newsletter content:** `blog.html`
-   **Join or registration content:** `join.html`
-   **Frequently asked questions:** `faq.html`
-   **Contact information, social links, and map:** `contact.html`
-   **Styles, colors, spacing, layout, and responsive rules:**
    `css/style.css`
-   **Section loading and conversion of page links to section anchors:**
    `js/section-loader.js`
-   **Shared navigation and club interactions:** `js/club.js`
-   **Page-specific interactions:** `js/main.js`
-   **Images and animated visuals:** `assets/`

When editing a standalone page that is loaded into the homepage, keep
its relevant content inside a `<main>` element. The section loader
inserts the page's main content; it does not copy the standalone page's
`<head>`. Shared stylesheets and scripts should therefore be loaded by
the homepage.

## Forms and external services

The project contains or links to membership, newsletter, and contact
form interfaces. Front-end HTML and JavaScript alone do not guarantee
that submitted information is stored, emailed, or delivered to an
administrator. Confirm that each form is connected to its intended
external form provider or backend and test a submission before
publishing.

### Contact form backend (`api/contact.js`)

On Vercel, `api/contact.js` becomes `POST /api/contact`. It validates
the message, drops bot submissions caught by a hidden `website` field,
and emails the message through [Resend](https://resend.com) with
Reply-To set to the sender, so organizers can answer with Reply.

**Request:** JSON `{ name, email, topic, message, website }`, where
`topic` is `join`, `collaborate`, `speak` or `general`, `message` is at
most 500 characters, and `website` is the hidden honeypot field.

**Responses:**

-   `200 { ok: true }` --- sent (also returned for bot submissions,
    which are silently dropped)
-   `400 { ok: false, fields: [...] }` --- invalid fields
-   `405` --- not a POST request
-   `500` / `502` --- missing configuration or Resend error

**Environment variables** (Vercel → Settings → Environment Variables;
for local testing copy `.env.example` to `.env.local`, which git
ignores):

-   `RESEND_API_KEY` --- Resend API key. Never commit it.
-   `CONTACT_TO` --- inbox that receives messages. **Currently a
    personal test address; replace it with the official club inbox.**
-   `CONTACT_FROM` --- optional. Until the club verifies its own domain
    in Resend, leave it unset; Resend's test sender can only deliver to
    the email address that owns the Resend account.

The front end still needs to send the Contact form to `/api/contact`
and show the success panel only when the response is `{ ok: true }`.

### Join form

The Join navigation action uses a Microsoft Forms link where configured.
Verify that the link points to the intended public membership form. Also
verify the LinkedIn and GitHub links and the Google Maps embed on the
Contact page.

## Pre-publication checklist

-   [ ] Confirm that `index.html` links to `css/style.css`.
-   [ ] Confirm that all seven content pages load correctly into their
    homepage sections.
-   [ ] Check navigation, in-page anchors, and direct links containing
    section hashes.
-   [ ] Check that all GIFs, images, and the favicon load correctly.
-   [ ] Test the layout at desktop, tablet, and mobile widths.
-   [ ] Test the Join, newsletter, and contact form workflows end to
    end.
-   [ ] Verify external links, social profiles, the Microsoft Forms URL,
    and the map embed.
-   [ ] Review commented-out HTML sections and enable them only when
    their content and behavior are ready.
-   [ ] Review event dates before publishing. The listed "Coffee and
    Agents" date is October 17, 2026; update it if the event has passed
    or the schedule has changed.

## Project goal

The Agentic AI Club website provides a clear, responsive online presence
for the club at the Roux Institute. It helps students discover agentic
AI, learn about club activities, explore events and projects, connect
with peers, join the community, and contact the organizers through a
cohesive website experience.

- **Commented-out sections:** HTML inside comments will not display. Uncomment a section only after confirming its content and functionality are ready.

## Project purpose

The Agentic AI Club website is intended to help Roux Institute students learn about agentic AI, connect with peers, participate in club events, collaborate on projects, and contact the club organizers.
