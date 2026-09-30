/* ========================================
   AGENTIC AI CLUB
   Shared scripts for Events, Projects and Join
======================================== */

(function () {
    "use strict";

    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));


    /* ========================================
       NAVIGATION
    ======================================== */

    function initNav() {
        const toggle = $(".nav-toggle");
        const nav = $("#site-nav");

        if (!toggle || !nav) return;

        const setOpen = (open) => {
            nav.classList.toggle("is-open", open);
            toggle.setAttribute("aria-expanded", String(open));
        };

        toggle.addEventListener("click", () => {
            setOpen(!nav.classList.contains("is-open"));
        });

        nav.addEventListener("click", (event) => {
            if (event.target.closest("a")) setOpen(false);
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && nav.classList.contains("is-open")) {
                setOpen(false);
                toggle.focus();
            }
        });

        window.matchMedia("(min-width: 1041px)").addEventListener("change", (event) => {
            if (event.matches) setOpen(false);
        });
    }

    function initYear() {
        $$("[data-year]").forEach((el) => {
            el.textContent = new Date().getFullYear();
        });
    }

    function setPressed(buttons, active) {
        buttons.forEach((button) => {
            button.setAttribute("aria-pressed", String(button === active));
        });
    }


    /* ========================================
       EVENTS
    ======================================== */

    function initEvents() {
        const list = $("[data-event-list]");

        if (!list) return;

        const events = $$(".event", list);
        const buttons = $$("[data-event-filter]");
        const empty = $("[data-event-empty]");
        const now = Date.now();

        events.forEach((event) => {
            if (new Date(event.dataset.end).getTime() < now) {
                event.dataset.past = "true";
            }
        });

        const applyFilter = (filter) => {
            let shown = 0;

            events.forEach((event) => {
                const visible =
                    event.dataset.past !== "true" &&
                    (filter === "all" || event.dataset.type === filter);

                event.hidden = !visible;
                if (visible) shown++;
            });

            if (empty) empty.hidden = shown > 0;
        };

        buttons.forEach((button) => {
            button.addEventListener("click", () => {
                setPressed(buttons, button);
                applyFilter(button.dataset.eventFilter);
            });
        });

        applyFilter("all");
    }

    function initCalendarButtons() {
        $$("[data-ics]").forEach((button) => {
            button.addEventListener("click", () => {
                downloadIcs(button.closest("[data-start]"));
            });
        });
    }

    function toIcsDate(date) {
        return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    }

    function escapeIcs(text) {
        return text
            .replace(/\\/g, "\\\\")
            .replace(/;/g, "\\;")
            .replace(/,/g, "\\,")
            .replace(/\r?\n/g, "\\n");
    }

    /* iCalendar lines must be folded at 75 octets */
    function foldIcsLine(line) {
        const parts = [];
        let rest = line;

        while (rest.length > 72) {
            parts.push(rest.slice(0, 72));
            rest = " " + rest.slice(72);
        }

        parts.push(rest);
        return parts.join("\r\n");
    }

    function slugify(text) {
        return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    }

    function downloadIcs(source) {
        if (!source) return;

        const title = $("[data-ev-title]", source).textContent.trim();
        const descriptionEl = $("[data-ev-desc]", source);
        const description = descriptionEl
            ? descriptionEl.textContent.trim().replace(/\s+/g, " ")
            : "";
        const start = new Date(source.dataset.start);
        const end = new Date(source.dataset.end);
        const slug = slugify(title);

        const lines = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//Agentic AI Club//Events//EN",
            "CALSCALE:GREGORIAN",
            "METHOD:PUBLISH",
            "BEGIN:VEVENT",
            `UID:${slug}-${toIcsDate(start)}@agentic-ai-club`,
            `DTSTAMP:${toIcsDate(new Date())}`,
            `DTSTART:${toIcsDate(start)}`,
            `DTEND:${toIcsDate(end)}`,
            `SUMMARY:${escapeIcs(title)}`,
            `DESCRIPTION:${escapeIcs(description)}`,
            `LOCATION:${escapeIcs(source.dataset.location || "")}`,
            "END:VEVENT",
            "END:VCALENDAR"
        ];

        const blob = new Blob([lines.map(foldIcsLine).join("\r\n")], {
            type: "text/calendar;charset=utf-8"
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = `${slug}.ics`;
        document.body.appendChild(link);
        link.click();
        link.remove();

        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }


    /* ========================================
       PROJECTS
    ======================================== */

    function initProjects() {
        const grid = $("[data-project-grid]");

        if (!grid) return;

        const cards = $$(".project", grid);
        const buttons = $$("[data-project-filter]");
        const search = $("[data-project-search]");
        const count = $("[data-project-count]");
        const empty = $("[data-project-empty]");
        let filter = "all";

        const matchesFilter = (card) => {
            if (filter === "all") return true;
            if (filter === "open") return card.dataset.open === "true";
            return card.dataset.status === filter;
        };

        const update = () => {
            const query = search ? search.value.trim().toLowerCase() : "";
            let shown = 0;

            cards.forEach((card) => {
                const visible =
                    matchesFilter(card) &&
                    (!query || card.textContent.toLowerCase().includes(query));

                card.hidden = !visible;
                if (visible) shown++;
            });

            if (count) {
                count.textContent = `Showing ${shown} of ${cards.length} projects`;
            }

            if (empty) empty.hidden = shown > 0;
        };

        buttons.forEach((button) => {
            button.addEventListener("click", () => {
                filter = button.dataset.projectFilter;
                setPressed(buttons, button);
                update();
            });
        });

        if (search) search.addEventListener("input", update);

        update();
    }


    /* ========================================
       JOIN FORM
    ======================================== */

    function initJoinForm() {
        const form = $("[data-join-form]");

        if (!form) return;

        const success = $("[data-join-success]");
        let attempted = false;

        const rules = [
            { name: "firstName", message: "Enter your first name." },
            { name: "lastName", message: "Enter your last name." },
            {
                name: "email",
                message: "Enter a valid email address.",
                test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            },
            { name: "program", message: "Choose your program." },
            { name: "experience", message: "Choose the option closest to your experience." },
            { name: "interests", message: "Pick at least one thing you're interested in." }
        ];

        const valueOf = (name) => {
            const data = new FormData(form);

            if (name === "interests") return data.getAll(name).join(",");

            return String(data.get(name) || "").trim();
        };

        const check = (rule) => {
            const value = valueOf(rule.name);
            const valid = value !== "" && (!rule.test || rule.test(value));
            const error = $(`#${rule.name}-error`);
            const control = form.elements[rule.name];
            const group = $(`[data-group="${rule.name}"]`);

            if (error) error.textContent = valid ? "" : rule.message;

            if (control instanceof HTMLElement) {
                control.setAttribute("aria-invalid", String(!valid));
            }

            if (group) group.classList.toggle("is-invalid", !valid);

            return valid;
        };

        const focusControl = (name) => {
            const control = form.elements[name];
            const target = control instanceof HTMLElement ? control : control[0];

            if (target) target.focus();
        };

        form.addEventListener("change", (event) => {
            if (!attempted) return;

            const rule = rules.find((item) => item.name === event.target.name);
            if (rule) check(rule);
        });

        form.addEventListener("input", (event) => {
            if (!attempted) return;

            const rule = rules.find((item) => item.name === event.target.name);
            if (rule) check(rule);
        });

        $$("[data-counter-for]", form).forEach((counter) => {
            const field = form.elements[counter.dataset.counterFor];
            const max = field.getAttribute("maxlength");
            const render = () => {
                counter.textContent = `${field.value.length} / ${max}`;
            };

            field.addEventListener("input", render);
            render();
        });

        form.addEventListener("submit", (event) => {
            event.preventDefault();
            attempted = true;

            const firstInvalid = rules.filter((rule) => !check(rule))[0];

            if (firstInvalid) {
                focusControl(firstInvalid.name);
                return;
            }

            if (!success) return;

            $("[data-success-name]", success).textContent = valueOf("firstName");
            $("[data-success-email]", success).textContent = valueOf("email");

            form.hidden = true;
            success.hidden = false;
            success.focus();
            success.scrollIntoView({ behavior: "smooth", block: "center" });
        });
    }


    initNav();
    initYear();
    initEvents();
    initCalendarButtons();
    initProjects();
    initJoinForm();
})();


