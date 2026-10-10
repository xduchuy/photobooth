const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const stage = document.querySelector(".stage");
const gallery = document.getElementById("gallery");
const statusEl = document.getElementById("status");
const countdownEl = document.getElementById("countdown");

const FRAME_STORE_KEY = "frameLibrary";
const FRAME_SELECTED_KEY = "selectedFrameId";
const PHOTO_COUNT_KEY = "photoCount";

const defaultFrameConfig = {
  src: "fr1.png",
  ratio: "9-16",
  slots: [
    { x: 132, y: 58, width: 169, height: 124 },
    { x: 133, y: 200, width: 169, height: 121 },
    { x: 134, y: 339, width: 166, height: 122 },
  ],
};

const BUILTIN_FRAMES = window.BUILTIN_FRAMES || [
  {
    id: "fr1",
    name: "Frame 01",
    src: defaultFrameConfig.src,
    ratio: defaultFrameConfig.ratio,
    slots: defaultFrameConfig.slots,
    createdAt: 0,
  },
  {
    id: "fr2",
    name: "Frame 02",
    src: "fr2.png",
    ratio: "9-16",
    slots: [{ x: 16, y: 44, width: 187, height: 258 }],
    createdAt: 0,
  },
  {
    id: "fr3",
    name: "Frame 03",
    src: "fr3.png",
    ratio: "9-16",
    slots: [
      { x: 36, y: 71, width: 635, height: 360 },
      { x: 36, y: 476, width: 635, height: 360 },
      { x: 36, y: 881, width: 635, height: 360 },
      { x: 36, y: 1286, width: 635, height: 360 },
    ],
    createdAt: 0,
  },
  {
    id: "fr4",
    name: "Frame 04",
    src: "fr4.png",
    ratio: "9-16",
    slots: [
      { x: 36, y: 71, width: 635, height: 360 },
      { x: 36, y: 476, width: 635, height: 360 },
      { x: 36, y: 881, width: 635, height: 360 },
      { x: 36, y: 1286, width: 635, height: 360 },
    ],
    createdAt: 0,
  },
  {
    id: "frame5",
    name: "Film Strip",
    src: "frame5.svg",
    ratio: "9-16",
    slots: [
      { x: 40, y: 40, width: 460, height: 280 },
      { x: 40, y: 340, width: 460, height: 280 },
      { x: 40, y: 640, width: 460, height: 280 }
    ],
    createdAt: 0,
  },
  {
    id: "frame6",
    name: "Summer",
    src: "frame6.svg",
    ratio: "3-4",
    slots: [
      { x: 40, y: 40, width: 460, height: 560 }
    ],
    createdAt: 0,
  },
  {
    id: "frame7",
    name: "Memories",
    src: "frame7.svg",
    ratio: "1-1",
    slots: [
      { x: 50, y: 50, width: 480, height: 380 }
    ],
    createdAt: 0,
  },
  {
    id: "frame8",
    name: "Neon Cyberpunk",
    src: "frame8.svg",
    ratio: "9-16",
    slots: [
      { x: 30, y: 30, width: 480, height: 350 },
      { x: 30, y: 400, width: 480, height: 350 }
    ],
    createdAt: 0,
  },
  {
    id: "frame9",
    name: "Floral Spring",
    src: "frame9.svg",
    ratio: "9-16",
    slots: [
      { x: 60, y: 60, width: 420, height: 480 }
    ],
    createdAt: 0,
  },
  {
    id: "frame10",
    name: "Minimal Mono",
    src: "frame10.svg",
    ratio: "16-9",
    slots: [
      { x: 30, y: 50, width: 230, height: 350 },
      { x: 300, y: 50, width: 230, height: 350 }
    ],
    createdAt: 0,
  },
  {
    id: "frame11",
    name: "Layout 11",
    src: "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20width%3D%27520%27%20height%3D%27760%27%20viewBox%3D%270%200%20520%20760%27%3E%3Cdefs%3E%3ClinearGradient%20id%3D%27g11%27%20x1%3D%270%27%20y1%3D%271%27%20x2%3D%271%27%20y2%3D%270%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23fbe6c7%27/%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23fbd7df%27/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width%3D%27520%27%20height%3D%27760%27%20fill%3D%27url%28%23g11%29%27/%3E%3Ccircle%20cx%3D%27220%27%20cy%3D%27220%27%20r%3D%27110%27%20fill%3D%27rgba%28255%2C255%2C255%2C0.55%29%27/%3E%3Ctext%20x%3D%2740%27%20y%3D%27700%27%20font-family%3D%27Space%20Grotesk%2C%20Arial%27%20font-size%3D%2732%27%20fill%3D%27%233a2a2a%27%3ELayout%2011%3C/text%3E%3C/svg%3E",
    ratio: "9-16",
    slots: [
      { x: 110, y: 110, width: 220, height: 220 }
    ],
    createdAt: 0,
  },
  {
    id: "frame12",
    name: "Layout 12",
    src: "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20width%3D%27580%27%20height%3D%27520%27%20viewBox%3D%270%200%20580%20520%27%3E%3Cdefs%3E%3ClinearGradient%20id%3D%27g12%27%20x1%3D%271%27%20y1%3D%271%27%20x2%3D%270%27%20y2%3D%270%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23e6d7ff%27/%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23d7e9ff%27/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width%3D%27580%27%20height%3D%27520%27%20fill%3D%27url%28%23g12%29%27/%3E%3Crect%20x%3D%2790%27%20y%3D%2790%27%20width%3D%27400%27%20height%3D%27200%27%20rx%3D%2730%27%20fill%3D%27rgba%28255%2C255%2C255%2C0.6%29%27/%3E%3Ctext%20x%3D%2740%27%20y%3D%27470%27%20font-family%3D%27Space%20Grotesk%2C%20Arial%27%20font-size%3D%2732%27%20fill%3D%27%233a2a2a%27%3ELayout%2012%3C/text%3E%3C/svg%3E",
    ratio: "16-9",
    slots: [
      { x: 90, y: 90, width: 400, height: 200 }
    ],
    createdAt: 0,
  },
  // Frame 13: Pixel Game
  {
    id: "frame13", name: "Pixel Game", src: "frame13.svg", ratio: "1-1",
    slots: [{ x: 100, y: 100, width: 400, height: 300 }]
  },
  // Frame 14: Dreamy Clouds
  {
    id: "frame14", name: "Dreamy Clouds", src: "frame14.svg", ratio: "9-16",
    slots: [
      { x: 60, y: 140, width: 420, height: 320 },
      { x: 60, y: 520, width: 420, height: 320 }
    ]
  },
  // Frame 15: Cinematic
  {
    id: "frame15", name: "Cinematic", src: "frame15.svg", ratio: "16-9",
    slots: [{ x: 0, y: 70, width: 960, height: 400 }]
  },
  // Frame 16: Magazine Cover
  {
    id: "frame16", name: "Vogue Cover", src: "frame16.svg", ratio: "9-16",
    slots: [{ x: 50, y: 150, width: 440, height: 760 }]
  },
  // Frame 17: Wanted Poster
  {
    id: "frame17", name: "Wanted Poster", src: "frame17.svg", ratio: "9-16",
    slots: [{ x: 90, y: 220, width: 360, height: 360 }]
  },
  // Frame 18: Digital Pet
  {
    id: "frame18", name: "Digital Pet", src: "frame18.svg", ratio: "1-1",
    slots: [{ x: 180, y: 180, width: 240, height: 240 }]
  },
  // Frame 19: Album Art
  {
    id: "frame19", name: "Album Art", src: "frame19.svg", ratio: "1-1",
    slots: [{ x: 25, y: 25, width: 550, height: 550 }]
  },
  // Frame 20: Social Live
  {
    id: "frame20", name: "Social Live", src: "frame20.svg", ratio: "9-16",
    slots: [{ x: 0, y: 0, width: 540, height: 960 }] // Full screen slot
  },
  // Frame 21: Scrapbook
  {
    id: "frame21", name: "Scrapbook", src: "frame21.svg", ratio: "3-4",
    slots: [{ x: 50, y: 50, width: 440, height: 620 }]
  },
  // Frame 22: Rainy Mood
  {
    id: "frame22", name: "Rainy Mood", src: "frame22.svg", ratio: "9-16",
    slots: [{ x: 20, y: 20, width: 500, height: 920 }]
  },
  // Frame 23: Locket
  {
    id: "frame23", name: "Locket", src: "frame23.svg", ratio: "1-1",
    slots: [{ x: 100, y: 100, width: 400, height: 400 }]
  },
  // Frame 24: Grid 4x
  {
    id: "frame24", name: "Grid 4x", src: "frame24.svg", ratio: "1-1",
    slots: [
      { x: 10, y: 10, width: 285, height: 285 },
      { x: 305, y: 10, width: 285, height: 285 },
      { x: 10, y: 305, width: 285, height: 285 },
      { x: 305, y: 305, width: 285, height: 285 }
    ]
  },
  // Frame 25: Classic Strip 4
  {
    id: "frame25", name: "Classic Strip 4", src: "frame25.svg", ratio: "9-16",
    slots: [
      { x: 40, y: 40, width: 460, height: 200 },
      { x: 40, y: 260, width: 460, height: 200 },
      { x: 40, y: 480, width: 460, height: 200 },
      { x: 40, y: 700, width: 460, height: 200 }
    ]
  },
  // Frame 26: Blob
  {
    id: "frame26", name: "Blob", src: "frame26.svg", ratio: "1-1",
    slots: [{ x: 50, y: 50, width: 500, height: 500 }]
  },
  // Frame 27: VHS Glitch
  {
    id: "frame27", name: "VHS Glitch", src: "frame27.svg", ratio: "16-9",
    slots: [{ x: 50, y: 50, width: 860, height: 440 }]
  },
  // Frame 28: Daily News
  {
    id: "frame28", name: "Daily News", src: "frame28.svg", ratio: "9-16",
    slots: [{ x: 30, y: 200, width: 480, height: 400 }]
  },
  // Frame 29: Winter
  {
    id: "frame29", name: "Winter", src: "frame29.svg", ratio: "3-4",
    slots: [{ x: 40, y: 40, width: 460, height: 640 }]
  },
  // Frame 30: Spooky
  {
    id: "frame30", name: "Spooky", src: "frame30.svg", ratio: "1-1",
    slots: [{ x: 80, y: 80, width: 440, height: 440 }]
  },
  // Frame 31: Meow
  {
    id: "frame31", name: "Meow", src: "frame31.svg", ratio: "9-16",
    slots: [{ x: 50, y: 150, width: 440, height: 600 }]
  },
  // Frame 32: HBD
  {
    id: "frame32", name: "HBD", src: "frame32.svg", ratio: "1-1",
    slots: [{ x: 50, y: 50, width: 500, height: 500 }]
  },
  // Frame 33: Western Wide
  {
    id: "frame33", name: "Western Wide", src: "frame33.svg", ratio: "16-9",
    slots: [{ x: 300, y: 100, width: 360, height: 340 }]
  },
  // Frame 34: Breaking News
  {
    id: "frame34", name: "News TV", src: "frame34.svg", ratio: "16-9",
    slots: [{ x: 0, y: 0, width: 960, height: 540 }]
  },
  // Frame 35: Museum
  {
    id: "frame35", name: "Museum", src: "frame35.svg", ratio: "3-4",
    slots: [{ x: 80, y: 80, width: 380, height: 480 }]
  },
  // Frame 36: Retro OS
  {
    id: "frame36", name: "Retro OS", src: "frame36.svg", ratio: "9-16",
    slots: [{ x: 20, y: 60, width: 500, height: 880 }]
  },
  // Frame 37: Console
  {
    id: "frame37", name: "Console", src: "frame37.svg", ratio: "16-9",
    slots: [{ x: 100, y: 40, width: 760, height: 460 }]
  },
  // Frame 38: CCTV
  {
    id: "frame38", name: "CCTV", src: "frame38.svg", ratio: "16-9",
    slots: [{ x: 0, y: 0, width: 960, height: 540 }]
  },
  // Frame 39: Porthole
  {
    id: "frame39", name: "Porthole", src: "frame39.svg", ratio: "1-1",
    slots: [{ x: 100, y: 100, width: 400, height: 400 }]
  },
  // Frame 40: Vinyl Record
  {
    id: "frame40", name: "Vinyl", src: "frame40.svg", ratio: "1-1",
    slots: [{ x: 50, y: 50, width: 500, height: 500 }]
  },
  // Frame 41: Messenger
  {
    id: "frame41", name: "Messenger", src: "frame41.svg", ratio: "9-16",
    slots: [{ x: 30, y: 120, width: 480, height: 680 }]
  },
  // Frame 42: Tarot
  {
    id: "frame42", name: "Tarot", src: "frame42.svg", ratio: "9-16",
    slots: [{ x: 90, y: 150, width: 360, height: 600 }]
  },
  // Frame 43: Stamp
  {
    id: "frame43", name: "Stamp", src: "frame43.svg", ratio: "1-1",
    slots: [{ x: 80, y: 80, width: 440, height: 440 }]
  },
  // Frame 44: Phone UI
  {
    id: "frame44", name: "Phone UI", src: "frame44.svg", ratio: "9-16",
    slots: [{ x: 0, y: 0, width: 540, height: 960 }]
  },
  // Frame 45: Anime
  {
    id: "frame45", name: "Anime", src: "frame45.svg", ratio: "16-9",
    slots: [{ x: 50, y: 50, width: 860, height: 440 }]
  },
  // Frame 46: Comic
  {
    id: "frame46", name: "Comic", src: "frame46.svg", ratio: "3-4",
    slots: [
      { x: 20, y: 20, width: 240, height: 300 },
      { x: 280, y: 20, width: 240, height: 300 },
      { x: 20, y: 340, width: 500, height: 360 }
    ]
  },
  // Frame 47: Sketch
  {
    id: "frame47", name: "Sketch", src: "frame47.svg", ratio: "1-1",
    slots: [{ x: 80, y: 50, width: 480, height: 500 }]
  },
  // Frame 48: Neon Bar
  {
    id: "frame48", name: "Neon Bar", src: "frame48.svg", ratio: "3-4",
    slots: [{ x: 40, y: 150, width: 460, height: 530 }]
  },
  // Frame 49: Wanted Cyber
  {
    id: "frame49", name: "Cyber Wanted", src: "frame49.svg", ratio: "9-16",
    slots: [{ x: 40, y: 200, width: 460, height: 500 }]
  },
  // Frame 50: Playing Card
  {
    id: "frame50", name: "Card", src: "frame50.svg", ratio: "3-4",
    slots: [{ x: 80, y: 100, width: 380, height: 520 }]
  },
  // Frame 51: Ticket
  {
    id: "frame51", name: "Ticket", src: "frame51.svg", ratio: "16-9",
    slots: [{ x: 250, y: 40, width: 660, height: 460 }]
  },
  // Frame 52: Browser
  {
    id: "frame52", name: "Browser", src: "frame52.svg", ratio: "4-3",
    slots: [{ x: 0, y: 80, width: 960, height: 640 }]
  },
  // Frame 53: Billboard
  {
    id: "frame53", name: "Billboard", src: "frame53.svg", ratio: "1-1",
    slots: [{ x: 50, y: 50, width: 500, height: 300 }]
  },
  // Frame 54: Fish Eye
  {
    id: "frame54", name: "Fish Eye", src: "frame54.svg", ratio: "1-1",
    slots: [{ x: 0, y: 0, width: 600, height: 600 }]
  },
  // Frame 55: Receipt
  {
    id: "frame55", name: "Receipt", src: "frame55.svg", ratio: "9-16",
    slots: [{ x: 40, y: 200, width: 460, height: 460 }]
  },
  // Frame 56: Ben 10 Inspired
  {
    id: "frame56", name: "Alien Hero", src: "frame56.svg", ratio: "1-1",
    slots: [{ x: 100, y: 100, width: 400, height: 400 }]
  },
  // Frame 57: Adventure Time
  {
    id: "frame57", name: "Adventure", src: "frame57.svg", ratio: "9-16",
    slots: [{ x: 40, y: 40, width: 460, height: 500 }]
  },
  // Frame 58: Tom & Jerry
  {
    id: "frame58", name: "Chase", src: "frame58.svg", ratio: "3-4",
    slots: [{ x: 50, y: 50, width: 440, height: 440 }]
  },
  // Frame 59: Mickey
  {
    id: "frame59", name: "Magic Mouse", src: "frame59.svg", ratio: "1-1",
    slots: [{ x: 100, y: 50, width: 400, height: 400 }]
  },
  // Frame 60: Pikachu
  {
    id: "frame60", name: "Pika", src: "frame60.svg", ratio: "9-16",
    slots: [{ x: 40, y: 200, width: 460, height: 560 }]
  },
  // Frame 61: SpongeBob
  {
    id: "frame61", name: "Sponge", src: "frame61.svg", ratio: "1-1",
    slots: [{ x: 50, y: 50, width: 500, height: 500 }]
  },
  // Frame 62: Doraemon
  {
    id: "frame62", name: "Robot Cat", src: "frame62.svg", ratio: "1-1",
    slots: [{ x: 100, y: 100, width: 400, height: 400 }]
  },
  // Frame 63: Powerpuff
  {
    id: "frame63", name: "Girl Power", src: "frame63.svg", ratio: "9-16",
    slots: [{ x: 50, y: 180, width: 440, height: 600 }]
  },
  // Frame 64: Spiderman
  {
    id: "frame64", name: "Spider", src: "frame64.svg", ratio: "9-16",
    slots: [{ x: 40, y: 40, width: 460, height: 880 }]
  },
  // Frame 65: Hello Kitty
  {
    id: "frame65", name: "Kitty", src: "frame65.svg", ratio: "1-1",
    slots: [{ x: 100, y: 150, width: 400, height: 350 }]
  },
  {
    id: "polaroid",
    name: "Polaroid",
    src: "polaroid-frame.svg",
    ratio: "1-1",
    slots: [{ x: 140, y: 80, width: 520, height: 520 }],
    createdAt: 0,
  },
];

