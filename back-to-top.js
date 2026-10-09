(() => {
  const button = document.querySelector(".back-to-top");
  if (!button) return;

  const threshold = 240;
  let ticking = false;

  const updateVisibility = () => {
    const shouldShow = window.scrollY > threshold;
    button.classList.toggle("is-visible", shouldShow);
    ticking = false;
  };

  updateVisibility();

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateVisibility);
    },
    { passive: true }
  );
})();
