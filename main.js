/* ========================================
   MOBILE NAVIGATION
======================================== */

const menuToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector("#site-nav");

if (menuToggle && siteNav) {

    const setNavOpen = (open) => {
        siteNav.classList.toggle("is-open", open);
        menuToggle.setAttribute("aria-expanded", String(open));
    };

    menuToggle.addEventListener("click", () => {
        setNavOpen(!siteNav.classList.contains("is-open"));
    });

    // Close the menu when a link is clicked
    siteNav.addEventListener("click", (event) => {
        if (event.target.closest("a")) setNavOpen(false);
    });

    // Close the menu with the Escape key
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && siteNav.classList.contains("is-open")) {
            setNavOpen(false);
            menuToggle.focus();
        }
    });

    // Reset when the window grows back to desktop width
    window.matchMedia("(min-width: 1041px)").addEventListener("change", (event) => {
        if (event.matches) setNavOpen(false);
    });

}



/* ========================================
   SMALL HELPERS
======================================== */

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;



/* ========================================
   BLOG: CATEGORY FILTER + SEARCH + LIVE COUNT
======================================== */

const filters = $$(".filter");
const posts = $$(".post-card");
const emptyState = $(".empty-state");
const blogSearch = $("[data-blog-search]");
const blogCount = $("[data-blog-count]");

if (posts.length) {

    let activeCategory = "all";

    const updatePosts = () => {

        const query = blogSearch ? blogSearch.value.trim().toLowerCase() : "";
        let visiblePosts = 0;

        posts.forEach(post => {

            const matchesCategory =
                activeCategory === "all" ||
                post.dataset.category === activeCategory;

            /*
                Search looks at everything inside the card:
                title, category, read time and tags.
            */

            const matchesSearch =
                !query ||
                post.textContent.toLowerCase().includes(query);

            const shouldShow = matchesCategory && matchesSearch;

            post.hidden = !shouldShow;

            if (shouldShow) visiblePosts++;

        });

        if (blogCount) {
            blogCount.textContent =
                `Showing ${visiblePosts} of ${posts.length} posts`;
        }

        if (emptyState) {
            emptyState.hidden = visiblePosts !== 0;
        }

    };

    filters.forEach(filter => {

        filter.addEventListener("click", () => {

            activeCategory = filter.dataset.filter;

            filters.forEach(item => {
                const isActive = item === filter;
                item.classList.toggle("active", isActive);
                item.setAttribute("aria-pressed", String(isActive));
            });

            updatePosts();

        });

    });

    if (blogSearch) {
        blogSearch.addEventListener("input", updatePosts);
    }

    updatePosts();

}



/* ========================================
   SHARED: INLINE FIELD CHECKING
======================================== */

/*
    Each rule describes one field:
        name     → the field's name attribute
        message  → what to show when it's wrong
        test     → optional extra check
    Errors are written into #<name>-error.
*/

function createChecker(form, rules, options = {}) {

    const errorId = options.errorId || (rule => `${rule.name}-error`);

    const valueOf = name => {
        const data = new FormData(form);
        return String(data.get(name) || "").trim();
    };

    const check = rule => {

        const value = valueOf(rule.name);
        const valid = value !== "" && (!rule.test || rule.test(value));

        const error = document.getElementById(errorId(rule));
        const control = form.elements[rule.name];
        const group = $(`[data-group="${rule.name}"]`, form);

        if (error) error.textContent = valid ? "" : rule.message;

        if (control instanceof HTMLElement) {
            control.setAttribute("aria-invalid", String(!valid));
        }

        if (group) group.classList.toggle("is-invalid", !valid);

        return valid;

    };

    const focusField = name => {
        const control = form.elements[name];
        const target = control instanceof HTMLElement ? control : control[0];
        if (target) target.focus();
    };

    /*
        Runs every rule. Returns true only if all pass,
        and moves focus to the first field that failed.
    */

    const checkAll = () => {
        const failed = rules.filter(rule => !check(rule));
        if (failed.length) focusField(failed[0].name);
        return failed.length === 0;
    };

    /*
        After the first submit attempt, re-check a field
        as the visitor fixes it.
    */

    let attempted = false;

    const recheck = event => {
        if (!attempted) return;
        const rule = rules.find(item => item.name === event.target.name);
        if (rule) check(rule);
    };

    form.addEventListener("input", recheck);
    form.addEventListener("change", recheck);

    return {
        valueOf,
        checkAll: () => {
            attempted = true;
            return checkAll();
        },
        reset: () => {
            attempted = false;
            rules.forEach(rule => {
                const error = document.getElementById(errorId(rule));
                const control = form.elements[rule.name];
                if (error) error.textContent = "";
                if (control instanceof HTMLElement) {
                    control.removeAttribute("aria-invalid");
                }
            });
        }
    };

}



/* ========================================
   BLOG: NEWSLETTER WITH THANK-YOU PANEL
======================================== */

const newsletterForm = $("[data-newsletter]");