let frameConfig = { ...defaultFrameConfig };
let frameImage = new Image();
frameImage.decoding = "async";
let frameReady = Promise.resolve();
let studioFrames = [];
let studioFrameMap = new Map();

function loadFrameAsset(src) {
  frameImage = new Image();
  frameImage.decoding = "async";
  frameReady = new Promise((resolve, reject) => {
    frameImage.onload = () => {
      if (stage) {
        const w = frameImage.naturalWidth || frameImage.width;
        const h = frameImage.naturalHeight || frameImage.height;
        if (w && h) {
          stage.style.setProperty("--frame-aspect", `${w} / ${h}`);
        }
      }
      resolve();
    };
    frameImage.onerror = () => reject(new Error("frame-load-failed"));
  });
  frameImage.src = src;
}

function loadFrameConfigFromStorage() {
  const selectedId = localStorage.getItem(FRAME_SELECTED_KEY) || "";

  // 1. Try to find in BUILTIN_FRAMES by selectedId
  let matched = BUILTIN_FRAMES.find((frame) => frame && frame.id === selectedId);

  // Handle legacy frame-idx-0 .. frame-idx-3 if present in localStorage
  if (!matched && selectedId && selectedId.startsWith("frame-idx-")) {
    const idx = parseInt(selectedId.replace("frame-idx-", ""), 10);
    const legacyIds = ["fr1", "fr2", "fr3", "fr4"];
    if (idx >= 0 && idx < legacyIds.length) {
      matched = BUILTIN_FRAMES.find((frame) => frame && frame.id === legacyIds[idx]);
    }
  }

  // 2. Check "currentFrameConfig" passed from Studio/layout
  if (!matched) {
    try {
      const currentRaw = localStorage.getItem("currentFrameConfig");
      if (currentRaw) {
        const current = JSON.parse(currentRaw);
        if (current && current.id) {
          matched = BUILTIN_FRAMES.find((f) => f && f.id === current.id);
        }
        if (!matched && current && current.src && Array.isArray(current.slots) && current.slots.length) {
          frameConfig = {
            id: current.id || "custom",
            name: current.name || "Khung tùy chọn",
            src: current.src,
            ratio: current.ratio || "9-16",
            slots: current.slots
          };
          return;
        }
      }
    } catch (e) {
      // ignore parse errors
    }
  }

  // 3. Check custom frames in FRAME_STORE_KEY
  if (!matched) {
    try {
      const stored = JSON.parse(localStorage.getItem(FRAME_STORE_KEY) || "[]");
      const matchInStore = stored.find((f) => f && f.id === selectedId);
      if (matchInStore && matchInStore.src && Array.isArray(matchInStore.slots) && matchInStore.slots.length) {
        frameConfig = {
          id: matchInStore.id,
          name: matchInStore.name || "Khung",
          src: matchInStore.src,
          slots: matchInStore.slots,
          ratio: matchInStore.ratio || "9-16"
        };
        return;
      }
    } catch (e) {
      // ignore
    }
  }

  // 4. If matched builtin frame found
  if (matched && matched.src && Array.isArray(matched.slots) && matched.slots.length) {
    frameConfig = {
      id: matched.id,
      name: matched.name,
      src: matched.src,
      slots: matched.slots,
      ratio: matched.ratio || "9-16"
    };
    return;
  }

  // 5. Fallback if frame not found or invalid
  frameConfig = { ...defaultFrameConfig, id: "fr1", name: "Frame 01" };
  if (selectedId && selectedId !== "fr1") {
    setStatus("Khung đã chọn không khả dụng, đã chuyển về khung mặc định.", "warning");
  }
}

