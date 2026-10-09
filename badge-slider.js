(() => {
  const badge = document.querySelector(".badge--slider");
  if (!badge) return;

  const track = badge.querySelector(".badge-track");
  const text = badge.querySelector(".badge-text");
  const handle = badge.querySelector(".badge-handle");
  if (!track || !handle || !text) return;

  let maxWidth = 0;
  let currentWidth = 0;
  let startX = 0;
  let startWidth = 0;
  let isDragging = false;
  let suppressClick = false;
  let isOpen = false;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const updateMetrics = () => {
    const screenMax = Math.min(window.innerWidth * 0.9, 900);
    const textWidth = text.scrollWidth || 0;
    maxWidth = textWidth ? Math.min(textWidth, screenMax) : screenMax;
  };

  const setWidth = (value) => {
    currentWidth = clamp(value, 0, maxWidth);
    track.style.width = `${currentWidth}px`;
    const progress = maxWidth ? currentWidth / maxWidth : 0;
    badge.style.setProperty("--badge-progress", progress.toFixed(3));
  };

  const openBadge = () => {
    updateMetrics();
    isOpen = true;
    badge.classList.add("is-open");
    handle.setAttribute("aria-expanded", "true");
    setWidth(maxWidth);
  };

  const closeBadge = () => {
    isOpen = false;
    badge.classList.remove("is-open");
    handle.setAttribute("aria-expanded", "false");
    setWidth(0);
  };

  const toggleBadge = () => {
    if (isOpen) {
      closeBadge();
    } else {
      openBadge();
    }
  };

  const onPointerDown = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.preventDefault();
    suppressClick = false;
    isDragging = true;
    badge.classList.add("is-dragging");
    updateMetrics();
    startX = event.clientX;
    startWidth = currentWidth;
    handle.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event) => {
    if (!isDragging) return;
    const delta = event.clientX - startX;
    if (Math.abs(delta) > 3) suppressClick = true;
    setWidth(startWidth + delta);
  };

  const onPointerUp = (event) => {
    if (!isDragging) return;
    isDragging = false;
    badge.classList.remove("is-dragging");
    try {
      handle.releasePointerCapture(event.pointerId);
    } catch (error) {
      // Ignore missing pointer capture.
    }
    if (currentWidth >= maxWidth * 0.6) {
      openBadge();
    } else {
      closeBadge();
    }
  };

  handle.addEventListener("pointerdown", onPointerDown);
  handle.addEventListener("pointermove", onPointerMove);
  handle.addEventListener("pointerup", onPointerUp);
  handle.addEventListener("pointercancel", onPointerUp);

  handle.addEventListener("click", () => {
    if (suppressClick) {
      suppressClick = false;
      return;
    }
    toggleBadge();
  });

  handle.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    toggleBadge();
  });

  window.addEventListener("resize", () => {
    updateMetrics();
    if (isOpen) {
      setWidth(maxWidth);
    } else {
      setWidth(0);
    }
  });

  updateMetrics();
  closeBadge();
})();
