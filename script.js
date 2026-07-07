const progressBar = document.getElementById("scroll-progress-bar");
const revealElements = document.querySelectorAll(".reveal");
const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);

function updateScrollProgress() {
  const scrollableHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  const progress =
    scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
  progressBar.style.width = `${progress}%`;
}

function smoothScrollTo(targetY, duration = 650) {
  const startY = window.scrollY;
  const maxY =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  const clampedTargetY = Math.max(0, Math.min(targetY, maxY));
  const diff = clampedTargetY - startY;
  let start;

  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    window.scrollTo(0, startY + diff * easeInOut(progress));
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

function initSmoothAnchorScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function handleAnchorClick(event) {
      const selector = this.getAttribute("href");
      if (!selector || selector === "#") return;
      const target = document.querySelector(selector);
      if (!target) return;

      event.preventDefault();
      mobileMenu?.classList.remove("is-open");

      const offset = 90;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;

      if (prefersReducedMotion.matches) {
        window.scrollTo(0, top);
        return;
      }
      smoothScrollTo(top);
    });
  });
}

function initReveal() {
  if (prefersReducedMotion.matches) {
    revealElements.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -30px 0px" },
  );

  revealElements.forEach((el) => observer.observe(el));
}

function initMobileMenu() {
  if (!menuToggle || !mobileMenu) return;

  menuToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (event) => {
    if (
      !mobileMenu.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      mobileMenu.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

function initRings() {
  const circumference = 2 * Math.PI * 52;
  const rings = document.querySelectorAll(".ring[data-pct]");
  if (!rings.length) return;

  rings.forEach((ring) => {
    const pct = parseFloat(ring.dataset.pct) || 0;
    const offset = circumference * (1 - pct / 100);
    ring.style.setProperty("--target-offset", offset.toFixed(2));
  });

  if (prefersReducedMotion.matches) {
    rings.forEach((ring) => ring.classList.add("is-filled"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-filled");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 },
  );

  rings.forEach((ring) => observer.observe(ring));
}

window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("load", updateScrollProgress);

initReveal();
initRings();
initMobileMenu();
initSmoothAnchorScroll();

/* ---------- Console easter egg ---------- */
(function consoleEasterEgg() {
  const green = "color:#34e0a1; font-family:monospace;";
  const white = "color:#eef1fb; font-family:monospace;";
  const blue = "color:#63e6e8; font-family:monospace;";
  const gray = "color:#93a0c2; font-family:monospace;";

  console.log(
    `%c
  ███████╗ █████╗ ███╗   ██╗     ██╗ █████╗ ██╗
  ██╔════╝██╔══██╗████╗  ██║     ██║██╔══██╗██║
  ███████╗███████║██╔██╗ ██║     ██║███████║██║
  ╚════██║██╔══██║██║╚██╗██║██   ██║██╔══██║██║
  ███████║██║  ██║██║ ╚████║╚█████╔╝██║  ██║██║
  ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚════╝ ╚═╝  ╚═╝╚═╝
`,
    green,
  );

  console.log("%c> Oh! you found the hidden terminal.", green);
  console.log("%cYou found the hidden terminal.", gray);
  console.log("%cType help() to begin.", blue);

  window.help = () => {
    console.log("%cAvailable commands:", green);
    console.log("%cabout()     → who am I", white);
    console.log("%cprojects()  → view my work", white);
    console.log("%ccontact()   → reach me", white);
    console.log("%ceaster()    → secret 👀", white);
  };

  window.about = () => {
    console.log("%c> whoami", green);
    console.log("%cSanjai Magilan", white);
    console.log("%cWeb Dev + DevOps focused on scalable systems.", gray);
  };

  window.projects = () => {
    console.log("%c> opening projects...", green);
    document.querySelector("#projects")?.scrollIntoView({
      behavior: prefersReducedMotion.matches ? "auto" : "smooth",
    });
  };

  window.contact = () => {
    console.log("%c> initiating contact...", green);
    document.querySelector("#contact")?.scrollIntoView({
      behavior: prefersReducedMotion.matches ? "auto" : "smooth",
    });
  };

  window.easter = () => {
    console.log("%c> unlocking hidden mode...", green);
    setTimeout(() => {
      console.log("%cSystem message:", gray);
      console.log("%ctype the secret word anywhere on the page", green);
      console.log("%cyou did it!", white);
    }, 500);
  };
})();

/* ---------- Hidden game trigger (type "gun" anywhere on the page) ---------- */
(function setupHiddenGame() {
  const GAME_URL = "https://sanjai-magilan.github.io/";
  const SECRET_WORD = "gun";

  const modal = document.getElementById("game-modal");
  const iframe = document.getElementById("game-iframe");
  const backdrop = modal?.querySelector(".game-modal__backdrop");
  const closeBtn = document.getElementById("game-modal-close");

  if (!modal || !iframe) return;

  let buffer = "";

  function openGame() {
    iframe.src = GAME_URL;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeGame() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    iframe.src = "";
  }

  document.addEventListener("keydown", (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.key.length !== 1) return;

    buffer = (buffer + event.key.toLowerCase()).slice(-SECRET_WORD.length);
    if (buffer === SECRET_WORD) {
      openGame();
      buffer = "";
    }
  });

  backdrop?.addEventListener("click", closeGame);
  closeBtn?.addEventListener("click", closeGame);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeGame();
    }
  });
})();