loadFrameConfigFromStorage();
loadFrameAsset(frameConfig.src);

const shutterBtn = document.getElementById("shutterBtn");
const switchBtn = document.getElementById("switchBtn");
const flipBtn = document.getElementById("flipBtn");
const downloadBtn = document.getElementById("downloadBtn");
const retakeBtn = document.getElementById("retakeBtn");
const timerSelect = document.getElementById("timerSelect");
const filterSelect = document.getElementById("filterSelect");
const frameSelect = document.getElementById("frameSelect");
const frameSuggest = document.querySelector(".frame-suggest");
const frameSuggestTrack = frameSuggest ? frameSuggest.querySelector(".spotlight-track") : null;
let frameSuggestButtons = [];
const frameSuggestPreview = document.getElementById("frameSuggestPreview");
const frameSuggestTitle = document.getElementById("frameSuggestTitle");
const frameSuggestDesc = document.getElementById("frameSuggestDesc");
const frameSuggestMeta = document.getElementById("frameSuggestMeta");
const ratioInputs = document.querySelectorAll('input[name="ratio"]');
const stripGrid = document.getElementById("stripGrid");
const saveStripBtn = document.getElementById("saveStripBtn");
const resetStripBtn = document.getElementById("resetStripBtn");
const startBtn = document.getElementById("startBtn");
const captureRoot = document.getElementById("capture");
const drawer = document.getElementById("captureDrawer");
const drawerToggle = document.getElementById("drawerToggle");
const drawerBackdrop = document.getElementById("drawerBackdrop");
const drawerCloseBtn = document.querySelector(".drawer-close");

