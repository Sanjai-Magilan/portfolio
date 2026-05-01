const introOverlay = document.getElementById("intro-overlay");
const introLines = document.getElementById("intro-lines");
const typingText = document.getElementById("typing-text");
const themeToggle = document.querySelector(".theme-toggle");
const themeColorMeta = document.querySelector('meta[name="theme-color"]');
const progressBar = document.getElementById("scroll-progress-bar");
const revealElements = document.querySelectorAll(".reveal");
const tiltCards = document.querySelectorAll(
  ".content-card, .skill-group, .project-card, .timeline-card, .impact-card, .contact-card, .terminal, .intro-terminal, .terminal-card, .contact-terminal, .card",
);

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

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);

// Persist the user's preferred theme between visits.
function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme-preference", theme);

  if (themeColorMeta) {
    themeColorMeta.setAttribute(
      "content",
      theme === "dark" ? "#090c13" : "#f6f8fc",
    );
  }
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
  const scrollableHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  const progress =
    scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
  progressBar.style.width = `${progress}%`;
}

function smoothScrollTo(targetY, duration = 700) {
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
    const eased = easeInOut(progress);

    window.scrollTo(0, startY + diff * eased);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
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

      const offset = 80;
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
    },
  );

  revealElements.forEach((element) => observer.observe(element));
}

function initCardTilt() {
  if (prefersReducedMotion.matches) return;

  const supportsHover = window.matchMedia(
    "(hover: hover) and (pointer: fine)",
  ).matches;

  if (!supportsHover) return;

  tiltCards.forEach((card) => {
    let frameId = null;
    let targetTiltX = 0;
    let targetTiltY = 0;
    let currentTiltX = 0;
    let currentTiltY = 0;
    let targetGlowX = 50;
    let targetGlowY = 24;
    let currentGlowX = 50;
    let currentGlowY = 24;
    let isActive = false;

    const render = () => {
      currentTiltX += (targetTiltX - currentTiltX) * 0.12;
      currentTiltY += (targetTiltY - currentTiltY) * 0.12;
      currentGlowX += (targetGlowX - currentGlowX) * 0.14;
      currentGlowY += (targetGlowY - currentGlowY) * 0.14;

      card.style.setProperty("--tilt-x", `${currentTiltX.toFixed(2)}deg`);
      card.style.setProperty("--tilt-y", `${currentTiltY.toFixed(2)}deg`);
      card.style.setProperty("--glow-x", `${currentGlowX.toFixed(2)}%`);
      card.style.setProperty("--glow-y", `${currentGlowY.toFixed(2)}%`);

      const settledTilt =
        Math.abs(targetTiltX - currentTiltX) < 0.01 &&
        Math.abs(targetTiltY - currentTiltY) < 0.01;
      const settledGlow =
        Math.abs(targetGlowX - currentGlowX) < 0.05 &&
        Math.abs(targetGlowY - currentGlowY) < 0.05;

      if (isActive || !settledTilt || !settledGlow) {
        frameId = window.requestAnimationFrame(render);
      } else {
        frameId = null;
      }
    };

    const startRender = () => {
      if (frameId === null) {
        frameId = window.requestAnimationFrame(render);
      }
    };

    const resetCard = () => {
      isActive = false;
      targetTiltX = 0;
      targetTiltY = 0;
      targetGlowX = 50;
      targetGlowY = 24;
      startRender();
    };

    card.addEventListener("pointerenter", () => {
      isActive = true;
      startRender();
    });

    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      const pointerX = (event.clientX - bounds.left) / bounds.width;
      const pointerY = (event.clientY - bounds.top) / bounds.height;

      targetTiltY = (pointerX - 0.5) * 8;
      targetTiltX = (0.5 - pointerY) * 7;
      targetGlowX = pointerX * 100;
      targetGlowY = pointerY * 100;
      startRender();
    });

    card.addEventListener("pointerleave", resetCard);
    card.addEventListener("pointercancel", resetCard);
  });
}

