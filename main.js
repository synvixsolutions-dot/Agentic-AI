/* ========================================
   MOBILE NAVIGATION
======================================== */

const menuToggle =
    document.querySelector(".menu-toggle");

const navLinks =
    document.querySelector(".nav-links");


if (menuToggle && navLinks) {

    menuToggle.addEventListener(
        "click",
        () => {

            /*
                classList.toggle()

                If "open" doesn't exist:
                    → adds it

                If "open" already exists:
                    → removes it
            */

            const isOpen =
                navLinks.classList.toggle("open");


            /*
                This updates the accessibility
                information for screen readers.
            */

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        }
    );


    /*
        Close the mobile menu when
        the user clicks a navigation link.
    */

    navLinks
        .querySelectorAll("a")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    navLinks
                        .classList
                        .remove("open");

                    menuToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }
            );

        });

}



/* ========================================
   BLOG CATEGORY FILTER
======================================== */

const filters =
    document.querySelectorAll(".filter");


const posts =
    document.querySelectorAll(".post-card");


const emptyState =
    document.querySelector(".empty-state");


filters.forEach(filter => {

    filter.addEventListener(
        "click",
        () => {

            /*
                Remove active state
                from every filter.
            */

            filters.forEach(item => {

                item.classList.remove("active");

            });


            /*
                Add active state
                to clicked filter.
            */

            filter.classList.add("active");


            /*
                Get the category from:

                data-filter="articles"

                JavaScript reads it as:

                filter.dataset.filter
            */

            const category =
                filter.dataset.filter;


            let visiblePosts = 0;


            /*
                Check every blog card.
            */

            posts.forEach(post => {

                /*
                    Example:

                    post.dataset.category

                    might be:

                    "articles"
                */

                const postCategory =
                    post.dataset.category;


                /*
                    Show all posts if
                    "All" is selected.

                    Otherwise show only
                    matching category.
                */

                const shouldShow =
                    category === "all" ||
                    postCategory === category;


                post.hidden =
                    !shouldShow;


                if (shouldShow) {

                    visiblePosts++;

                }

            });


            /*
                If there are no posts
                in that category,
                show the empty message.
            */

            if (emptyState) {

                emptyState.hidden =
                    visiblePosts !== 0;

            }

        }
    );

});



/* ========================================
   NEWSLETTER FORM
======================================== */

const newsletterForms =
    document.querySelectorAll(
        ".newsletter-form"
    );


newsletterForms.forEach(form => {

    form.addEventListener(
        "submit",
        event => {

            /*
                Prevent the browser
                from refreshing the page.
            */

            event.preventDefault();


            const input =
                form.querySelector(
                    "input[type='email']"
                );


            const button =
                form.querySelector("button");


            /*
                Check whether the
                email is valid.
            */

            if (!input.checkValidity()) {

                input.reportValidity();

                return;

            }


            /*
                For now this is only UI.

                Later this button will
                connect to the backend.
            */

            button.textContent =
                "Subscribed ✓";


            button.disabled = true;

            input.disabled = true;

        }
    );

});

/* ========================================
   CONTACT FORM
======================================== */

const contactForm =
    document.querySelector("#contactForm");


if (contactForm) {

    contactForm.addEventListener(
        "submit",
        function (event) {

            /*
                Stop the browser from
                refreshing the page.
            */

            event.preventDefault();


            /*
                Check HTML validation.

                required fields and
                email type are checked.
            */

            if (!contactForm.checkValidity()) {

                contactForm.reportValidity();

                return;

            }


            /*
                Find the submit button.
            */

            const button =
                contactForm.querySelector(
                    "button[type='submit']"
                );


            /*
                TEMPORARY UI RESPONSE.

                Later this will be replaced
                with an API request.
            */

            button.textContent =
                "Message Sent ✓";


            button.disabled = true;


            /*
                Optional:

                Clear the form after
                successful submission.
            */

            contactForm.reset();

        }
    );

}