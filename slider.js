(() => {
  const slider = document.querySelector(".start-slider");
  if (!slider) return;

  const knob = slider.querySelector(".start-slider-knob");
  if (!knob) return;

  const target = slider.getAttribute("data-target");
  let maxOffset = 0;
  let currentOffset = 0;
  let startOffset = 0;
  let startX = 0;
  let isDragging = false;
  let isComplete = false;

  const updateMetrics = () => {
    const sliderRect = slider.getBoundingClientRect();
    const knobRect = knob.getBoundingClientRect();
    const styles = getComputedStyle(slider);
    const paddingLeft = parseFloat(styles.paddingLeft) || 0;
    const paddingRight = parseFloat(styles.paddingRight) || 0;
    maxOffset = sliderRect.width - knobRect.width - paddingLeft - paddingRight;
    if (maxOffset < 0) maxOffset = 0;
  };

  const setOffset = (value) => {
    currentOffset = Math.max(0, Math.min(value, maxOffset));
    slider.style.setProperty("--knob-x", `${currentOffset}px`);
    slider.style.setProperty("--slide", maxOffset ? (currentOffset / maxOffset).toFixed(3) : "0");
  };

  const reset = () => {
    slider.classList.remove("is-complete");
    setOffset(0);
    isComplete = false;
  };

  const complete = () => {
    if (isComplete) return;
    isComplete = true;
    slider.classList.add("is-complete");
    setOffset(maxOffset);
    if (target) {
      setTimeout(() => {
        window.location.href = target;
      }, 200);
    }
  };

  const onPointerDown = (event) => {
    if (isComplete) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.preventDefault();
    isDragging = true;
    slider.classList.add("is-dragging");
    updateMetrics();
    startX = event.clientX;
    startOffset = currentOffset;
    knob.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event) => {
    if (!isDragging) return;
    const delta = event.clientX - startX;
    setOffset(startOffset + delta);
  };

  const onPointerUp = (event) => {
    if (!isDragging) return;
    isDragging = false;
    slider.classList.remove("is-dragging");
    try {
      knob.releasePointerCapture(event.pointerId);
    } catch (error) {
      // Ignore missing pointer capture.
    }
    if (currentOffset >= maxOffset * 0.85) {
      complete();
    } else {
      reset();
    }
  };

  knob.addEventListener("pointerdown", onPointerDown);
  knob.addEventListener("pointermove", onPointerMove);
  knob.addEventListener("pointerup", onPointerUp);
  knob.addEventListener("pointercancel", onPointerUp);

  slider.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    complete();
  });

  window.addEventListener("resize", () => {
    updateMetrics();
    setOffset(currentOffset);
  });

  updateMetrics();
  setOffset(0);
})();
