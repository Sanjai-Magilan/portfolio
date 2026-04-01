const introOverlay = document.getElementById("intro-overlay");
const introLines = document.getElementById("intro-lines");
const typingText = document.getElementById("typing-text");
const themeToggle = document.getElementById("theme-toggle");
const progressBar = document.getElementById("scroll-progress-bar");
const revealElements = document.querySelectorAll(".reveal");

const roles = [
  "Web Developer",
  "DevOps Enthusiast",
  "Automation Builder",
  "Performance Optimizer",
];

const terminalMessages = [
  "> initializing portfolio...",
  "> loading projects...",
  "> welcome to my portfolio!",
];

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

// Persist the user's preferred theme between visits.
function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme-preference", theme);
}

function initTheme() {
  const savedTheme = localStorage.getItem("theme-preference");
  const systemTheme = window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";

  setTheme(savedTheme || systemTheme);
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
    await typeText(line, message, 34);
    await wait(220);
  }

  await wait(400);
  introOverlay.classList.add("is-hidden");
}

async function typeText(element, text, speed) {
  for (let index = 0; index < text.length; index += 1) {
    element.textContent += text[index];
    await wait(speed);
  }
}

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

    if (isDeleting) {
      charIndex -= 1;
    } else {
      charIndex += 1;
    }

    typingText.textContent = currentRole.slice(0, charIndex);

    let delay = isDeleting ? 55 : 85;

    if (!isDeleting && charIndex === currentRole.length) {
      delay = 1300;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 260;
    }

    window.setTimeout(tick, delay);
  };

  tick();
}

function updateScrollProgress() {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
  progressBar.style.width = `${progress}%`;
}

function initReveal() {
  if (prefersReducedMotion.matches) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  // Reveal sections only once to keep scrolling smooth and inexpensive.
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
      threshold: 0.18,
      rootMargin: "0px 0px -30px 0px",
    }
  );

  revealElements.forEach((element) => observer.observe(element));
}

themeToggle?.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  setTheme(currentTheme === "light" ? "dark" : "light");
});

window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("load", updateScrollProgress);

initTheme();
initReveal();
startRoleTyping();
playIntro();