function initMobileMenu() {
  const nav = document.querySelector(".nav");
  const navLinks = document.querySelector(".nav__links");
  if (!nav || !navLinks) return;

  let menuToggle = nav.querySelector(".menu-toggle");
  let menu = nav.querySelector(".mobile-menu");

  if (!menuToggle) {
    menuToggle = document.createElement("button");
    menuToggle.className = "menu-toggle";
    menuToggle.type = "button";
    menuToggle.setAttribute("aria-label", "Toggle navigation menu");
    menuToggle.textContent = "☰";
    nav.appendChild(menuToggle);
  }

  if (!menu) {
    menu = document.createElement("div");
    menu.className = "mobile-menu";
    menu.setAttribute("aria-label", "Mobile navigation");
    menu.innerHTML = navLinks.innerHTML;
    nav.appendChild(menu);
  }

  menuToggle.addEventListener("click", () => {
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

themeToggle?.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");

  if (current === "dark") {
    setTheme("light");
  } else {
    setTheme("dark");
  }
});

window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("load", updateScrollProgress);

initTheme();
initReveal();
initCardTilt();
initMobileMenu();
initSmoothAnchorScroll();
startRoleTyping();
playIntro();

// CONSOLE EASTER EGG
(function consoleEasterEgg() {
  const green = "color:#3fb950; font-family:monospace;";
  const white = "color:#e6edf3; font-family:monospace;";
  const blue = "color:#79c0ff; font-family:monospace;";
  const gray = "color:#8b949e; font-family:monospace;";

  // ASCII banner (clean, not cringe)
  console.log(
    `%c
  ███████╗ █████╗ ███╗   ██╗     ██╗ █████╗ ██╗
  ██╔════╝██╔══██╗████╗  ██║     ██║██╔══██╗██║
  ███████╗███████║██╔██╗ ██║     ██║███████║██║
  ╚════██║██╔══██║██║╚██╗██║██   ██║██╔══██║██║
  ███████║██║  ██║██║ ╚████║╚█████╔╝██║  ██║██║
  ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚════╝ ╚═╝  ╚═╝╚═╝

  ███╗   ███╗ █████╗  ██████╗ ██╗██╗      █████╗ ███╗   ██╗
  ████╗ ████║██╔══██╗██╔════╝ ██║██║     ██╔══██╗████╗  ██║
  ██╔████╔██║███████║██║  ███╗██║██║     ███████║██╔██╗ ██║
  ██║╚██╔╝██║██╔══██║██║   ██║██║██║     ██╔══██║██║╚██╗██║
  ██║ ╚═╝ ██║██║  ██║╚██████╔╝██║███████╗██║  ██║██║ ╚████║
  ╚═╝     ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝
`,
    green,
  );

  console.log("%c> Oh ! you found the hidden terminal.", green);
  console.log("%c> Only Pros like you can access this.", green);

  // console.log("%cHey Buddy.", white);
  console.log("%cYou found the hidden terminal.", gray);

  console.log("%cType help() to begin.", blue);

  // ===============================
  // 🧠 COMMAND SYSTEM
  // ===============================

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

  // SECRET COMMAND

  window.easter = () => {
    console.log("%c> unlocking hidden mode...", green);

    setTimeout(() => {
      console.log("%cSystem message:", gray);
      console.log("%cIf you're reading this...", white);
      console.log("%cyou're exactly the kind of engineer I like 😄", green);
    }, 600);
  };
})();

/* Contact terminal input + game modal (secret word: "gun") */
(function setupContactTerminalGame() {
  const CONTACT_GAME_URL = "https://sanjai-magilan.github.io/";

  const contactTerminal = document.querySelector(".contact-terminal");
  if (!contactTerminal) return;

  const cursorLine = contactTerminal.querySelector(
    ".contact-terminal__cursor-line",
  );
  if (!cursorLine) return;

  let inputSpan = cursorLine.querySelector(".contact-terminal__input");
  if (!inputSpan) {
    inputSpan = document.createElement("span");
    inputSpan.className = "contact-terminal__input";
    const cursorEl = cursorLine.querySelector(".terminal-cursor");
    cursorLine.insertBefore(inputSpan, cursorEl);
  }

  let buffer = "";
  let focused = false;

  // Create modal elements
  const modal = document.createElement("div");
  modal.className = "game-modal";
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = `
    <div class="game-modal__backdrop"></div>
    <div class="game-modal__content">
      <iframe id="game-iframe" src="" allow="autoplay; fullscreen"></iframe>
    </div>
  `;
  document.body.appendChild(modal);

  const iframe = modal.querySelector("#game-iframe");
  const content = modal.querySelector(".game-modal__content");
  const backdrop = modal.querySelector(".game-modal__backdrop");

  function openGameModal() {
    iframe.src = CONTACT_GAME_URL;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    appendContactLine(`> secret unlocked enjoy the game!`);
  }

  function closeGameModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    // stop audio/game by clearing src
    iframe.src = "";
  }

  backdrop.addEventListener("click", closeGameModal);
  modal.addEventListener("click", (e) => {
    if (content && !content.contains(e.target)) {
      closeGameModal();
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeGameModal();
    }
  });

  contactTerminal.addEventListener("click", () => {
    focused = true;
    // place caret at end visually
    inputSpan.focus?.();
  });

  document.addEventListener("click", (e) => {
    if (!contactTerminal.contains(e.target)) focused = false;
  });

  document.addEventListener("keydown", (e) => {
    if (!focused) return;

    if (e.key === "Backspace") {
      buffer = buffer.slice(0, -1);
      inputSpan.textContent = buffer;
      e.preventDefault();
      return;
    }

    if (e.key === "Enter") {
      const cmd = buffer.trim().toLowerCase();
      handleCommand(cmd);
      buffer = "";
      inputSpan.textContent = "";
      e.preventDefault();
      return;
    }

    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      buffer += e.key;
      inputSpan.textContent = buffer;
      e.preventDefault();
    }
  });

  function handleCommand(cmd) {
    if (!cmd) return;
    if (cmd === "gun") {
      openGameModal();
      return;
    }
    if (cmd === "help") {
      appendContactLine(
        "> help: try entering the secret word or use the visible links",
      );
      return;
    }
    appendContactLine(`> Unknown command: ${cmd}`);
  }

  function appendContactLine(text) {
    const p = document.createElement("p");
    p.className = "contact-terminal__line";
    p.textContent = text;
    // insert before cursor line so cursor stays at bottom
    contactTerminal.insertBefore(p, cursorLine);
    // keep the terminal scrolled to bottom
    contactTerminal.scrollTop = contactTerminal.scrollHeight;
  }
})();
