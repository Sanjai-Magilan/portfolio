const introOverlay = document.getElementById("intro-overlay");
const introLines = document.getElementById("intro-lines");
const typingText = document.getElementById("typing-text");
const progressBar = document.getElementById("scroll-progress-bar");
const revealElements = document.querySelectorAll(".reveal");

const roles = [
  "Web Developer & DevOps Enthusiast",
  "Automation Builder",
  "Backend-Focused Problem Solver",
  "Scalable Systems Enthusiast",
];

const terminalMessages = [
  "> booting portfolio...",
  "> loading modules: about, skills, projects...",
  "> status: ready",
];

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);

function wait(duration) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, duration);
  });
}

function startRoleTyping() {
  if (!typingText) return;

  if (prefersReducedMotion.matches) {
    typingText.textContent = roles[0];
    return;
  }

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const tick = () => {
    const currentRole = roles[roleIndex];

    charIndex += isDeleting ? -1 : 1;
    typingText.textContent = currentRole.slice(0, charIndex);

    let delay = isDeleting ? 28 : 46;

    if (!isDeleting && charIndex === currentRole.length) {
      delay = 1100;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 220;
    }

    window.setTimeout(tick, delay);
  };

  tick();
}

async function typeText(element, text, speed) {
  for (let index = 0; index < text.length; index += 1) {
    element.textContent += text[index];
    await wait(speed);
  }
}

async function playIntro() {
  if (!introOverlay || !introLines) return;

  if (prefersReducedMotion.matches) {
    introOverlay.classList.add("is-hidden");
    return;
  }

  for (const message of terminalMessages) {
    const line = document.createElement("p");
    line.className = "intro-line";
    introLines.appendChild(line);
    await typeText(line, message, 24);
    await wait(160);
  }

  await wait(280);
  introOverlay.classList.add("is-hidden");
}

function updateScrollProgress() {
  if (!progressBar) return;

  const scrollableHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  const progress =
    scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;

  progressBar.style.width = `${progress}%`;
}

function initReveal() {
  if (prefersReducedMotion.matches) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
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
    {
      threshold: 0.16,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  revealElements.forEach((element) => observer.observe(element));
}

function smoothScrollTo(targetY, duration = 700) {
  const maxY = document.documentElement.scrollHeight - window.innerHeight;
  const destination = Math.max(0, Math.min(targetY, maxY));

  if (prefersReducedMotion.matches) {
    window.scrollTo(0, destination);
    return;
  }

  const startY = window.scrollY;
  const diff = destination - startY;
  let start;

  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
  }

  function step(timestamp) {
    if (!start) start = timestamp;

    const progress = (timestamp - start) / duration;
    const eased = easeInOut(Math.min(progress, 1));

    window.scrollTo(0, startY + diff * eased);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

function initSmoothScroll() {
  const inPageLinks = document.querySelectorAll('a[href^="#"]');

  inPageLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();

      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;

      smoothScrollTo(top);
    });
  });
}

function initMobileMenu() {
  const nav = document.querySelector(".nav");
  const navLinks = document.querySelector(".nav__links");
  if (!nav || !navLinks) return;

  let toggle = nav.querySelector(".menu-toggle");
  let menu = nav.querySelector(".mobile-menu");

  if (!toggle) {
    toggle = document.createElement("button");
    toggle.className = "menu-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-label", "Toggle navigation menu");
    toggle.textContent = "☰";
    nav.appendChild(toggle);
  }

  if (!menu) {
    menu = document.createElement("div");
    menu.className = "mobile-menu";
    menu.innerHTML = navLinks.innerHTML;
    nav.appendChild(menu);
  }

  toggle.addEventListener("click", () => {
    menu.style.display = menu.style.display === "block" ? "none" : "block";
  });

  menu.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      menu.style.display = "none";
    }
  });

  document.addEventListener("click", (event) => {
    if (!nav.contains(event.target)) {
      menu.style.display = "none";
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      menu.style.display = "none";
    }
  });
}

window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("load", updateScrollProgress);

initReveal();
initSmoothScroll();
initMobileMenu();
startRoleTyping();
playIntro();