let stripSlots = [];

const filterMap = {
  clean: "none",
  noir: "grayscale(1) contrast(1.2)",
  soft: "brightness(1.05) saturate(0.9) blur(0.5px)",
  neon: "saturate(1.6) contrast(1.2) hue-rotate(15deg)",
  vintage: "sepia(0.5) contrast(1.1) saturate(0.85)",
};

let stream = null;
let facingMode = "user";
let isFlipped = false;
let latestDataUrl = "";
let isCapturing = false;
let mockOnly = false;
let stripShots = [];
let stripLimit = frameConfig.slots.length || 1;
let previewRatio = stage ? stage.dataset.ratio : "16-9";
let isFramePreview = false;
let latestCompositeUrl = "";

function showStudioSection() {
  document.body.classList.add("show-studio");
}

function bumpPhotoCount() {
  try {
    const raw = localStorage.getItem(PHOTO_COUNT_KEY);
    const current = Number.parseInt(raw, 10);
    const next = Number.isFinite(current) ? current + 1 : 1;
    localStorage.setItem(PHOTO_COUNT_KEY, String(next));
  } catch (error) {
    // Ignore storage failures (private mode, quota, etc.).
  }
}

async function storeLatestShot(dataUrl) {
  if (!dataUrl) return;
  if (window.PhotoStorage) {
    await window.PhotoStorage.savePhoto(dataUrl);
  } else {
    try {
      localStorage.setItem("latestPhoto", dataUrl);
      const raw = localStorage.getItem("latestPhotos");
      const list = raw ? JSON.parse(raw) : [];
      const next = [dataUrl, ...list.filter((item) => item !== dataUrl)].slice(0, 10);
      localStorage.setItem("latestPhotos", JSON.stringify(next));
    } catch (error) {
      console.warn("Storage quota exceeded or storage blocked", error);
    }
  }
  bumpPhotoCount();
}

function setStatus(message, tone = "") {
  statusEl.textContent = message;
  statusEl.dataset.tone = tone;
}

function setCaptured(active, options = {}) {
  const { showStill = active && (!stream || mockOnly || isFramePreview), enableRetake = active } = options;
  stage.classList.toggle("captured", showStill);
  const canDownload = active && stripShots.length >= stripLimit;
  downloadBtn.disabled = !canDownload;
  retakeBtn.disabled = !enableRetake;
}

function setGalleryCentered(centered) {
  if (!captureRoot) return;
  captureRoot.classList.toggle("is-gallery-centered", centered);
}

function applyFlipState() {
  if (stage) {
    stage.classList.toggle("is-flipped", isFlipped);
  }
  if (flipBtn) {
    flipBtn.setAttribute("aria-pressed", isFlipped ? "true" : "false");
  }
}

function updateStripLabels() {
  const title = document.querySelector(".strip-title h2");
  const desc = document.querySelector(".strip-title p");
  if (title) title.textContent = `Khung ${stripLimit} ảnh`;
  if (desc) {
    desc.textContent = `Chụp đủ ${stripLimit} ảnh để hiện nút lưu và chụp lại từ đầu.`;
  }
}

function buildStripGrid() {
  if (!stripGrid) return;
  stripGrid.innerHTML = "";
  stripSlots = [];
  for (let i = 0; i < stripLimit; i++) {
    const slot = document.createElement("div");
    slot.className = "strip-slot";
    const label = document.createElement("span");
    label.className = "slot-label";
    label.textContent = String(i + 1);
    slot.append(label);
    stripGrid.append(slot);
    stripSlots.push(slot);
  }
  updateStripLabels();
}

function updateStripUI() {
  if (!stripSlots.length) return;

  stripSlots.forEach((slot, index) => {
    const dataUrl = stripShots[index];
    slot.innerHTML = "";

    if (!dataUrl) {
      const label = document.createElement("span");
      label.className = "slot-label";
      label.textContent = String(index + 1);
      slot.append(label);
      return;
    }

    const img = new Image();
    img.src = dataUrl;
    img.alt = `Ảnh ${index + 1}`;
    slot.append(img);
  });

  const ready = stripShots.length === stripLimit;
  if (saveStripBtn) saveStripBtn.disabled = !ready;
  if (resetStripBtn) resetStripBtn.disabled = stripShots.length === 0;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function startCamera() {
  setStatus("Đang bật camera...");

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    let msg = "Trình duyệt không hỗ trợ camera.";
    if (window.isSecureContext === false) {
      msg = "Camera yêu cầu kết nối an toàn (HTTPS hoặc localhost).";
    }
    setStatus(msg, "error");
    showMock(msg);
    return;
  }

  stopCamera();

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode },
      audio: false,
    });
    video.srcObject = stream;
    await video.play();
    showCameraPreview();
    mockOnly = false;
    setCaptured(false);
    setStatus("Camera sẵn sàng.");
  } catch (error) {
    let errorMsg = "Không thể mở camera.";
    if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
      errorMsg = "Quyền camera bị từ chối. Hãy cho phép camera trong cài đặt trình duyệt.";
    } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
      errorMsg = "Không tìm thấy thiết bị camera trên máy.";
    } else if (error.name === "NotReadableError" || error.name === "TrackStartError") {
      errorMsg = "Camera đang bị ứng dụng khác sử dụng hoặc có xung đột phần cứng.";
    } else if (error.name === "OverconstrainedError") {
      errorMsg = "Chế độ camera được yêu cầu không được hỗ trợ.";
    } else {
      errorMsg = error.message || "Hãy kiểm tra quyền truy cập camera.";
    }
    showMock(errorMsg);
  }
}

