/* Loads every standalone page into its matching section on index.html.
 * Edit about.html, events.html, projects.html, blog.html, join.html, faq.html,
 * or contact.html; the homepage reflects those changes on its next load.
 * Run through Live Server or a web server, not file://.
 */
(() => {
  "use strict";
  const sectionFiles = {
    about: "about.html",
    events: "events.html",
    projects: "projects.html",
    blog: "blog.html",
    join: "join.html",
    faq: "faq.html",
    contact: "contact.html"
  };
  const pageLinks = ["about", "events", "projects", "blog", "join", "faq", "contact"];

  async function loadSection(name, filePath) {
    const container = document.querySelector(`[data-section-content="${name}"]`);
    if (!container) return;
    try {
      const response = await fetch(filePath, { cache: "no-cache" });
      if (!response.ok) throw new Error(`${filePath} returned ${response.status}`);
      const html = await response.text();
      const parsed = new DOMParser().parseFromString(html, "text/html");
      const sourceMain = parsed.querySelector("main#main, main");
      if (!sourceMain) throw new Error(`No <main> content found in ${filePath}`);
      container.innerHTML = sourceMain.innerHTML;

      // Convert links between standalone pages into scrolling links on index.html.
      container.querySelectorAll("a[href]").forEach((link) => {
        const raw = link.getAttribute("href");
        if (!raw) return;
        const clean = raw.split(/[?#]/)[0].replace(/^\.\//, "");
        if (clean === "index.html" || clean === "") {
          const hash = raw.includes("#") ? raw.slice(raw.indexOf("#")) : "#home";
          link.setAttribute("href", hash);
        } else if (pageLinks.includes(clean.replace(/\.html$/, ""))) {
          const page = clean.replace(/\.html$/, "");
          const hash = raw.includes("#") ? raw.slice(raw.indexOf("#")) : `#${page}`;
          link.setAttribute("href", hash);
        }
      });
    } catch (error) {
      console.error(`Unable to load ${name} section:`, error);
      container.innerHTML = `<p class="section-load-error">Unable to load this section. Please run the site using Live Server or a web server.</p>`;
    }
  }

  function loadScriptOnce(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[data-dynamic-src="${src}"]`)) return resolve();
      const script = document.createElement("script");
      script.src = src; script.dataset.dynamicSrc = src;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Unable to load ${src}`));
      document.body.appendChild(script);
    });
  }

  async function init() {
    await Promise.all(Object.entries(sectionFiles).map(([name, path]) => loadSection(name, path)));
    try {
      await loadScriptOnce("js/main.js");
      document.dispatchEvent(new CustomEvent("sections:loaded"));
      if (location.hash) {
        const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
        if (target) requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
      }
    } catch (error) { console.error(error); }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
