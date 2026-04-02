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

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

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
    }
  );

  revealElements.forEach((element) => observer.observe(element));
}

window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("load", updateScrollProgress);

initReveal();
startRoleTyping();
playIntro();