// Blog filters
document.querySelectorAll(".club-filter").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".club-filter").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    const category = button.dataset.filter;
    let visible = 0;
    document.querySelectorAll(".club-post").forEach((post) => {
      const show = category === "all" || post.dataset.category === category;
      post.hidden = !show;
      if (show) visible += 1;
    });
    const empty = document.querySelector(".club-empty");
    if (empty) empty.hidden = visible !== 0;
  });
});

// Newsletter preview behavior
document.querySelectorAll(".club-newsletter-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.checkValidity()) return form.reportValidity();
    const button = form.querySelector("button");
    button.textContent = "Subscribed ✓";
    button.disabled = true;
  });
});

// Contact preview behavior
const combinedContactForm = document.querySelector("#contactForm");
if (combinedContactForm) {
  combinedContactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!combinedContactForm.checkValidity()) return combinedContactForm.reportValidity();
    const button = combinedContactForm.querySelector('button[type="submit"]');
    button.textContent = "Message Sent ✓";
    button.disabled = true;
    combinedContactForm.reset();
  });
}


// Blog filters
const clubFilters = document.querySelectorAll(".club-filter");
const clubPosts = document.querySelectorAll(".club-post-card");
const clubEmptyState = document.querySelector(".club-empty-state");

clubFilters.forEach((filter) => {
    filter.addEventListener("click", () => {
        clubFilters.forEach((item) => item.classList.remove("active"));
        filter.classList.add("active");
        const category = filter.dataset.filter;
        let visible = 0;
        clubPosts.forEach((post) => {
            const show = category === "all" || post.dataset.category === category;
            post.hidden = !show;
            if (show) visible++;
        });
        if (clubEmptyState) clubEmptyState.hidden = visible !== 0;
    });
});

// Newsletter preview interaction
document.querySelectorAll(".club-newsletter-form").forEach((form) => {
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const input = form.querySelector('input[type="email"]');
        const button = form.querySelector('button[type="submit"]');
        if (!input.checkValidity()) {
            input.reportValidity();
            return;
        }
        button.textContent = "Subscribed ✓";
        button.disabled = true;
        input.disabled = true;
    });
});

// Contact form preview interaction
const clubContactForm = document.querySelector("#contactForm");
if (clubContactForm) {
    clubContactForm.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!clubContactForm.checkValidity()) {
            clubContactForm.reportValidity();
            return;
        }
        const button = clubContactForm.querySelector('button[type="submit"]');
        button.textContent = "Message Sent ✓";
        button.disabled = true;
        clubContactForm.reset();
    });
}
