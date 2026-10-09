(() => {
  const body = document.body;
  const stack = document.querySelector(".policy-stack");
  const panelTrack = stack ? stack.querySelector(".policy-panels") : null;
  if (!stack || !panelTrack) {
    return;
  }

  const panels = Array.from(document.querySelectorAll(".policy-panel"));
  const backdrop = document.querySelector(".policy-backdrop");
  const root = document.documentElement;
  let openPanel = null;
  let openSize = 0;

  const centerStack = () => {
    if (!panels.length || openPanel) return;

    // GEOMETRY RECONSTRUCTION APPROACH
    // We calculate the exact "Ideal" center of the stack by simulating it with a Ghost element.
    // This ignores all current animation states, open/close transitions, or DOM quirks.

    // 1. Reset any restrictive styling from previous attempts
    panelTrack.style.width = "";

    // 2. Setup Ghost for Measurement
    const ghost = document.createElement("div");
    ghost.className = "policy-panel";
    ghost.style.transition = "none";
    ghost.style.visibility = "hidden";
    panelTrack.appendChild(ghost);

    // Measure Index 0
    ghost.style.setProperty("--i", "0");
    const style0 = getComputedStyle(ghost);
    const p0Left = parseFloat(style0.left) || 0;
    const unitWidth = parseFloat(style0.width) || 0;

    // Measure Index N-1 (Last Panel)
    const lastIndex = Math.max(0, panels.length - 1);
    ghost.style.setProperty("--i", `${lastIndex}`);
    // Force style recalc? Usually accessing properties does it, but let's be sure.
    const styleLast = getComputedStyle(ghost);
    const pLastLeft = parseFloat(styleLast.left) || 0;

    // Cleanup
    panelTrack.removeChild(ghost);

    // 3. Calculate Geometry
    // Content spans from p0Left to (pLastLeft + unitWidth)
    const contentCenterRel = (p0Left + (pLastLeft + unitWidth)) / 2;

    // 4. Calculate Shift relative to Static Anchor
    const stackRect = stack.getBoundingClientRect();
    const naturalTrackLeft = stackRect.left;
    const targetCenter = window.innerWidth / 2;

    const newShift = targetCenter - naturalTrackLeft - contentCenterRel;

    requestAnimationFrame(() => {
      panelTrack.style.setProperty("--policy-stack-shift", `${newShift}px`);
    });
  };

  const computeOpenSize = () => {
    const padding = window.innerWidth < 700 ? 32 : 64;
    const maxSize = Math.min(window.innerWidth - padding, window.innerHeight - padding);
    const minSize = window.innerWidth < 700 ? 260 : 320;
    openSize = Math.max(minSize, Math.min(maxSize, 640));
    root.style.setProperty("--policy-open-size", `${Math.round(openSize)}px`);
    const radius = Math.max(20, Math.min(32, Math.round(openSize * 0.08)));
    root.style.setProperty("--policy-open-radius", `${radius}px`);
  };

  const centerPanel = (panel) => {
    const rect = panel.getBoundingClientRect();
    const actualHeight = panel.classList.contains("is-open") ? panel.offsetHeight : rect.height;
    const targetX = window.innerWidth / 2;
    const targetY = window.innerHeight / 2;
    const shiftX = Math.round(targetX - (rect.left + rect.width / 2));
    const shiftY = Math.round(targetY - (rect.top + rect.height / 2));
    panel.style.setProperty("--policy-shift-x", `${shiftX}px`);
    panel.style.setProperty("--policy-shift-y", `${shiftY}px`);
  };

  const lockScroll = () => {
    const scrollBar = window.innerWidth - document.documentElement.clientWidth;
    if (scrollBar > 0) {
      body.style.paddingRight = `${scrollBar}px`;
    }
    body.classList.add("policy-open");
  };

  const unlockScroll = () => {
    body.classList.remove("policy-open");
    body.style.paddingRight = "";
  };

  const closePanel = (panel, options = {}) => {
    panel.classList.remove("is-open");
    panel.style.removeProperty("--policy-shift-x");
    panel.style.removeProperty("--policy-shift-y");
    const trigger = panel.querySelector(".policy-panel-trigger");
    if (trigger) {
      trigger.setAttribute("aria-expanded", "false");
    }
    openPanel = null;
    if (!options.keepBody) {
      unlockScroll();
      centerStack();
    }
  };

  const openPanelCard = (panel) => {
    if (openPanel === panel) {
      return;
    }
    if (openPanel) {
      closePanel(openPanel, { keepBody: true });
    }
    computeOpenSize();
    openPanel = panel;
    panel.classList.add("is-open");
    centerPanel(panel);
    const trigger = panel.querySelector(".policy-panel-trigger");
    if (trigger) {
      trigger.setAttribute("aria-expanded", "true");
    }
    lockScroll();
  };

  panels.forEach((panel) => {
    const trigger = panel.querySelector(".policy-panel-trigger");
    const closeButton = panel.querySelector(".policy-panel-close");
    if (trigger) {
      trigger.addEventListener("click", () => openPanelCard(panel));
    }
    if (closeButton) {
      closeButton.addEventListener("click", (event) => {
        event.stopPropagation();
        closePanel(panel);
      });
    }
  });

  if (backdrop) {
    backdrop.addEventListener("click", () => {
      if (openPanel) {
        closePanel(openPanel);
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && openPanel) {
      closePanel(openPanel);
    }
  });

  window.addEventListener("resize", () => {
    computeOpenSize();
    if (openPanel) {
      centerPanel(openPanel);
      return;
    }
    centerStack();
  });

  computeOpenSize();
  centerStack();
})();