function stopCamera() {
  if (!stream) return;
  stream.getTracks().forEach((track) => track.stop());
  stream = null;
}

function showMock(reason = "") {
  const ctx = canvas.getContext("2d");
  canvas.width = 1280;
  canvas.height = 720;
  drawMock(ctx, canvas.width, canvas.height, reason);
  latestDataUrl = canvas.toDataURL("image/png");
  mockOnly = true;
  setCaptured(true, { showStill: true });
  if (reason) {
    setStatus(`${reason} — Đang ở chế độ mô phỏng (Demo).`, "error");
  } else {
    setStatus("Đang ở chế độ mô phỏng (Demo).");
  }
}

function drawMock(ctx, width, height, reason = "") {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#202731");
  gradient.addColorStop(1, "#3a2c1d");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
  for (let i = 0; i < 6; i++) {
    ctx.fillRect(0, i * 120, width, 2);
  }

  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  ctx.font = "700 56px Space Grotesk";
  ctx.fillText("PHOTObooth", 64, 140);
  ctx.fillStyle = "#ffbb66";
  ctx.font = "600 28px Space Grotesk";
  ctx.fillText("CHẾ ĐỘ MÔ PHỎNG (DEMO)", 64, 200);
  if (reason) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
    ctx.font = "400 20px Space Grotesk";
    ctx.fillText(reason.slice(0, 70), 64, 240);
  }
}

function showFramePreview() {
  isFramePreview = true;
  if (stage) stage.dataset.ratio = "frame";
}

function showCameraPreview() {
  isFramePreview = false;
  if (stage) stage.dataset.ratio = previewRatio;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawImageCover(ctx, img, x, y, width, height) {
  const imgRatio = img.width / img.height;
  const targetRatio = width / height;
  let sx = 0;
  let sy = 0;
  let sw = img.width;
  let sh = img.height;

  if (imgRatio > targetRatio) {
    sw = img.height * targetRatio;
    sx = (img.width - sw) / 2;
  } else {
    sh = img.width / targetRatio;
    sy = (img.height - sh) / 2;
  }

  ctx.drawImage(img, sx, sy, sw, sh, x, y, width, height);
}

function resolveSlot(slot, frameWidth, frameHeight) {
  if (!slot) return null;
  const x = Number(slot.x);
  const y = Number(slot.y);
  const width = Number(slot.width);
  const height = Number(slot.height);
  if (![x, y, width, height].every(Number.isFinite)) return null;

  const isPercent = x >= 0 && x <= 1 && y >= 0 && y <= 1 && width > 0 && width <= 1 && height > 0 && height <= 1;
  if (!isPercent) return { x, y, width, height };
  return {
    x: x * frameWidth,
    y: y * frameHeight,
    width: width * frameWidth,
    height: height * frameHeight,
  };
}



function applyBlackSlotMask(frameCtx, width, height, slots) {
  if (!slots || !slots.length) return;
  const imageData = frameCtx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const threshold = 18;
  const alphaThreshold = 200;

  slots.forEach((slot) => {
    const resolved = resolveSlot(slot, width, height);
    if (!resolved) return;
    const xStart = Math.max(0, Math.floor(resolved.x));
    const yStart = Math.max(0, Math.floor(resolved.y));
    const xEnd = Math.min(width, Math.ceil(resolved.x + resolved.width));
    const yEnd = Math.min(height, Math.ceil(resolved.y + resolved.height));

    for (let y = yStart; y < yEnd; y++) {
      let idx = (y * width + xStart) * 4;
      for (let x = xStart; x < xEnd; x++) {
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const a = data[idx + 3];
        if (a >= alphaThreshold && r < threshold && g < threshold && b < threshold) {
          data[idx + 3] = 0;
        }
        idx += 4;
      }
    }
  });

  frameCtx.putImageData(imageData, 0, 0);
}

// Check if we need to manually punch holes or mask the frame
function needsRefinedFrameHelper() {
  if (!frameConfig || !frameConfig.src) return false;
  // Always refine (punch holes) for SVG frames to ensure transparency
  // Also keep legacy support for fr3/fr4 black masking
  const src = String(frameConfig.src).toLowerCase();
  return src.endsWith(".svg") || src.endsWith("fr3.png") || src.endsWith("fr4.png");
}

function applyRefinedFrameLogic(frameCtx, width, height, slots) {
  if (!slots || !slots.length) return;
  const src = String(frameConfig.src).toLowerCase();

  // 1. Legacy Black Mask (for fr3.png / fr4.png)
  if (src.endsWith("fr3.png") || src.endsWith("fr4.png")) {
    applyBlackSlotMask(frameCtx, width, height, slots);
    return;
  }

  // 2. Universal Hole Puncher (For SVGs and others)
  // This uses 'destination-out' to erase whatever is in the slot area,
  // creating perfect transparency for the photo underneath.
  frameCtx.save();
  frameCtx.globalCompositeOperation = "destination-out";
  frameCtx.fillStyle = "black"; // Color doesn't matter, alpha does

  slots.forEach((slot) => {
    const resolved = resolveSlot(slot, width, height);
    if (!resolved) return;

    frameCtx.beginPath();
    const rx = resolved.width / 2; // Approximate radius check
    const isCircle = (slot.rx && slot.rx >= rx) || (slot.borderRadius && slot.borderRadius >= 50);

    // Check if slot definition implies a circle/rounded shape
    // My generator uses 'rx' property for this.
    if (slot.rx || isCircle) {
      const radius = slot.rx || 0;
      if (radius >= resolved.width / 2) {
        // Circle
        frameCtx.arc(resolved.x + resolved.width / 2, resolved.y + resolved.height / 2, resolved.width / 2, 0, Math.PI * 2);
      } else {
        // Rounded Rect
        frameCtx.roundRect(resolved.x, resolved.y, resolved.width, resolved.height, radius);
      }
    } else {
      // Standard Rectangle
      frameCtx.rect(resolved.x, resolved.y, resolved.width, resolved.height);
    }
    frameCtx.fill();
  });

  frameCtx.restore();
}

function getMaskedFrameCanvas() {
  const frameCanvas = document.createElement("canvas");
  frameCanvas.width = frameImage.naturalWidth || frameImage.width || 540;
  frameCanvas.height = frameImage.naturalHeight || frameImage.height || 960;
  const frameCtx = frameCanvas.getContext("2d");

  // 1. Draw the raw frame image
  frameCtx.drawImage(frameImage, 0, 0, frameCanvas.width, frameCanvas.height);

  // 2. Punch holes or apply masks if needed
  if (needsRefinedFrameHelper()) {
    applyRefinedFrameLogic(frameCtx, frameCanvas.width, frameCanvas.height, frameConfig.slots);
  }
  return frameCanvas;
}

async function buildFrameComposite(options = {}) {
  const { allowPartial = false } = options;
  if (!stripShots.length) return "";
  if (stripShots.length < stripLimit && !allowPartial) return "";
  try {
    await frameReady;
  } catch (error) {
    setStatus("Không tải được khung. Hãy kiểm tra file.", "error");
    return "";
  }

  const workCanvas = document.createElement("canvas");
  workCanvas.width = frameImage.naturalWidth || frameImage.width;
  workCanvas.height = frameImage.naturalHeight || frameImage.height;
  const ctx = workCanvas.getContext("2d");
  const images = await Promise.all(stripShots.slice(0, stripLimit).map(loadImage));

  images.forEach((img, index) => {
    const slot = frameConfig.slots[index];
    if (!slot) return;
    const resolved = resolveSlot(slot, workCanvas.width, workCanvas.height);
    if (!resolved) return;
    drawImageCover(ctx, img, resolved.x, resolved.y, resolved.width, resolved.height);
  });

  if (needsRefinedFrameHelper()) {
    const maskedFrame = getMaskedFrameCanvas();
    ctx.drawImage(maskedFrame, 0, 0);
  } else {
    ctx.drawImage(frameImage, 0, 0);
  }
  return workCanvas.toDataURL("image/png");
}

async function renderFramePreview(options = {}) {
  const { allowPartial = false, commit = false } = options;
  const dataUrl = await buildFrameComposite({ allowPartial });
  if (!dataUrl) return "";
  const img = await loadImage(dataUrl);
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);
  showFramePreview();
  setCaptured(true);
  if (commit) {
    latestCompositeUrl = dataUrl;
    latestDataUrl = dataUrl;
  }
  return dataUrl;
}

