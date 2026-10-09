const COUNT_KEY = "photoCount";
const MAX_PHOTOS = 1000;

const LEVEL_THRESHOLDS = [
  { level: 6, min: 1000 },
  { level: 5, min: 500 },
  { level: 4, min: 200 },
  { level: 3, min: 100 },
  { level: 2, min: 50 },
  { level: 1, min: 1 },
  { level: 0, min: 0 },
];

const countEl = document.getElementById("photoCount");
const progressTextEl = document.getElementById("photoProgressText");
const progressFillEl = document.getElementById("photoProgressFill");
const levelEl = document.getElementById("photoLevel");
const brandKitTrack = document.getElementById("brandKitTrack");
const brandKitNextBtn = document.getElementById("brandKitNext");
const brandKitPrevBtn = document.getElementById("brandKitPrev");
const previewPanels = brandKitTrack
  ? Array.from(brandKitTrack.querySelectorAll(".brand-kit__panel[data-target]"))
  : [];
const LEVEL_STEPS = [...LEVEL_THRESHOLDS].sort((a, b) => a.min - b.min);
function readPhotoCount() {
  try {
    const raw = localStorage.getItem(COUNT_KEY);
    const storedCount = Number.parseInt(raw, 10);
    if (Number.isFinite(storedCount) && storedCount >= 0) {
      return storedCount;
    }
  } catch (error) {
    // Ignore storage failures.
  }

  try {
    const rawList = localStorage.getItem("latestPhotos");
    const list = rawList ? JSON.parse(rawList) : [];
    if (Array.isArray(list)) return list.length;
  } catch (error) {
    // Ignore storage failures.
  }

  return 0;
}

function getLevelFromCount(count) {
  const entry = LEVEL_THRESHOLDS.find((item) => count >= item.min);
  return entry ? entry.level : 0;
}

function getLevelBounds(level) {
  const index = LEVEL_STEPS.findIndex((item) => item.level === level);
  const current = index >= 0 ? LEVEL_STEPS[index] : LEVEL_STEPS[0];
  const next = LEVEL_STEPS[index + 1];
  const min = current ? current.min : 0;
  const max = next ? next.min : MAX_PHOTOS;
  return { min, max };
}

function renderStats(count) {
  if (!countEl || !progressTextEl || !progressFillEl || !levelEl) return;
  const safeCount = Math.max(0, count);
  const level = getLevelFromCount(safeCount);
  const { min, max } = getLevelBounds(level);
  const range = Math.max(1, max - min);
  const isMaxLevel = level >= LEVEL_THRESHOLDS[0].level;
  const current = isMaxLevel ? range : Math.max(0, Math.min(safeCount, max) - min);
  const percent = Math.round((current / range) * 100);

  countEl.textContent = String(safeCount);
  progressTextEl.textContent = `${current}/${range}`;
  progressFillEl.style.width = `${percent}%`;
  levelEl.textContent = String(level);

  const currentPanel = brandKitTrack
    ? brandKitTrack.querySelector(".brand-kit__panel--current")
    : null;
  if (currentPanel) {
    currentPanel.dataset.level = String(level);
  }
}

function renderPreviewPanels(count) {
  if (!previewPanels.length) return;
  const safeCount = Math.max(0, count);
  previewPanels.forEach((panel) => {
    const target = Number.parseInt(panel.dataset.target || "0", 10);
    if (!Number.isFinite(target)) return;
    const clampedTarget = Math.min(MAX_PHOTOS, Math.max(0, target));
    const shownCount = Math.min(safeCount, clampedTarget);
    const percent =
      clampedTarget > 0 ? Math.round((shownCount / clampedTarget) * 100) : 0;
    const count = panel.querySelector(".brand-kit__count");
    const progressText = panel.querySelector(".brand-kit__progress-text");
    const progressFill = panel.querySelector(".brand-kit__progress-fill");
    const level = panel.querySelector(".brand-kit__level");

    if (count) count.textContent = String(shownCount);
    if (progressText) progressText.textContent = `${shownCount}/${clampedTarget}`;
    if (progressFill) progressFill.style.width = `${percent}%`;
    if (level && panel.dataset.level) level.textContent = panel.dataset.level;
  });
}

function filterPreviewPanels(count) {
  if (!previewPanels.length) return;
  const currentLevel = getLevelFromCount(count);
  let visibleCount = 0;

  previewPanels.forEach((panel) => {
    const levelValue = Number.parseInt(panel.dataset.level || "0", 10);
    const isAchieved = Number.isFinite(levelValue) && levelValue <= currentLevel;
    panel.hidden = isAchieved;
    if (!isAchieved) visibleCount += 1;
  });

  if (brandKitNextBtn) brandKitNextBtn.hidden = visibleCount < 2;
  if (brandKitPrevBtn) brandKitPrevBtn.hidden = visibleCount < 2;
  if (brandKitTrack && visibleCount < 2) {
    brandKitTrack.scrollTo({ left: 0, behavior: "smooth" });
  }
}

function updateBrandKitStats() {
  const count = readPhotoCount();
  renderStats(count);
  renderPreviewPanels(count);
  filterPreviewPanels(count);
}

updateBrandKitStats();

if (brandKitTrack && brandKitNextBtn) {
  const scrollByPanel = (direction) => {
    const panel = brandKitTrack.querySelector(".brand-kit__panel:not([hidden])");
    if (!panel) return;
    const styles = getComputedStyle(brandKitTrack);
    const gapValue = Number.parseFloat(styles.columnGap || styles.gap || "0");
    const gap = Number.isFinite(gapValue) ? gapValue : 0;
    const step = panel.offsetWidth + gap;
    brandKitTrack.scrollBy({ left: (step || 320) * direction, behavior: "smooth" });
  };

  brandKitNextBtn.addEventListener("click", () => scrollByPanel(1));
  if (brandKitPrevBtn) {
    brandKitPrevBtn.addEventListener("click", () => scrollByPanel(-1));
  }
}


window.addEventListener("storage", (event) => {
  if (event.key === COUNT_KEY || event.key === "latestPhotos") {
    updateBrandKitStats();
  }
});
