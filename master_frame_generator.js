const fs = require('fs');

// --- Helper Functions ---

function rectPath(x, y, w, h) {
    return `M${x},${y} L${x + w},${y} L${x + w},${y + h} L${x},${y + h} Z`;
}

function circlePath(cx, cy, r) {
    // 2 arcs to make a full circle
    return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx} ${cy + r} A ${r} ${r} 0 1 1 ${cx} ${cy - r} Z`;
}

function roundedRectPath(x, y, w, h, r) {
    return `M ${x + r} ${y} L ${x + w - r} ${y} Q ${x + w} ${y} ${x + w} ${y + r} L ${x + w} ${y + h - r} Q ${x + w} ${y + h} ${x + w - r} ${y + h} L ${x + r} ${y + h} Q ${x} ${y + h} ${x} ${y + h - r} L ${x} ${y + r} Q ${x} ${y} ${x + r} ${y} Z`;
}

// Generates the SVG content string
function generateSVG(f) {
    // 1. Create the main shape path (Outer Rect + Holes)
    // Outer rect: Counter-Clockwise (standard)
    // Holes: If we just append them, "evenodd" rule handles the insideness.

    let path = rectPath(0, 0, f.w, f.h);

    // Append hole paths
    f.slots.forEach(s => {
        let holePath = "";
        if (s.rx && s.w === s.h && s.rx === s.w / 2) {
            holePath = circlePath(s.x + s.w / 2, s.y + s.h / 2, s.w / 2);
        } else if (s.rx) {
            holePath = roundedRectPath(s.x, s.y, s.w, s.h, s.rx);
        } else {
            holePath = rectPath(s.x, s.y, s.w, s.h);
        }
        path += " " + holePath;
    });

    const decor = f.decor ? f.decor(f) : "";

    return `<svg width="${f.w}" height="${f.h}" viewBox="0 0 ${f.w} ${f.h}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="${path}" fill="${f.bg}" fill-rule="evenodd"/>
    ${decor}
