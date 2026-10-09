const fs = require('fs');

// Helper to create a path string for a rect
function rectPath(x, y, w, h) {
    return `M${x},${y} L${x + w},${y} L${x + w},${y + h} L${x},${y + h} Z`;
}

// Helper for a circle path (approximate or precise arc)
function circlePath(cx, cy, r) {
    // Move to top of circle
    return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx} ${cy + r} A ${r} ${r} 0 1 1 ${cx} ${cy - r} Z`;
}

// Helper to create the 'Background with Holes' path
function createBgPath(f) {
    // Outer rectangle (The full frame)
    let path = rectPath(0, 0, f.w, f.h);

    // Inner holes (Slots)
    f.slots.forEach(s => {
        if (s.rx && s.w === s.h && s.rx === s.w / 2) {
            // It's a circle
            const r = s.w / 2;
            const cx = s.x + r;
            const cy = s.y + r;
            path += " " + circlePath(cx, cy, r);
        } else if (s.rx) {
            // Rounded rect - simplified as rect for now to ensure robustness, or sophisticated path?
            // Let's stick to rect for simplicity unless corner radius is crucial (e.g. slight roundedness).
            // For frames like 'Hello Kitty' with rx=50, a rect hole will look ugly. 
            // Let's implement rounded rect path.
            // M x+r y L x+w-r y Q x+w y x+w y+r L x+w y+h-r Q x+w y+h x+w-r y+h L x+r y+h Q x y+h x y+h-r L x y+r Q x y x+r y Z
            const r = s.rx;
            // Standard SVG path for rounded rect
            path += ` M ${s.x + r} ${s.y} L ${s.x + s.w - r} ${s.y} Q ${s.x + s.w} ${s.y} ${s.x + s.w} ${s.y + r} L ${s.x + s.w} ${s.y + s.h - r} Q ${s.x + s.w} ${s.y + s.h} ${s.x + s.w - r} ${s.y + s.h} L ${s.x + r} ${s.y + s.h} Q ${s.x} ${s.y + s.h} ${s.x} ${s.y + s.h - r} L ${s.x} ${s.y + r} Q ${s.x} ${s.y} ${s.x + r} ${s.y} Z`;
        } else {
            path += " " + rectPath(s.x, s.y, s.w, s.h);
        }
    });

    return path;
}

const frames = [
    // 56. Ben 10
    {
        id: 'frame56', w: 600, h: 600, bg: '#000',
        slots: [{ x: 100, y: 100, w: 400, h: 400, rx: 200 }],
        decor: () => `<circle cx="300" cy="300" r="230" stroke="#39ff14" stroke-width="20" fill="none"/>
                   <path d="M70 300 L250 300 L180 180 Z" fill="#39ff14" transform="rotate(45 150 240)"/>
                   <path d="M530 300 L350 300 L420 420 Z" fill="#39ff14" transform="rotate(45 450 360)"/>
                   <rect x="0" y="0" width="600" height="600" stroke="#39ff14" stroke-width="10" rx="40" fill="none"/>
                   <text x="300" y="560" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="40" fill="#39ff14" font-style="italic">HERO TIME</text>`
    },
    // 57. Adventure Time
    {
        id: 'frame57', w: 540, h: 960, bg: '#4fc3f7',
        slots: [{ x: 40, y: 40, w: 460, h: 500 }],
        decor: () => `<rect x="0" y="540" width="540" height="420" fill="#8bc34a"/>
                   <circle cx="270" cy="750" r="120" fill="white"/>
                   <rect x="250" y="720" width="40" height="10" fill="black"/>
                   <text x="270" y="900" text-anchor="middle" font-family="cursive" font-weight="bold" font-size="50" fill="#ffeb3b" stroke="black" stroke-width="2">ALGEBRAIC!</text>`
    },
    // 58. Tom & Jerry
    {
        id: 'frame58', w: 540, h: 720, bg: '#ffe082',
        slots: [{ x: 50, y: 50, w: 440, h: 440 }],
        decor: () => `<circle cx="50" cy="50" r="30" fill="#ffca28" opacity="0.5"/>
                   <circle cx="490" cy="650" r="40" fill="#ffca28" opacity="0.5"/>
                   <circle cx="200" cy="600" r="20" fill="#ffca28" opacity="0.5"/>
                   <text x="270" y="650" text-anchor="middle" font-family="Comic Sans MS" font-weight="bold" font-size="60" fill="#bf360c">CHASE!</text>`
    },
    // 59. Mickey
    {
        id: 'frame59', w: 600, h: 600, bg: '#f44336',
        slots: [{ x: 100, y: 50, w: 400, h: 400, rx: 200 }],
        decor: () => `<circle cx="100" cy="100" r="80" fill="black"/>
                   <circle cx="500" cy="100" r="80" fill="black"/>
                   <circle cx="300" cy="500" r="30" fill="#ffeb3b"/>
                   <circle cx="300" cy="400" r="30" fill="#ffeb3b"/>
                   <rect x="0" y="300" width="600" height="300" fill="#f44336"/> 
                   <path d="M0 300 Q 300 400 600 300" fill="none" stroke="black" stroke-width="5"/>
                    <circle cx="200" cy="450" r="40" fill="#ffeb3b"/>
                   <circle cx="400" cy="450" r="40" fill="#ffeb3b"/>`
    },
    // 60. Pikachu
    {
        id: 'frame60', w: 540, h: 960, bg: '#ffeb3b',
        slots: [{ x: 40, y: 200, w: 460, h: 560 }],
        decor: () => `<path d="M0 0 L150 0 L50 200 Z" fill="#ffeb3b"/>
                   <path d="M540 0 L390 0 L490 200 Z" fill="#ffeb3b"/>
                   <circle cx="80" cy="850" r="40" fill="#f44336"/>
                   <circle cx="460" cy="850" r="40" fill="#f44336"/>
                   <path d="M220 850 Q 270 880 320 850" fill="none" stroke="black" stroke-width="5"/>
                   <text x="270" y="150" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="60" fill="#000">Pika!</text>`
    },
    // 61. SpongeBob
    {
        id: 'frame61', w: 600, h: 600, bg: '#fff176',
        slots: [{ x: 50, y: 50, w: 500, h: 500, rx: 20 }],
        decor: () => `<circle cx="50" cy="50" r="10" fill="#fdd835"/><circle cx="550" cy="550" r="20" fill="#fdd835"/>
                   <circle cx="500" cy="100" r="15" fill="#fdd835"/><circle cx="100" cy="500" r="25" fill="#fdd835"/>
                   <rect x="0" y="550" width="600" height="50" fill="#795548"/>
                   <rect x="0" y="500" width="600" height="50" fill="white"/>
                   <rect x="250" y="500" width="100" height="100" fill="#f44336"/>`
    },
    // 62. Doraemon
    {
        id: 'frame62', w: 600, h: 600, bg: '#2196f3',
        slots: [{ x: 100, y: 100, w: 400, h: 400, rx: 200 }],
        decor: () => `<rect x="0" y="500" width="600" height="100" fill="white"/>
                   <path d="M100 500 Q 300 600 500 500" fill="none" stroke="#d50000" stroke-width="20"/>
                   <circle cx="300" cy="550" r="40" fill="#ffeb3b" stroke="#333" stroke-width="2"/>
                   <line x1="280" y1="550" x2="320" y2="550" stroke="#333" stroke-width="2"/>`
    },
    // 63. Powerpuff
    {
        id: 'frame63', w: 540, h: 960, bg: '#fce4ec',
        slots: [{ x: 50, y: 180, w: 440, h: 600 }],
        decor: () => `<rect x="0" y="0" width="180" height="150" fill="#f8bbd0"/>
                   <rect x="180" y="0" width="180" height="150" fill="#b3e5fc"/>
                   <rect x="360" y="0" width="180" height="150" fill="#c8e6c9"/>
                   <text x="270" y="100" text-anchor="middle" font-family="cursive" font-weight="bold" font-size="40" fill="#e91e63">GIRL POWER</text>
                   <path d="M20 900 L270 940 L520 900" fill="none" stroke="#e91e63" stroke-width="5"/>`
    },
    // 64. Spiderman
    {
        id: 'frame64', w: 540, h: 960, bg: '#d50000',
        slots: [{ x: 40, y: 40, w: 460, h: 880 }],
        decor: () => `<line x1="0" y1="0" x2="540" y2="960" stroke="#333" stroke-width="2"/>
                   <line x1="540" y1="0" x2="0" y2="960" stroke="#333" stroke-width="2"/>
                   <circle cx="270" cy="480" r="100" fill="none" stroke="#333" stroke-width="2"/>
                   <circle cx="270" cy="480" r="200" fill="none" stroke="#333" stroke-width="2"/>
                   <circle cx="270" cy="480" r="300" fill="none" stroke="#333" stroke-width="2"/>
                   <rect x="0" y="800" width="540" height="160" fill="#1e88e5"/>`
    },
    // 65. Hello Kitty
    {
        id: 'frame65', w: 600, h: 600, bg: 'white',
        slots: [{ x: 100, y: 150, w: 400, h: 350, rx: 50 }],
        decor: () => `<path d="M50 50 L100 150 L0 150 Z" fill="white" stroke="#333" stroke-width="5"/>
                   <path d="M550 50 L500 150 L600 150 Z" fill="white" stroke="#333" stroke-width="5"/>
                   <path d="M450 50 Q 500 0 550 50 Q 500 100 450 50" fill="#ff1744" stroke="black" stroke-width="3"/>
                   <path d="M350 50 Q 400 0 450 50 Q 400 100 350 50" fill="#ff1744" stroke="black" stroke-width="3"/>
                   <circle cx="450" cy="50" r="30" fill="#ff1744" stroke="black" stroke-width="3"/>
                   <circle cx="300" cy="450" r="15" fill="#ffeb3b" stroke="black" stroke-width="2"/>
                   <line x1="100" y1="450" x2="200" y2="440" stroke="black" stroke-width="4"/>
                   <line x1="100" y1="480" x2="200" y2="490" stroke="black" stroke-width="4"/>
                   <line x1="400" y1="440" x2="500" y2="450" stroke="black" stroke-width="4"/>
                   <line x1="400" y1="490" x2="500" y2="480" stroke="black" stroke-width="4"/>`
    }
];

frames.forEach(f => {
    const bgPath = createBgPath(f);

    const svg = `<svg width="${f.w}" height="${f.h}" viewBox="0 0 ${f.w} ${f.h}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Use evenodd rule to punch holes -->
  <path d="${bgPath}" fill="${f.bg}" fill-rule="evenodd"/>
  ${f.decor ? f.decor() : ''}
</svg>`;

    fs.writeFileSync(f.id + '.svg', svg);
    console.log('Fixed ' + f.id + '.svg');
});
