const frameGrid = document.getElementById("frameGrid");
const searchInput = document.getElementById("searchInput");
const layoutTabs = document.querySelectorAll(".layout-tab");
const FRAME_SELECTED_KEY = "selectedFrameId";

// Initialize frames from DOM
let frameElements = [];

function initFrames() {
  if (!frameGrid) return;
  // Get all existing card elements
  const cards = Array.from(frameGrid.querySelectorAll(".layout-card"));

  frameElements = cards.map((card, index) => {
    // Generate an ID if missing
    let id = card.dataset.frameId;
    if (!id) {
      // Use index as fallback ID for stability across reloads
      id = `frame-idx-${index}`;
      card.dataset.frameId = id;
    }

    // Get metadata
    const ratio = card.dataset.layout || "16-9";
    const img = card.querySelector("img");
    const name = img ? (img.alt || "Frame") : "Frame";

    // Attach click listener for selection
    card.addEventListener("click", () => setSelectedFrame(id));

    return {
      id,
      element: card,
      ratio,
      name: name.toLowerCase(),
      src: img ? img.src : ""
    };
  });

  // Inject Pinterest Buttons
  frameElements.forEach(item => {
    // Check if button exists to avoid duplicates on re-init
    if (item.element.querySelector(".pint-btn")) return;

    const btn = document.createElement("button");
    btn.className = "pint-btn";
    btn.textContent = "Dùng"; // "Use" or "Save"
    btn.type = "button";

    // Directly click to use
    btn.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent triggering card selection twice if not needed
      setSelectedFrame(item.id);
      // Navigate immediately
      window.location.href = "chup.html";
    });

    item.element.appendChild(btn);
  });

  // Restore previous selection
  const savedId = localStorage.getItem(FRAME_SELECTED_KEY);
  if (savedId) {
    // Only visual update, don't trigger navigation
    frameElements.forEach(item => {
      item.element.classList.toggle("is-active-choice", item.id === savedId);
    });
  } else if (frameElements.length > 0) {
    // Optional: Select first by default visually
  }
}

// Helper to count photo slots in an SVG
function detectSlotsFromSrc(imgElement) {
  if (!imgElement) return 0;

  // HEURISTIC 1: Check if it's one of our known internal frames
  const src = imgElement.src;

  // frame5.svg = Film Strip (3 slots)
  if (src.includes("frame5.svg")) return 3;
  // frame8.svg = Neon (2 slots)
  if (src.includes("frame8.svg")) return 2;
  // frame10.svg = Mono (2 slots)
  if (src.includes("frame10.svg")) return 2;
  // fr2.png usually implies 2 slots, etc. but let's default to parsing if possible
  // For PNGs we can't parse, so we might need manual mapping or data attributes

  // HEURISTIC 2: Use data attribute on the card if present (Manual override)
  const card = imgElement.closest('.layout-card');
  if (card && card.dataset.slots) {
    return parseInt(card.dataset.slots, 10);
  }

  // Default fallback
  return 1;
}

function setSelectedFrame(id) {
  localStorage.setItem(FRAME_SELECTED_KEY, id);

  // Visual update
  frameElements.forEach(item => {
    const isSelected = item.id === id;
    item.element.classList.toggle("is-selected", isSelected);
    if (isSelected) {
      // Scroll into view if needed? Maybe too jarring
      // item.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  // Data persistence for Capture Page
  const builtin = (window.BUILTIN_FRAMES || []).find(f => f && f.id === id);
  if (builtin) {
    const frameConfig = {
      id: builtin.id,
      name: builtin.name,
      src: builtin.src,
      ratio: builtin.ratio,
      slots: builtin.slots
    };
    localStorage.setItem("currentFrameConfig", JSON.stringify(frameConfig));
  } else {
    const selected = frameElements.find(f => f.id === id);
    if (selected) {
      const frameConfig = {
        id: selected.id,
        src: selected.src,
        ratio: selected.ratio,
        slots: []
      };
      localStorage.setItem("currentFrameConfig", JSON.stringify(frameConfig));
    }
  }
}
let activeQuery = "";
let activeFilter = "all";

function filterFrames() {
  let visibleCount = 0;

  frameElements.forEach(item => {
    // Filter by Tab
    const matchFilter = activeFilter === "all" || item.ratio === activeFilter;

    // Filter by Search
    const matchSearch = !activeQuery || item.name.includes(activeQuery);

    const isVisible = matchFilter && matchSearch;
    item.element.classList.toggle("is-hidden", !isVisible);

    if (isVisible) visibleCount++;
  });

  // Handle empty state
  // Check if we have an existing empty message provided by CSS/HTML or need to make one
  let emptyMsg = document.querySelector(".frame-empty");
  if (visibleCount === 0) {
    if (!emptyMsg) {
      emptyMsg = document.createElement("p");
      emptyMsg.className = "frame-empty";
      emptyMsg.textContent = "Không có khung phù hợp.";
      frameGrid.append(emptyMsg);
    }
    emptyMsg.hidden = false;
    emptyMsg.style.display = "block";
  } else {
    if (emptyMsg) {
      emptyMsg.hidden = true;
      emptyMsg.style.display = "none";
    }
  }
}

// Search Logic
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    activeQuery = e.target.value.toLowerCase().trim();
    filterFrames();
  });
}

// Tab Logic
if (layoutTabs.length) {
  layoutTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Update UI
      layoutTabs.forEach(t => t.classList.remove("is-active"));
      tab.classList.add("is-active");

      // Update Filter
      activeFilter = tab.dataset.filter || "all";
      filterFrames();
      tab.blur();
    });
  });
}

// Boot
initFrames();