</svg>`;
}

// --- Frame Definitions (Source of Truth) ---

const frames = [
    // 13. Pixel Game (1:1)
    {
        id: 'frame13', w: 600, h: 600, bg: '#9bbc0f', slots: [{ x: 100, y: 100, w: 400, h: 300 }],
        decor: () => `<path d="M50 50 H550 V500 H50 V50 Z" fill="none" stroke="#0f380f" stroke-width="8"/><text x="300" y="450" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="24" fill="#0f380f">LEVEL UP</text>`
    },

    // 14. Dreamy Clouds (9:16)
    {
        id: 'frame14', w: 540, h: 960, bg: '#CAE9FF', slots: [{ x: 60, y: 140, w: 420, h: 320, rx: 20 }, { x: 60, y: 520, w: 420, h: 320, rx: 20 }],
        decor: () => `<text x="270" y="495" text-anchor="middle" font-family="cursive" font-size="28" fill="#FFF">Daydream</text>`
    },

    // 15. Cinematic (16:9)
    {
        id: 'frame15', w: 960, h: 540, bg: '#050505', slots: [{ x: 0, y: 70, w: 960, h: 400 }],
        decor: () => `<text x="80" y="48" font-family="bold" font-size="20" fill="white">REC</text><text x="820" y="48" font-family="monospace" font-size="20" fill="white">00:00:26</text>`
    },

    // 16. Vogue (9:16)
    {
        id: 'frame16', w: 540, h: 960, bg: '#f0f0f0', slots: [{ x: 50, y: 150, w: 440, h: 760 }],
        decor: () => `<text x="270" y="120" text-anchor="middle" font-family="serif" font-weight="bold" font-size="80" fill="red">VOGUE</text>`
    },

    // 17. Wanted (9:16)
    {
        id: 'frame17', w: 540, h: 960, bg: '#eaddcf', slots: [{ x: 90, y: 220, w: 360, h: 360 }],
        decor: () => `<text x="270" y="150" text-anchor="middle" font-family="serif" font-weight="bold" font-size="60" fill="#5c4b37">WANTED</text>`
    },

    // 18. Digital Pet (1:1)
    {
        id: 'frame18', w: 600, h: 600, bg: '#ffb7b2', slots: [{ x: 180, y: 180, w: 240, h: 240 }],
        decor: () => `<ellipse cx="300" cy="300" rx="250" ry="250" fill="none" stroke="white" stroke-width="15"/>`
    },

    // 19. Album Art (1:1)
    {
        id: 'frame19', w: 600, h: 600, bg: '#111', slots: [{ x: 25, y: 25, w: 550, h: 550 }],
        decor: () => `<rect x="420" y="520" width="150" height="50" fill="white"/><text x="495" y="550" text-anchor="middle" font-size="12" font-weight="bold">PARENTAL ADVISORY</text>`
    },

    // 20. Social Live (9:16) - needs careful transparent region. 
    // EvenOdd works best with shapes. For a "mostly transparent" frame, we define the bg as the FRAME, holes as the transparent part.
    // Frame 20 is tricky because previously we tried alpha transparency. Even-odd is binary (hole or solid).
    // Let's make it a UI frame: Solid bars top/bottom.
    {
        id: 'frame20', w: 540, h: 960, bg: 'transparent', slots: [{ x: 0, y: 0, w: 540, h: 960 }],
        decor: () => `<rect width="540" height="100" fill="rgba(0,0,0,0.5)"/><rect x="20" y="30" width="60" height="30" rx="4" fill="#ff0040"/><text x="50" y="50" text-anchor="middle" fill="white" font-weight="bold">LIVE</text>`
    },

    // 21. Scrapbook (3:4)
    {
        id: 'frame21', w: 540, h: 720, bg: '#fdf6e3', slots: [{ x: 50, y: 50, w: 440, h: 620 }],
        decor: () => `<rect x="220" y="20" width="100" height="30" fill="#e0e0e0" transform="rotate(-3 270 35)"/>`
    },

    // 22. Rainy (9:16)
    {
        id: 'frame22', w: 540, h: 960, bg: '#37474f', slots: [{ x: 20, y: 20, w: 500, h: 920 }],
        decor: () => `<text x="50" y="80" font-size="40">🌧</text>`
    },

    // 23. Locket (1:1)
    {
        id: 'frame23', w: 600, h: 600, bg: '#f8bbd0', slots: [{ x: 120, y: 120, w: 360, h: 360, rx: 180 }],
        decor: () => `<circle cx="300" cy="300" r="220" fill="none" stroke="#e91e63" stroke-width="20"/>`
    },

    // 24. Grid 4x (Square)
    {
        id: 'frame24', w: 600, h: 600, bg: 'white', slots: [
            { x: 10, y: 10, w: 285, h: 285 }, { x: 305, y: 10, w: 285, h: 285 },
            { x: 10, y: 305, w: 285, h: 285 }, { x: 305, y: 305, w: 285, h: 285 }
        ]
    },

    // 25. Strip 4 (9:16)
    {
        id: 'frame25', w: 540, h: 960, bg: 'white', slots: [
            { x: 40, y: 40, w: 460, h: 200 }, { x: 40, y: 260, w: 460, h: 200 },
            { x: 40, y: 480, w: 460, h: 200 }, { x: 40, y: 700, w: 460, h: 200 }
        ]
    },

    // 26. Blob (1:1) - Rect hole for now, easy evenodd
    {
        id: 'frame26', w: 600, h: 600, bg: '#e1f5fe', slots: [{ x: 100, y: 100, w: 400, h: 400 }],
        decor: () => `<path d="M0 0 L600 0 L600 600 L0 600 Z M 100 100 L 500 100 L 500 500 L 100 500 Z" fill="#e1f5fe" fill-rule="evenodd"/> <!-- Manual donut overlay if needed, but path above handles bg -->`
    },

    // 27. VHS (16:9)
    {
        id: 'frame27', w: 960, h: 540, bg: '#212121', slots: [{ x: 50, y: 50, w: 860, h: 440 }],
        decor: () => `<text x="80" y="80" fill="#0f0" font-family="monospace" font-size="30">PLAY</text>`
    },

    // 28. Daily News (9:16)
    {
        id: 'frame28', w: 540, h: 960, bg: '#eee', slots: [{ x: 30, y: 200, w: 480, h: 400 }],
        decor: () => `<text x="270" y="100" text-anchor="middle" font-size="50" font-family="serif" font-weight="bold">NEWS</text>`
    },

    // 29. Winter (3:4)
    {
        id: 'frame29', w: 540, h: 720, bg: '#e3f2fd', slots: [{ x: 40, y: 40, w: 460, h: 640 }],
        decor: () => `<text x="270" y="700" text-anchor="middle" font-size="30">❄️ WINTER ❄️</text>`
    },

    // 30. Spooky (1:1)
    {
        id: 'frame30', w: 600, h: 600, bg: '#263238', slots: [{ x: 80, y: 80, w: 440, h: 440 }],
        decor: () => `<text x="300" y="550" text-anchor="middle" fill="#ff6e40" font-size="40">BOO!</text>`
    },

    // 31. Meow (9:16)
    {
        id: 'frame31', w: 540, h: 960, bg: '#fff3e0', slots: [{ x: 50, y: 150, w: 440, h: 600 }],
        decor: () => `<polygon points="50,150 80,100 110,150" fill="white" stroke="#ffcc80" stroke-width="4"/><text x="270" y="850" text-anchor="middle" font-size="40">MEOW</text>`
    },

    // 32. HBD (1:1)
    {
        id: 'frame32', w: 600, h: 600, bg: '#fffde7', slots: [{ x: 50, y: 50, w: 500, h: 500 }],
        decor: () => `<text x="300" y="550" text-anchor="middle" font-size="40" fill="#fbc02d">HAPPY BDAY</text>`
    },

    // 33. Western Wide (16:9)
    {
        id: 'frame33', w: 960, h: 540, bg: '#d7ccc8', slots: [{ x: 300, y: 100, w: 360, h: 340 }],
        decor: () => `<text x="150" y="270" text-anchor="middle" font-size="50" font-family="serif">WANTED</text>`
    },

    // 34. News TV (16:9)
    {
        id: 'frame34', w: 960, h: 540, bg: 'transparent', slots: [{ x: 0, y: 0, w: 960, h: 540 }],
        decor: () => `<rect y="440" width="960" height="100" fill="#d32f2f"/><text x="20" y="500" fill="white" font-size="40" font-weight="bold">BREAKING NEWS</text>`
    },

    // 35. Museum (3:4)
    {
        id: 'frame35', w: 540, h: 720, bg: '#212121', slots: [{ x: 80, y: 80, w: 380, h: 480 }],
        decor: () => `<rect x="70" y="70" width="400" height="500" stroke="#ffd700" stroke-width="10" fill="none"/>`
    },

    // 36. Retro OS
    {
        id: 'frame36', w: 540, h: 960, bg: '#008080', slots: [{ x: 20, y: 60, w: 500, h: 880 }],
        decor: () => `<rect x="20" y="20" width="500" height="40" fill="#000080"/><text x="30" y="48" fill="white" font-family="monospace">My_Photo.bmp</text>`
    },

    // 37. Console
    {
        id: 'frame37', w: 960, h: 540, bg: '#222', slots: [{ x: 100, y: 40, w: 760, h: 460 }],
        decor: () => `<rect width="100" height="540" fill="#ff5f5f"/><rect x="860" width="100" height="540" fill="#00bfff"/>`
    },

    // 38. CCTV
    {
        id: 'frame38', w: 960, h: 540, bg: 'black', slots: [{ x: 0, y: 0, w: 960, h: 540 }],
        decor: () => `<text x="40" y="60" fill="white" font-family="monospace">REC ●</text>`
    },

    // 39. Porthole (1:1)
    {
        id: 'frame39', w: 600, h: 600, bg: '#dcedc8', slots: [{ x: 100, y: 100, w: 400, h: 400, rx: 200 }],
        decor: () => `<circle cx="300" cy="300" r="240" stroke="#37474f" stroke-width="5" fill="none"/>`
    },

    // 40. Vinyl (1:1)
    {
        id: 'frame40', w: 600, h: 600, bg: '#f5f5f5', slots: [{ x: 50, y: 50, w: 500, h: 500 }],
        decor: () => `<circle cx="550" cy="300" r="200" fill="black"/><circle cx="550" cy="300" r="80" fill="#ffeb3b"/>`
    },

    // 41. Messenger
    {
        id: 'frame41', w: 540, h: 960, bg: '#e0f7fa', slots: [{ x: 30, y: 120, w: 480, h: 680 }],
        decor: () => `<rect width="540" height="80" fill="#00bcd4"/><text x="30" y="50" fill="white" font-size="30">Chat</text>`
    },

    // 42. Tarot
    {
        id: 'frame42', w: 540, h: 960, bg: '#1a237e', slots: [{ x: 90, y: 150, w: 360, h: 600 }],
        decor: () => `<text x="270" y="800" text-anchor="middle" fill="#ffd700" font-size="40" font-family="serif">THE STAR</text>`
    },

    // 43. Stamp
    {
        id: 'frame43', w: 600, h: 600, bg: '#e0e0e0', slots: [{ x: 80, y: 80, w: 440, h: 440 }],
        decor: () => `<rect x="40" y="40" width="520" height="520" fill="none" stroke="white" stroke-width="20" stroke-dasharray="20"/>`
    },

    // 44. Phone UI
    {
        id: 'frame44', w: 540, h: 960, bg: 'transparent', slots: [{ x: 0, y: 0, w: 540, h: 960 }],
        decor: () => `<text x="40" y="40" fill="white" font-size="20">12:30</text><circle cx="270" cy="850" r="40" stroke="white" stroke-width="4" fill="none"/>`
    },

    // 45. Anime
    {
        id: 'frame45', w: 960, h: 540, bg: 'white', slots: [{ x: 50, y: 50, w: 860, h: 440 }],
        decor: () => `<path d="M0 0 L480 270 L0 540 H10 Z" fill="black"/><text x="80" y="480" font-size="60" fill="red" font-weight="bold">OSH!</text>`
    },

    // 46. Comic (3:4)
    {
        id: 'frame46', w: 540, h: 720, bg: 'white', slots: [{ x: 20, y: 20, w: 240, h: 300 }, { x: 280, y: 20, w: 240, h: 300 }, { x: 20, y: 340, w: 500, h: 360 }],
        decor: () => `<line x1="270" y1="20" x2="270" y2="320" stroke="black" stroke-width="4"/><line x1="20" y1="330" x2="520" y2="330" stroke="black" stroke-width="4"/>`
    },

    // 47. Sketch
    {
        id: 'frame47', w: 600, h: 600, bg: '#fff9c4', slots: [{ x: 80, y: 50, w: 480, h: 500 }],
        decor: () => `<path d="M40 0 V600" stroke="#999" stroke-width="2"/>`
    },

    // 48. Neon Bar
    {
        id: 'frame48', w: 540, h: 720, bg: '#121212', slots: [{ x: 40, y: 150, w: 460, h: 530 }],
        decor: () => `<text x="270" y="100" text-anchor="middle" font-size="60" fill="#00e5ff">OPEN</text>`
    },

    // 49. Cyber Wanted
    {
        id: 'frame49', w: 540, h: 960, bg: 'black', slots: [{ x: 40, y: 200, w: 460, h: 500 }],
        decor: () => `<text x="270" y="100" text-anchor="middle" fill="#0f0" font-family="monospace" font-size="40">TARGET</text>`
    },

    // 50. Card
    {
        id: 'frame50', w: 540, h: 720, bg: 'white', slots: [{ x: 80, y: 100, w: 380, h: 520 }],
        decor: () => `<text x="50" y="60" font-size="50">A♠</text>`
    },

    // 51. Ticket
    {
        id: 'frame51', w: 960, h: 540, bg: '#fff3e0', slots: [{ x: 250, y: 40, w: 660, h: 460 }],
        decor: () => `<path d="M200 0 V540" stroke="black" stroke-width="2" stroke-dasharray="10 5"/><text x="100" y="270" transform="rotate(-90 100 270)" font-size="30">ADMIT ONE</text>`
    },

    // 52. Browser
    {
        id: 'frame52', w: 960, h: 720, bg: '#f1f1f1', slots: [{ x: 0, y: 80, w: 960, h: 640 }],
        decor: () => `<rect width="960" height="80" fill="#ddd"/><circle cx="30" cy="40" r="10" fill="#ff5f56"/>`
    },

    // 53. Billboard
    {
        id: 'frame53', w: 600, h: 600, bg: '#42a5f5', slots: [{ x: 50, y: 50, w: 500, h: 300 }],
        decor: () => `<rect x="250" y="350" width="100" height="250" fill="#616161"/><text x="300" y="420" text-anchor="middle" fill="white" font-weight="bold" font-size="30">AD HERE</text>`
    },

    // 54. Fish Eye (1:1)
    {
        id: 'frame54', w: 600, h: 600, bg: 'black', slots: [{ x: 0, y: 0, w: 600, h: 600, rx: 300 }],
        decor: () => ``
    },

    // 55. Receipt
    {
        id: 'frame55', w: 540, h: 960, bg: 'white', slots: [{ x: 40, y: 200, w: 460, h: 460 }],
        decor: () => `<text x="270" y="80" text-anchor="middle" font-family="monospace" font-size="30">RECEIPT</text>`
    },

    // 56. Ben 10
    {
        id: 'frame56', w: 600, h: 600, bg: '#000', slots: [{ x: 100, y: 100, w: 400, h: 400, rx: 200 }],
        decor: () => `<circle cx="300" cy="300" r="230" stroke="#39ff14" stroke-width="20" fill="none"/><text x="300" y="560" text-anchor="middle" font-size="40" fill="#39ff14">HERO</text>`
    },

    // 57. Adventure
    {
        id: 'frame57', w: 540, h: 960, bg: '#4fc3f7', slots: [{ x: 40, y: 40, w: 460, h: 500 }],
        decor: () => `<rect x="0" y="540" width="540" height="420" fill="#8bc34a"/><text x="270" y="900" text-anchor="middle" font-size="50" fill="#ffeb3b">ALGEBRAIC!</text>`
    },

    // 58. Chase
    {
        id: 'frame58', w: 540, h: 720, bg: '#ffe082', slots: [{ x: 50, y: 50, w: 440, h: 440 }],
        decor: () => `<text x="270" y="650" text-anchor="middle" font-weight="bold" font-size="60" fill="#bf360c">CHASE!</text>`
    },

    // 59. Mickey
    {
        id: 'frame59', w: 600, h: 600, bg: '#f44336', slots: [{ x: 100, y: 50, w: 400, h: 400, rx: 200 }],
        decor: () => `<circle cx="100" cy="100" r="80" fill="black"/><circle cx="500" cy="100" r="80" fill="black"/><rect x="0" y="300" width="600" height="300" fill="#f44336"/>`
    },

    // 60. Pika
    {
        id: 'frame60', w: 540, h: 960, bg: '#ffeb3b', slots: [{ x: 40, y: 200, w: 460, h: 560 }],
        decor: () => `<circle cx="80" cy="850" r="40" fill="#f44336"/><circle cx="460" cy="850" r="40" fill="#f44336"/><text x="270" y="150" text-anchor="middle" font-size="60">Pika!</text>`
    },

    // 61. Sponge
    {
        id: 'frame61', w: 600, h: 600, bg: '#fff176', slots: [{ x: 50, y: 50, w: 500, h: 500, rx: 20 }],
        decor: () => `<rect x="0" y="550" width="600" height="50" fill="#795548"/>`
    },

    // 62. Dora
    {
        id: 'frame62', w: 600, h: 600, bg: '#2196f3', slots: [{ x: 100, y: 100, w: 400, h: 400, rx: 200 }],
        decor: () => `<rect x="0" y="500" width="600" height="100" fill="white"/><circle cx="300" cy="550" r="40" fill="#ffeb3b"/>`
    },

    // 63. Powerpuff
    {
        id: 'frame63', w: 540, h: 960, bg: '#fce4ec', slots: [{ x: 50, y: 180, w: 440, h: 600 }],
        decor: () => `<rect x="0" y="0" width="180" height="150" fill="#f8bbd0"/><text x="270" y="100" text-anchor="middle" font-size="40">POWER</text>`
    },

    // 64. Spider
    {
        id: 'frame64', w: 540, h: 960, bg: '#d50000', slots: [{ x: 40, y: 40, w: 460, h: 880 }],
        decor: () => `<circle cx="270" cy="480" r="200" fill="none" stroke="#333" stroke-width="2"/>`
    },

    // 65. Kitty
    {
        id: 'frame65', w: 600, h: 600, bg: 'white', slots: [{ x: 100, y: 150, w: 400, h: 350, rx: 50 }],
        decor: () => `<path d="M50 50 L100 150 L0 150 Z" fill="white" stroke="#333" stroke-width="5"/>`
    }
];

// --- Generation Loop ---

frames.forEach(f => {
    const svg = generateSVG(f);
    fs.writeFileSync(f.id + '.svg', svg);
    console.log('Regenerated ' + f.id + '.svg');
});

console.log('Done!');