if (newsletterForm) {

    const success = $("[data-newsletter-success]");

    const checker = createChecker(
        newsletterForm,
        [
            { name: "name", message: "Enter your first name." },
            {
                name: "email",
                message: "Enter a valid email address.",
                test: value => EMAIL_PATTERN.test(value)
            }
        ],
        { errorId: rule => `newsletter-${rule.name}-error` }
    );

    newsletterForm.addEventListener("submit", event => {

        /* Stop the browser from refreshing the page. */
        event.preventDefault();

        if (!checker.checkAll()) return;

        /*
            For now this is only UI.
            Later this is where the email is sent to a backend.
        */

        $("[data-newsletter-name]", success).textContent =
            checker.valueOf("name");

        $("[data-newsletter-email]", success).textContent =
            checker.valueOf("email");

        newsletterForm.hidden = true;
        success.hidden = false;
        success.focus({ preventScroll: true });

    });

}



/* ========================================
   CONTACT: TOPIC CHIPS, COUNTER, THANK-YOU
======================================== */

const contactForm = $("[data-contact-form]");

if (contactForm) {

    const success = $("[data-contact-success]");
    const hint = $("[data-topic-hint]");

    const topicHints = {
        join: 'Ready to join? The <a href="join.html">sign-up form</a> is the quickest way in.',
        collaborate: "Tell us what you're building and what kind of help you're after.",
        speak: "Tell us your topic and a few dates that could work.",
        general: "Ask away. We read every message."
    };

    const topicReplies = {
        join: "We'll point you to the best way to get started.",
        collaborate: "We'll get back to you about working together.",
        speak: "We'll follow up about speaking at an event.",
        general: "We'll get back to you with an answer."
    };

    const checker = createChecker(
        contactForm,
        [
            { name: "name", message: "Enter your name." },
            {
                name: "email",
                message: "Enter a valid email address.",
                test: value => EMAIL_PATTERN.test(value)
            },
            { name: "topic", message: "Pick what your message is about." },
            {
                name: "message",
                message: "Write a short message (at least 10 characters).",
                test: value => value.length >= 10
            }
        ]
    );

    /* Live character counter */

    const counter = $("[data-counter-for]", contactForm);
    const messageField = contactForm.elements.message;

    const renderCounter = () => {
        const max = messageField.getAttribute("maxlength");
        counter.textContent = `${messageField.value.length} / ${max}`;
    };

    messageField.addEventListener("input", renderCounter);
    renderCounter();

    /* A short tip appears when a topic chip is chosen */

    contactForm.addEventListener("change", event => {

        if (event.target.name !== "topic") return;

        hint.innerHTML = topicHints[event.target.value] || "";
        hint.hidden = !hint.innerHTML;

    });

    contactForm.addEventListener("submit", event => {

        /* Stop the browser from refreshing the page. */
        event.preventDefault();

        if (!checker.checkAll()) return;

        /*
            TEMPORARY UI RESPONSE.
            Later this will be replaced with an API request.
        */

        const firstName = checker.valueOf("name").split(/\s+/)[0];

        $("[data-success-name]", success).textContent = firstName;
        $("[data-success-email]", success).textContent = checker.valueOf("email");
        $("[data-success-topic]", success).textContent =
            topicReplies[checker.valueOf("topic")] || "";

        contactForm.hidden = true;
        success.hidden = false;
        success.focus({ preventScroll: true });
        success.scrollIntoView({ behavior: "smooth", block: "start" });

    });

    /* "Send another message" brings the form back, empty. */

    const resetButton = $("[data-contact-reset]", success);

    if (resetButton) {

        resetButton.addEventListener("click", () => {

            contactForm.reset();
            checker.reset();
            renderCounter();

            hint.hidden = true;
            hint.innerHTML = "";

            success.hidden = true;
            contactForm.hidden = false;

            contactForm.elements.name.focus();

        });

    }

}



/* ========================================
   FAQ ACCORDION
======================================== */

const faqQuestions = $$(".faq-question");

const setFaqItem = (faqItem, open) => {

    faqItem.classList.toggle("open", open);

    const button = $(".faq-question", faqItem);

    if (button) button.setAttribute("aria-expanded", String(open));

};

faqQuestions.forEach(question => {

    question.addEventListener("click", () => {

        const faqItem = question.parentElement;
        const isOpen = faqItem.classList.contains("open");

        /* Close all FAQ items */
        $$(".faq-item").forEach(item => setFaqItem(item, false));

        /* Open the clicked item */
        if (!isOpen) setFaqItem(faqItem, true);

    });

});

/*
    Links such as faq.html#faq-experience (from the
    Contact page) open the matching answer.
*/

const openFaqFromHash = () => {

    if (!faqQuestions.length || !location.hash) return;

    const target = document.getElementById(location.hash.slice(1));

    if (target && target.classList.contains("faq-item")) {

        $$(".faq-item").forEach(item => setFaqItem(item, false));
        setFaqItem(target, true);
        target.scrollIntoView({ block: "center" });

    }

};

openFaqFromHash();
window.addEventListener("hashchange", openFaqFromHash);
