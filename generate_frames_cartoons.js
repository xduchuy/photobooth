const fs = require('fs');

const frames = [
    // 56. Ben 10 Inspired (Omni Style)
    {
        id: 'frame56', w: 600, h: 600, bg: '#000',
        slots: [{ x: 100, y: 100, w: 400, h: 400, rx: 200 }], // Circular slot
        decor: (s) => `<circle cx="300" cy="300" r="230" stroke="#39ff14" stroke-width="20" fill="none"/>
                   <path d="M70 300 L250 300 L180 180 Z" fill="#39ff14" transform="rotate(45 150 240)"/> <!-- Abstract hourglass feel -->
                   <path d="M530 300 L350 300 L420 420 Z" fill="#39ff14" transform="rotate(45 450 360)"/>
                   <rect x="0" y="0" width="600" height="600" stroke="#39ff14" stroke-width="10" rx="40" fill="none"/>
                   <text x="300" y="560" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="40" fill="#39ff14" font-style="italic">HERO TIME</text>`
    },
    // 57. Looking for Adventure (Adventure Time style)
    {
        id: 'frame57', w: 540, h: 960, bg: '#4fc3f7', // Sky blue
        slots: [{ x: 40, y: 40, w: 460, h: 500 }],
        decor: (s) => `<rect x="0" y="540" width="540" height="420" fill="#8bc34a"/> <!-- Grass -->
                   <circle cx="270" cy="750" r="120" fill="white"/> <!-- Character shape placeholder -->
                   <rect x="250" y="720" width="40" height="10" fill="black"/> <!-- Eyes -->
                   <text x="270" y="900" text-anchor="middle" font-family="cursive" font-weight="bold" font-size="50" fill="#ffeb3b" stroke="black" stroke-width="2">ALGEBRAIC!</text>`
    },
    // 58. Cat & Mouse Chase (Tom & Jerry)
    {
        id: 'frame58', w: 540, h: 720, bg: '#ffe082', // Cheese yellow
        slots: [{ x: 50, y: 50, w: 440, h: 440 }],
        decor: (s) => `<circle cx="50" cy="50" r="30" fill="#ffca28" opacity="0.5"/>
                   <circle cx="490" cy="650" r="40" fill="#ffca28" opacity="0.5"/>
                   <circle cx="200" cy="600" r="20" fill="#ffca28" opacity="0.5"/>
                   <text x="270" y="650" text-anchor="middle" font-family="Comic Sans MS" font-weight="bold" font-size="60" fill="#bf360c">CHASE!</text>`
    },
    // 59. Magic Mouse (Mickey)
    {
        id: 'frame59', w: 600, h: 600, bg: '#f44336', // Red
        slots: [{ x: 100, y: 50, w: 400, h: 400, rx: 200 }],
        decor: (s) => `<circle cx="100" cy="100" r="80" fill="black"/> <!-- Ear L -->
                   <circle cx="500" cy="100" r="80" fill="black"/> <!-- Ear R -->
                   <circle cx="300" cy="500" r="30" fill="#ffeb3b"/> <!-- Button -->
                   <circle cx="300" cy="400" r="30" fill="#ffeb3b"/> <!-- Button -->
                   <rect x="0" y="300" width="600" height="300" fill="#f44336"/> <!-- Shorts overlay -->
                   <circle cx="200" cy="450" r="40" fill="#ffeb3b"/>
                   <circle cx="400" cy="450" r="40" fill="#ffeb3b"/>
                   <path d="M0 300 Q 300 400 600 300" fill="none" stroke="black" stroke-width="5"/>`
    },
    // 60. Pocket Monster (Pikachu)
    {
        id: 'frame60', w: 540, h: 960, bg: '#ffeb3b', // Yellow
        slots: [{ x: 40, y: 200, w: 460, h: 560 }],
        decor: (s) => `<path d="M0 0 L150 0 L50 200 Z" fill="#ffeb3b"/> <!-- Ear L -->
                   <path d="M540 0 L390 0 L490 200 Z" fill="#ffeb3b"/> <!-- Ear R -->
                   <circle cx="80" cy="850" r="40" fill="#f44336"/> <!-- Red Cheek -->
                   <circle cx="460" cy="850" r="40" fill="#f44336"/> <!-- Red Cheek -->
                   <path d="M220 850 Q 270 880 320 850" fill="none" stroke="black" stroke-width="5"/> <!-- Mouth -->
                   <text x="270" y="150" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="60" fill="#000">Pika!</text>`
    },
    // 61. Sponge Under Sea
    {
        id: 'frame61', w: 600, h: 600, bg: '#fff176', // Sponge Yellow
        slots: [{ x: 50, y: 50, w: 500, h: 500, rx: 20 }],
        decor: (s) => `<circle cx="50" cy="50" r="10" fill="#fdd835"/><circle cx="550" cy="550" r="20" fill="#fdd835"/>
                   <circle cx="500" cy="100" r="15" fill="#fdd835"/><circle cx="100" cy="500" r="25" fill="#fdd835"/>
                   <rect x="0" y="550" width="600" height="50" fill="#795548"/> <!-- Pants -->
                   <rect x="0" y="500" width="600" height="50" fill="white"/> <!-- Shirt -->
                   <rect x="250" y="500" width="100" height="100" fill="#f44336"/> <!-- Tie -->`
    },
    // 62. Robot Cat (Doraemon)
    {
        id: 'frame62', w: 600, h: 600, bg: '#2196f3', // Blue
        slots: [{ x: 100, y: 100, w: 400, h: 400, rx: 200 }],
        decor: (s) => `<rect x="0" y="500" width="600" height="100" fill="white"/> <!-- Belly -->
                   <path d="M100 500 Q 300 600 500 500" fill="none" stroke="#d50000" stroke-width="20"/> <!-- Collar -->
                   <circle cx="300" cy="550" r="40" fill="#ffeb3b" stroke="#333" stroke-width="2"/> <!-- Bell -->
                   <line x1="280" y1="550" x2="320" y2="550" stroke="#333" stroke-width="2"/>`
    },
    // 63. Sugar Spice (Powerpuff)
    {
        id: 'frame63', w: 540, h: 960, bg: '#fce4ec',
        slots: [{ x: 50, y: 180, w: 440, h: 600 }],
        decor: (s) => `<rect x="0" y="0" width="180" height="150" fill="#f8bbd0"/>
                   <rect x="180" y="0" width="180" height="150" fill="#b3e5fc"/>
                   <rect x="360" y="0" width="180" height="150" fill="#c8e6c9"/>
                   <text x="270" y="100" text-anchor="middle" font-family="cursive" font-weight="bold" font-size="40" fill="#e91e63">GIRL POWER</text>
                   <path d="M20 900 L270 940 L520 900" fill="none" stroke="#e91e63" stroke-width="5"/>`
    },
    // 64. Friendly Spider
    {
        id: 'frame64', w: 540, h: 960, bg: '#d50000',
        slots: [{ x: 40, y: 40, w: 460, h: 880 }],
        decor: (s) => `<line x1="0" y1="0" x2="540" y2="960" stroke="#333" stroke-width="2"/>
                   <line x1="540" y1="0" x2="0" y2="960" stroke="#333" stroke-width="2"/>
                   <!-- Web Rings -->
                   <circle cx="270" cy="480" r="100" fill="none" stroke="#333" stroke-width="2"/>
                   <circle cx="270" cy="480" r="200" fill="none" stroke="#333" stroke-width="2"/>
                   <circle cx="270" cy="480" r="300" fill="none" stroke="#333" stroke-width="2"/>
                   <rect x="0" y="800" width="540" height="160" fill="#1e88e5"/>`
    },
    // 65. Hello Kitty Inspired
    {
        id: 'frame65', w: 600, h: 600, bg: 'white',
        slots: [{ x: 100, y: 150, w: 400, h: 350, rx: 50 }],
        decor: (s) => `<path d="M50 50 L100 150 L0 150 Z" fill="white" stroke="#333" stroke-width="5"/> <!-- Ear L -->
                   <path d="M550 50 L500 150 L600 150 Z" fill="white" stroke="#333" stroke-width="5"/> <!-- Ear R -->
                   <path d="M450 50 Q 500 0 550 50 Q 500 100 450 50" fill="#ff1744" stroke="black" stroke-width="3"/> <!-- Bow Bit 1 -->
                   <path d="M350 50 Q 400 0 450 50 Q 400 100 350 50" fill="#ff1744" stroke="black" stroke-width="3"/> <!-- Bow Bit 2 -->
                   <circle cx="450" cy="50" r="30" fill="#ff1744" stroke="black" stroke-width="3"/>
                   <circle cx="300" cy="450" r="15" fill="#ffeb3b" stroke="black" stroke-width="2"/> <!-- Nose -->
                   <line x1="100" y1="450" x2="200" y2="440" stroke="black" stroke-width="4"/>
                   <line x1="100" y1="480" x2="200" y2="490" stroke="black" stroke-width="4"/>
                   <line x1="400" y1="440" x2="500" y2="450" stroke="black" stroke-width="4"/>
                   <line x1="400" y1="490" x2="500" y2="480" stroke="black" stroke-width="4"/>`
    }
];

frames.forEach(f => {
    let maskContent = `<rect width="100%" height="100%" fill="white"/>`;
    f.slots.forEach(slot => {
        maskContent += `<rect x="${slot.x}" y="${slot.y}" width="${slot.w}" height="${slot.h}" rx="${slot.rx || 0}" fill="black"/>`;
    });

    const svg = `<svg width="${f.w}" height="${f.h}" viewBox="0 0 ${f.w} ${f.h}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <mask id="m-${f.id}">
      ${maskContent}
    </mask>
  </defs>
  <rect width="100%" height="100%" fill="${f.bg}" mask="url(#m-${f.id})"/>
  ${f.decor ? f.decor() : ''}
</svg>`;

    fs.writeFileSync(f.id + '.svg', svg);
    console.log('Created ' + f.id + '.svg');
});