async function renderFrameComposite() {
  return renderFramePreview({ commit: true });
}

function applyFilter() {
  stage.dataset.filter = filterSelect.value;
}

function applyFrame() {
  stage.dataset.frame = frameSelect.value;
}

function isValidStudioFrame(frame) {
  return (
    frame &&
    frame.id &&
    frame.src &&
    Array.isArray(frame.slots) &&
    frame.slots.length
  );
}

function loadStudioFrames() {
  let stored = [];
  try {
    stored = JSON.parse(localStorage.getItem(FRAME_STORE_KEY) || "[]");
  } catch (error) {
    stored = [];
  }

  const byId = new Map();
  BUILTIN_FRAMES.forEach((frame) => {
    if (isValidStudioFrame(frame)) byId.set(frame.id, frame);
  });
  stored.forEach((frame) => {
    if (isValidStudioFrame(frame) && !byId.has(frame.id)) {
      byId.set(frame.id, frame);
    }
  });

  return Array.from(byId.values());
}

function getStoredSelectedFrameId() {
  try {
    return localStorage.getItem(FRAME_SELECTED_KEY) || "";
  } catch (error) {
    return "";
  }
}

function setStoredSelectedFrameId(id) {
  try {
    localStorage.setItem(FRAME_SELECTED_KEY, id);
  } catch (error) {
    // Ignore storage failures.
  }
}

function getSlotsBounds(slots) {
  if (!Array.isArray(slots) || !slots.length) return null;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  slots.forEach((slot) => {
    if (!slot) return;
    const x = Number(slot.x);
    const y = Number(slot.y);
    const width = Number(slot.width);
    const height = Number(slot.height);
    if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(width) || !Number.isFinite(height)) {
      return;
    }
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + width);
    maxY = Math.max(maxY, y + height);
  });

  if (!Number.isFinite(minX) || !Number.isFinite(minY) || !Number.isFinite(maxX) || !Number.isFinite(maxY)) {
    return null;
  }
  const boundsWidth = maxX - minX;
  const boundsHeight = maxY - minY;
  if (boundsWidth <= 0 || boundsHeight <= 0) return null;
  return { width: boundsWidth, height: boundsHeight };
}

function classifyRatio(width, height) {
  if (!width || !height) return "16-9";
  const ratio = width / height;
  const diffSquare = Math.abs(ratio - 1);
  if (diffSquare < 0.12) return "1-1";
  const diffClassic = Math.abs(ratio - 4 / 3);
  const diffLandscape = Math.abs(ratio - 16 / 9);
  const diffPortrait = Math.abs(ratio - 9 / 16);
  if (diffPortrait <= diffClassic && diffPortrait <= diffLandscape) return "9-16";
  if (diffClassic <= diffLandscape) return "4-3";
  return "16-9";
}

function inferFrameRatio(frame) {
  if (!frame) return "";
  if (frame.ratio) return frame.ratio;
  const bounds = getSlotsBounds(frame.slots);
  if (bounds) return classifyRatio(bounds.width, bounds.height);
  return "";
}

function getGalleryRatio() {
  if (stage) {
    const dataRatio = stage.dataset.ratio;
    if (dataRatio && dataRatio !== "frame") return dataRatio;
  }
  const frameRatio = inferFrameRatio(frameConfig);
  if (frameRatio) return frameRatio;
  return previewRatio || "16-9";
}

function syncGalleryLayout() {
  if (!gallery) return;
  const ratio = getGalleryRatio();
  const verticalRatios = new Set(["16-9", "4-3", "1-1"]);
  gallery.dataset.layout = verticalRatios.has(ratio) ? "vertical" : "horizontal";
}

function syncRatioInputs(value) {
  if (!value || !ratioInputs.length) return false;
  let matched = false;
  ratioInputs.forEach((input) => {
    const isMatch = input.value === value;
    input.checked = isMatch;
    if (isMatch) matched = true;
  });
  return matched;
}

function applyFrameRatio(frame) {
  const ratio = inferFrameRatio(frame);
  if (!ratio) return;
  if (syncRatioInputs(ratio)) {
    applyRatio(ratio);
  }
}

function applyInitialRatio() {
  const ratio = inferFrameRatio(frameConfig);
  if (ratio && syncRatioInputs(ratio)) {
    applyRatio(ratio);
    return;
  }
  const checkedRatio = document.querySelector('input[name="ratio"]:checked');
  if (checkedRatio) applyRatio(checkedRatio.value);
}

function formatRatio(ratio) {
  if (!ratio) return "";
  return String(ratio).replace("-", ":");
}

function buildFrameDescription(frame) {
  const slots = Array.isArray(frame.slots) ? frame.slots.length : 1;
  const ratioValue = inferFrameRatio(frame);
  const ratio = ratioValue ? formatRatio(ratioValue) : "";
  const parts = [`Phù hợp chụp ${slots} ảnh.`];
  if (ratio) parts.push(`Tỉ lệ ${ratio}.`);
  return parts.join(" ");
}

