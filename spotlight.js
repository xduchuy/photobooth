const spotlightSection = document.querySelector(".spotlight");
const spotlightTrack = document.querySelector(".spotlight-track");
const spotlightViewport = document.querySelector(".spotlight-viewport");
const spotlightItems = spotlightTrack ? Array.from(spotlightTrack.children) : [];
const spotlightDots = document.querySelector(".spotlight-dots");
const prevBtn = document.querySelector(".spotlight-nav.prev");
const nextBtn = document.querySelector(".spotlight-nav.next");

if (spotlightSection && spotlightItems.length) {
  const swipeOnly = spotlightSection.classList.contains("spotlight--swipe");
  let activeIndex = spotlightItems.length > 1 ? 1 : 0;
  let autoTimer = null;
  let isPaused = false;
  let pointerStartX = 0;
  let pointerDelta = 0;
  let isDragging = false;

  function normalize(index) {
    const total = spotlightItems.length;
    return ((index % total) + total) % total;
  }

  function updateClasses() {
    const total = spotlightItems.length;
    const prevIndex = normalize(activeIndex - 1);
    const nextIndex = normalize(activeIndex + 1);

    spotlightItems.forEach((item, index) => {
      item.classList.remove("is-active", "is-prev", "is-next", "is-far");
      if (index === activeIndex) {
        item.classList.add("is-active");
      } else if (index === prevIndex) {
        item.classList.add("is-prev");
      } else if (index === nextIndex) {
        item.classList.add("is-next");
      } else {
        item.classList.add("is-far");
      }
    });

    if (spotlightDots) {
      const dots = spotlightDots.querySelectorAll(".spotlight-dot");
      dots.forEach((dot, index) => {
        dot.classList.toggle("is-active", index === activeIndex);
        dot.setAttribute("aria-selected", index === activeIndex ? "true" : "false");
      });
    }

    const activeItem = spotlightItems[activeIndex];
    const thumb = activeItem ? activeItem.querySelector(".spotlight-thumb") : null;
    if (thumb) {
      const styles = getComputedStyle(thumb);
      const theme = styles.getPropertyValue("--thumb").trim() || styles.backgroundImage;
      if (theme) {
        spotlightSection.style.setProperty("--spotlight-theme", theme);
      }
    }

    spotlightSection.dispatchEvent(
      new CustomEvent("spotlightchange", { detail: { activeIndex } })
    );
  }

  function goTo(index) {
    activeIndex = normalize(index);
    updateClasses();
  }

  function next() {
    goTo(activeIndex + 1);
  }

  function prev() {
    goTo(activeIndex - 1);
  }

  function buildDots() {
    if (!spotlightDots) return;
    spotlightDots.innerHTML = "";
    spotlightItems.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.className = "spotlight-dot";
      dot.type = "button";
      dot.setAttribute("aria-label", `Go to item ${index + 1}`);
      dot.setAttribute("role", "tab");
      if (swipeOnly) {
        dot.disabled = true;
      } else {
        dot.addEventListener("click", () => goTo(index));
      }
      spotlightDots.append(dot);
    });
  }

  function startAuto() {
    if (autoTimer || isPaused) return;
    autoTimer = window.setInterval(next, 3000);
  }

  function stopAuto() {
    if (autoTimer) {
      window.clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  function pause() {
    isPaused = true;
    stopAuto();
  }

  function resume() {
    isPaused = false;
    startAuto();
  }

  function handlePointerDown(event) {
    isDragging = true;
    pointerStartX = event.clientX;
    pointerDelta = 0;
    spotlightViewport.setPointerCapture(event.pointerId);
    pause();
  }

  function handlePointerMove(event) {
    if (!isDragging) return;
    pointerDelta = event.clientX - pointerStartX;
  }

  function handlePointerUp(event) {
    if (!isDragging) return;
    isDragging = false;
    spotlightViewport.releasePointerCapture(event.pointerId);
    const threshold = 40;
    if (pointerDelta > threshold) {
      prev();
    } else if (pointerDelta < -threshold) {
      next();
    }
    pointerDelta = 0;
    resume();
  }

  buildDots();
  updateClasses();

  if (!swipeOnly) {
    if (prevBtn) prevBtn.addEventListener("click", prev);
    if (nextBtn) nextBtn.addEventListener("click", next);
  } else {
    if (prevBtn) prevBtn.setAttribute("disabled", "true");
    if (nextBtn) nextBtn.setAttribute("disabled", "true");
  }

  spotlightSection.addEventListener("mouseenter", pause);
  spotlightSection.addEventListener("mouseleave", resume);
  spotlightSection.addEventListener("focusin", pause);
  spotlightSection.addEventListener("focusout", resume);

  if (spotlightViewport) {
    spotlightViewport.addEventListener("pointerdown", handlePointerDown);
    spotlightViewport.addEventListener("pointermove", handlePointerMove);
    spotlightViewport.addEventListener("pointerup", handlePointerUp);
    spotlightViewport.addEventListener("pointercancel", handlePointerUp);
  }

  startAuto();
}