function shuffleFrames(frames) {
  const shuffled = frames.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function pickSuggestedFrames(frames, count, selectedId) {
  if (!frames.length) return [];
  const shuffled = shuffleFrames(frames);
  if (shuffled.length <= count) return shuffled;
  if (!selectedId) return shuffled.slice(0, count);

  const picks = shuffled.slice(0, count);
  if (picks.some((frame) => frame.id === selectedId)) return picks;
  const selected = shuffled.find((frame) => frame.id === selectedId);
  if (!selected) return picks;
  picks[picks.length - 1] = selected;
  return picks;
}

function resetStripState() {
  stripShots = [];
  latestCompositeUrl = "";
  latestDataUrl = "";
  updateStripUI();
  showCameraPreview();
  setCaptured(false);
  setGalleryCentered(false);
}

function getActiveFrameSuggestId() {
  if (!frameSuggestTrack) return "";
  const activeButton = frameSuggestTrack.querySelector(
    ".spotlight-item.is-active .frame-card[data-frame-id]"
  );
  return activeButton ? activeButton.dataset.frameId || "" : "";
}

function updateFrameSuggestDetail(frameId) {
  if (!frameSuggestTitle || !frameSuggestDesc || !frameSuggestPreview) return;
  const fallbackId = studioFrames[0] ? studioFrames[0].id : "";
  const id = frameId || getActiveFrameSuggestId() || getStoredSelectedFrameId() || fallbackId;
  if (!id) return;
  const frame = studioFrameMap.get(id);
  if (!frame) return;

  const title = frame.name || frame.id || "Khung gợi ý";
  frameSuggestTitle.textContent = title;
  frameSuggestDesc.textContent = buildFrameDescription(frame);
  frameSuggestPreview.src = frame.src;
  frameSuggestPreview.alt = `Khung ${title}`;

  if (frameSuggestMeta) {
    const slots = Array.isArray(frame.slots) ? frame.slots.length : 1;
    const ratioValue = inferFrameRatio(frame);
    const ratio = ratioValue ? formatRatio(ratioValue) : "";
    frameSuggestMeta.textContent = ratio ? `${slots} ảnh - ${ratio}` : `${slots} ảnh`;
  }
}

function applyStudioFrameSelection(frameId) {
  const frame = studioFrameMap.get(frameId);
  if (!frame) return;
  setStoredSelectedFrameId(frameId);
  frameConfig = { src: frame.src, slots: frame.slots, ratio: frame.ratio || "" };
  stripLimit = frameConfig.slots.length || 1;
  loadFrameAsset(frameConfig.src);
  applyFrameRatio(frame);
  buildStripGrid();
  resetStripState();
  setStatus(`Đã chọn khung ${frame.name || frame.id}.`);
  syncFrameSuggestionSelection();
  updateFrameSuggestDetail(frameId);
}

function syncFrameSuggestionSelection() {
  if (!frameSuggestButtons.length) return;
  const selectedId = getStoredSelectedFrameId();
  frameSuggestButtons.forEach((button) => {
    const isSelected = button.dataset.frameId === selectedId;
    button.classList.toggle("is-selected", isSelected);
    button.setAttribute("aria-pressed", isSelected ? "true" : "false");
  });
}

function renderFrameSuggestions() {
  if (!frameSuggestTrack) return;
  studioFrames = loadStudioFrames();
  studioFrameMap = new Map(studioFrames.map((frame) => [frame.id, frame]));

  const selectedId = getStoredSelectedFrameId();
  const picks = pickSuggestedFrames(studioFrames, 5, selectedId);
  frameSuggestTrack.innerHTML = "";

  picks.forEach((frame) => {
    const item = document.createElement("article");
    item.className = "spotlight-item";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "spotlight-card frame-card";
    button.dataset.frameId = frame.id;

    const thumb = document.createElement("span");
    thumb.className = "frame-thumb";
    thumb.setAttribute("aria-hidden", "true");
    thumb.style.setProperty("--frame-thumb", `url("${frame.src}")`);

    const caption = document.createElement("span");
    caption.className = "frame-caption";
    caption.textContent = frame.name || frame.id || "Frame";

    button.append(thumb, caption);
    button.addEventListener("click", () => applyStudioFrameSelection(frame.id));
    item.append(button);
    frameSuggestTrack.append(item);
  });

  frameSuggestButtons = Array.from(
    frameSuggestTrack.querySelectorAll(".frame-card[data-frame-id]")
  );
  syncFrameSuggestionSelection();
  updateFrameSuggestDetail();
}

function applyRatio(value) {
  if (!value) return;
  previewRatio = value;
  if (!isFramePreview) {
    stage.dataset.ratio = value;
  }
  syncGalleryLayout();
}

function getFocusableElements(container) {
  if (!container) return [];
  return Array.from(
    container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  ).filter((el) => !el.hasAttribute("disabled"));
}

function openDrawer() {
  if (!captureRoot || !drawer) return;
  captureRoot.classList.add("is-drawer-open");
  drawer.setAttribute("aria-hidden", "false");
  if (drawerToggle) drawerToggle.setAttribute("aria-expanded", "true");
  const focusables = getFocusableElements(drawer);
  const target = focusables[0] || drawer;
  if (target && typeof target.focus === "function") {
    try {
      target.focus({ preventScroll: true });
    } catch (error) {
      target.focus();
    }
  }
}

function closeDrawer() {
  if (!captureRoot || !drawer) return;
  captureRoot.classList.remove("is-drawer-open");
  drawer.setAttribute("aria-hidden", "true");
  if (drawerToggle) drawerToggle.setAttribute("aria-expanded", "false");
  if (drawerToggle && typeof drawerToggle.focus === "function") {
    try {
      drawerToggle.focus({ preventScroll: true });
    } catch (error) {
      drawerToggle.focus();
    }
  }
}

function toggleDrawer() {
  if (!captureRoot) return;
  const isOpen = captureRoot.classList.contains("is-drawer-open");
  if (isOpen) {
    closeDrawer();
  } else {
    openDrawer();
  }
}

function handleDrawerKeydown(event) {
  if (!captureRoot || !drawer) return;
  if (!captureRoot.classList.contains("is-drawer-open")) return;

  if (event.key === "Escape") {
    event.preventDefault();
    closeDrawer();
    return;
  }

  if (event.key !== "Tab") return;
  const focusables = getFocusableElements(drawer);
  if (!focusables.length) {
    event.preventDefault();
    drawer.focus();
    return;
  }

  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function drawVideoFrame(ctx, width, height) {
  if (!isFlipped) {
    ctx.drawImage(video, 0, 0, width, height);
    return;
  }
  ctx.save();
  ctx.translate(width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, 0, 0, width, height);
  ctx.restore();
}

async function capturePhoto() {
  if (isCapturing) return;
  if (!stream && !mockOnly) {
    setStatus("Camera chưa sẵn sàng.", "error");
    return;
  }
  if (stripShots.length >= stripLimit) {
    setStatus(`Đã đủ ${stripLimit} ảnh. Hãy lưu hoặc chụp lại từ đầu.`);
    return;
  }

  isCapturing = true;
  try {
    setStatus("Chuẩn bị chụp...");

    const timer = Number.parseInt(timerSelect.value, 10);
    if (timer > 0) {
      for (let i = timer; i > 0; i--) {
        countdownEl.textContent = i;
        await wait(1000);
      }
      countdownEl.textContent = "";
    }

    stage.classList.add("flash");
    setTimeout(() => stage.classList.remove("flash"), 450);

    const width = video.videoWidth || canvas.width || 1280;
    const height = video.videoHeight || canvas.height || 720;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    ctx.filter = filterMap[filterSelect.value] || "none";
    if (stream) {
      drawVideoFrame(ctx, width, height);
    } else {
      drawMock(ctx, width, height);
    }
    ctx.filter = "none";
    drawFrame(ctx, width, height, frameSelect.value);

    latestDataUrl = canvas.toDataURL("image/png");
    if (stripLimit === 1) {
      await storeLatestShot(latestDataUrl);
    }
    addToGallery(latestDataUrl);
    stripShots.push(latestDataUrl);
    updateStripUI();

    const isComplete = stripShots.length === stripLimit;
    if (isComplete) {
      try {
        const previewUrl = await renderFramePreview({ commit: true });
        if (previewUrl) {
          latestCompositeUrl = previewUrl;
          await storeLatestShot(previewUrl);
        } else {
          setCaptured(true);
        }
      } catch (renderErr) {
        console.error("Lỗi khi render ảnh ghép:", renderErr);
        setStatus("Lỗi khi tạo ảnh ghép khung. Bạn vẫn có thể thử lưu lại.", "error");
        setCaptured(true);
      }
      setGalleryCentered(true);
      setStatus(`Đã đủ ${stripLimit} ảnh. Bạn có thể lưu hoặc chụp lại.`);
    } else {
      showCameraPreview();
      setCaptured(true);
      setGalleryCentered(false);
      setStatus(`Đã chụp xong! Còn ${stripLimit - stripShots.length} ảnh nữa.`);
    }
  } catch (err) {
    console.error("Lỗi trong quá trình chụp:", err);
    setStatus("Lỗi khi chụp: " + (err.message || "vui lòng thử lại."), "error");
  } finally {
    isCapturing = false;
    if (countdownEl) countdownEl.textContent = "";
  }
}

function drawFrame(ctx, width, height, frame) {
  if (frame === "film") {
    ctx.fillStyle = "#0e0e0f";
    ctx.fillRect(0, 0, width, 26);
    ctx.fillRect(0, height - 26, width, 26);

    ctx.fillStyle = "#d6cdbf";
    for (let y = 48; y < height - 40; y += 36) {
      ctx.fillRect(14, y, 12, 18);
      ctx.fillRect(width - 26, y, 12, 18);
    }
  }

  if (frame === "arcade") {
    ctx.lineWidth = 14;
    ctx.strokeStyle = "rgba(61, 214, 198, 0.9)";
    ctx.strokeRect(10, 10, width - 20, height - 20);
    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgba(255, 138, 61, 0.8)";
    ctx.strokeRect(26, 26, width - 52, height - 52);
  }

  if (frame === "petal") {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(40, 120);
    ctx.quadraticCurveTo(40, 40, 120, 40);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(width - 40, height - 120);
    ctx.quadraticCurveTo(width - 40, height - 40, width - 120, height - 40);
    ctx.stroke();
  }
}

function addToGallery(dataUrl) {
  if (!gallery) return;
  const img = new Image();
  img.src = dataUrl;
  img.alt = "Photobooth shot";
  gallery.prepend(img);
}

function clearGallery() {
  if (!gallery) return;
  gallery.innerHTML = "";
}

function resetCaptureSession() {
  stripShots = [];
  latestCompositeUrl = "";
  latestDataUrl = "";
  updateStripUI();
  clearGallery();
  if (countdownEl) countdownEl.textContent = "";
  showCameraPreview();
  setGalleryCentered(false);
  if (mockOnly) {
    const ctx = canvas.getContext("2d");
    canvas.width = 1280;
    canvas.height = 720;
    drawMock(ctx, canvas.width, canvas.height);
    setCaptured(false, { showStill: true });
  } else {
    setCaptured(false);
  }
  isCapturing = false;
}

async function downloadShot() {
  const dataUrl = latestCompositeUrl || latestDataUrl;
  if (!dataUrl) return;
  await storeLatestShot(dataUrl);
  const label = latestCompositeUrl ? "photobooth-frame" : "photobooth";
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = `${label}-${Date.now()}.png`;
  link.click();
}

function retake() {
  if (!stripShots.length) {
    setStatus("Chưa có ảnh để chụp lại.", "error");
    return;
  }
  resetCaptureSession();
  setStatus("Đã xóa tất cả ảnh trong phiên này. Hãy chụp lại từ đầu.");
}

async function saveStrip() {
  if (stripShots.length !== stripLimit) return;
  try {
    const dataUrl = latestCompositeUrl || (await buildFrameComposite());
    if (!dataUrl) {
      setStatus("Không thể tạo ảnh ghép để tải về.", "error");
      return;
    }
    latestCompositeUrl = dataUrl;
    await storeLatestShot(dataUrl);
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `photobooth-frame-${Date.now()}.png`;
    link.click();
  } catch (err) {
    console.error("Lỗi khi lưu khung ảnh:", err);
    setStatus("Lỗi khi tải khung ảnh: " + (err.message || "vui lòng thử lại"), "error");
  }
}

function resetStrip() {
  stripShots = [];
  latestCompositeUrl = "";
  updateStripUI();
  showCameraPreview();
  setCaptured(false);
  setGalleryCentered(false);
  setStatus(`Đã xóa khung ${stripLimit} ảnh. Hãy chụp lại từ đầu.`);
}

switchBtn.addEventListener("click", async () => {
  facingMode = facingMode === "user" ? "environment" : "user";
  await startCamera();
});
if (flipBtn) {
  flipBtn.addEventListener("click", () => {
    isFlipped = !isFlipped;
    applyFlipState();
  });
}

filterSelect.addEventListener("change", applyFilter);
if (frameSelect) {
  frameSelect.addEventListener("change", applyFrame);
}
if (frameSuggest) {
  frameSuggest.addEventListener("spotlightchange", () => {
    updateFrameSuggestDetail();
  });
}
ratioInputs.forEach((input) => {
  input.addEventListener("change", () => applyRatio(input.value));
});
if (drawerToggle) drawerToggle.addEventListener("click", toggleDrawer);
if (drawerCloseBtn) drawerCloseBtn.addEventListener("click", closeDrawer);
if (drawerBackdrop) drawerBackdrop.addEventListener("click", closeDrawer);
document.addEventListener("keydown", handleDrawerKeydown);
shutterBtn.addEventListener("click", capturePhoto);
downloadBtn.addEventListener("click", downloadShot);
retakeBtn.addEventListener("click", retake);
if (saveStripBtn) saveStripBtn.addEventListener("click", saveStrip);
if (resetStripBtn) resetStripBtn.addEventListener("click", resetStrip);
if (startBtn) startBtn.addEventListener("click", showStudioSection);
document.querySelectorAll('a[href="#studio"]').forEach((link) => {
  link.addEventListener("click", showStudioSection);
});

window.addEventListener("beforeunload", stopCamera);

applyFilter();
applyFrame();
applyFlipState();
renderFrameSuggestions();
applyInitialRatio();
startCamera();
buildStripGrid();
updateStripUI();
if (window.location.hash === "#studio") {
  showStudioSection();
}


