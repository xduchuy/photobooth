const fs = require('fs');

const frames = [
    // 36. Retro OS Window (9:16)
    {
        id: 'frame36', w: 540, h: 960, bg: '#008080',
        slots: [{ x: 20, y: 60, w: 500, h: 880 }],
        decor: (s) => `<rect x="20" y="20" width="500" height="40" fill="#000080"/>
                   <text x="30" y="48" fill="white" font-family="monospace" font-weight="bold" font-size="20">My_Photo.bmp</text>
                   <rect x="490" y="25" width="25" height="30" fill="#c0c0c0" stroke="white" stroke-width="2"/>
                   <line x1="495" y1="30" x2="510" y2="50" stroke="black" stroke-width="2"/>
                   <line x1="510" y1="30" x2="495" y2="50" stroke="black" stroke-width="2"/>
                   <rect x="20" y="60" width="500" height="880" fill="none" stroke="#c0c0c0" stroke-width="4"/>`
    },
    // 37. Handheld Console (Switch-like) (16:9)
    {
        id: 'frame37', w: 960, h: 540, bg: '#222',
        slots: [{ x: 100, y: 40, w: 760, h: 460 }],
        decor: (s) => `<rect x="0" y="0" width="100" height="540" fill="#ff5f5f"/>
                   <rect x="860" y="0" width="100" height="540" fill="#00bfff"/>
                   <circle cx="50" cy="150" r="15" fill="#333"/><circle cx="50" cy="270" r="25" fill="#333"/>
                   <circle cx="910" cy="150" r="15" fill="#333"/><circle cx="910" cy="270" r="25" fill="#333"/>`
    },
    // 38. CCTV (16:9)
    {
        id: 'frame38', w: 960, h: 540, bg: 'black',
        slots: [{ x: 0, y: 0, w: 960, h: 540 }],
        decor: (s) => `<rect x="0" y="0" width="960" height="540" fill="url(#scanlines)" opacity="0.3" pointer-events="none"/>
                   <text x="40" y="60" fill="white" font-family="monospace" font-size="30">CAM 04</text>
                   <text x="750" y="60" fill="#ff0000" font-family="monospace" font-size="30">● REC</text>
                   <text x="40" y="500" fill="white" font-family="monospace" font-size="24">2026/02/02 23:45:12</text>
                   <defs><pattern id="scanlines" patternUnits="userSpaceOnUse" width="1" height="4"><line x1="0" y1="0" x2="1" y2="0" stroke="white" stroke-width="1" opacity="0.5"/></pattern></defs>`
    },
    // 39. Porthole (1:1)
    {
        id: 'frame39', w: 600, h: 600, bg: '#dcedc8', // Submarine interior color
        slots: [{ x: 100, y: 100, w: 400, h: 400, rx: 200 }], // Circular slot
        decor: (s) => `<circle cx="300" cy="300" r="220" stroke="#546e7a" stroke-width="40" fill="none"/>
                   <circle cx="300" cy="300" r="240" stroke="#37474f" stroke-width="5" fill="none"/>
                   <circle cx="300" cy="100" r="10" fill="#b0bec5"/><circle cx="300" cy="500" r="10" fill="#b0bec5"/>
                   <circle cx="100" cy="300" r="10" fill="#b0bec5"/><circle cx="500" cy="300" r="10" fill="#b0bec5"/>`
    },
    // 40. Vinyl Record (1:1)
    {
        id: 'frame40', w: 600, h: 600, bg: '#f5f5f5',
        slots: [{ x: 50, y: 50, w: 500, h: 500 }],
        decor: (s) => `<circle cx="550" cy="300" r="200" fill="black"/> <!-- Record sticking out -->
                   <circle cx="550" cy="300" r="80" fill="#ffeb3b"/>
                   <circle cx="550" cy="300" r="10" fill="white"/>
                   <!-- Cover overlay -->
                   <rect x="50" y="50" width="400" height="500" fill="none" stroke="#333" stroke-width="2"/>
                   <text x="250" y="530" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="20">MY MIXTAPE</text>`
    },
    // 41. Instant Messenger (9:16)
    {
        id: 'frame41', w: 540, h: 960, bg: '#e0f7fa',
        slots: [{ x: 30, y: 120, w: 480, h: 680 }],
        decor: (s) => `<rect x="0" y="0" width="540" height="80" fill="#00bcd4"/>
                   <text x="30" y="50" fill="white" font-size="30" font-family="sans-serif" font-weight="bold">Friend (Online)</text>
                   <rect x="30" y="820" width="400" height="60" rx="30" fill="white" stroke="#b2ebf2"/>
                   <circle cx="480" cy="850" r="30" fill="#00bcd4"/>
                   <path d="M470 850 L480 840 L490 850" stroke="white" stroke-width="3" fill="none"/>`
    },
    // 42. Tarot Card (9:16)
    {
        id: 'frame42', w: 540, h: 960, bg: '#1a237e',
        slots: [{ x: 90, y: 150, w: 360, h: 600 }],
        decor: (s) => `<rect x="60" y="60" width="420" height="840" fill="none" stroke="#ffd700" stroke-width="6"/>
                   <text x="270" y="800" text-anchor="middle" font-family="serif" font-size="40" fill="#ffd700">THE STAR</text>
                   <text x="270" y="120" text-anchor="middle" font-family="serif" font-size="30" fill="#ffd700">XVII</text>
                   <path d="M270 900 L280 920 L270 940 L260 920 Z" fill="#ffd700"/>`
    },
    // 43. Stamp (1:1)
    {
        id: 'frame43', w: 600, h: 600, bg: '#e0e0e0', // Use a mask for serrated edges? Simulating with dots
        slots: [{ x: 80, y: 80, w: 440, h: 440 }],
        decor: (s) => `<rect x="50" y="50" width="500" height="500" rx="0" fill="white"/>
                   <rect x="40" y="40" width="520" height="520" fill="none" stroke="white" stroke-width="20" stroke-dasharray="20 20"/>
                   <text x="500" y="550" font-family="serif" font-size="40" fill="#aaa">20¢</text>`
    },
    // 44. Smartphone UI (9:16)
    {
        id: 'frame44', w: 540, h: 960, bg: 'transparent',
        slots: [{ x: 0, y: 0, w: 540, h: 960 }],
        decor: (s) => `<rect x="220" y="20" width="100" height="30" rx="15" fill="black"/> <!-- Notch -->
                   <text x="40" y="40" fill="white" font-family="sans-serif" font-size="20">12:30</text>
                   <circle cx="270" cy="850" r="40" stroke="white" stroke-width="4" fill="none"/>
                   <rect x="20" y="880" width="40" height="40" rx="5" fill="white" opacity="0.6"/>
                   <path d="M500 860 L480 880 L500 900" stroke="white" stroke-width="3" fill="none"/>`
    },
    // 45. Anime Speed Lines (16:9)
    {
        id: 'frame45', w: 960, h: 540, bg: 'white',
        slots: [{ x: 50, y: 50, w: 860, h: 440 }],
        decor: (s) => `<path d="M0 0 L480 270 L0 540 H10 L480 280 L10 0 Z" fill="black"/>
                   <path d="M960 0 L480 270 L960 540 H950 L480 280 L950 0 Z" fill="black"/>
                   <text x="80" y="480" font-size="60" fill="#f44336" font-style="italic" font-weight="bold">OSH!</text>`
    },
    // 46. Comic Book (3:4) - Multi slot
    {
        id: 'frame46', w: 540, h: 720, bg: 'white',
        slots: [
            { x: 20, y: 20, w: 240, h: 300 },
            { x: 280, y: 20, w: 240, h: 300 },
            { x: 20, y: 340, w: 500, h: 360 }
        ],
        decor: (s) => `<rect x="10" y="10" width="520" height="700" fill="none" stroke="black" stroke-width="4"/>
                   <line x1="270" y1="20" x2="270" y2="320" stroke="black" stroke-width="4"/>
                   <line x1="20" y1="330" x2="520" y2="330" stroke="black" stroke-width="4"/>
                   <path d="M400 650 L450 630 L430 680 L480 660 L460 710 Z" fill="#ffeb3b" stroke="black"/>
                   <text x="420" y="680" font-weight="bold" font-size="20">BAM!</text>`
    },
    // 47. Sketchbook (1:1)
    {
        id: 'frame47', w: 600, h: 600, bg: '#fff9c4',
        slots: [{ x: 80, y: 50, w: 480, h: 500 }],
        decor: (s) => `<path d="M40 0 V600" stroke="#999" stroke-width="2"/>
                   <circle cx="20" cy="50" r="10" fill="#333"/><circle cx="20" cy="150" r="10" fill="#333"/>
                   <circle cx="20" cy="250" r="10" fill="#333"/><circle cx="20" cy="350" r="10" fill="#333"/>
                   <path d="M10 50 Q 0 100 10 150 Q 30 100 10 50" fill="none" stroke="#666" stroke-width="3"/> <!-- Coil -->
                   <text x="500" y="580" font-family="cursive" font-size="24" fill="#555">My Sketch</text>`
    },
    // 48. Neon Bar (3:4)
    {
        id: 'frame48', w: 540, h: 720, bg: '#121212',
        slots: [{ x: 40, y: 150, w: 460, h: 530 }],
        decor: (s) => `<rect x="30" y="140" width="480" height="550" rx="20" fill="none" stroke="#ff00ff" stroke-width="4" filter="url(#glow)"/>
                   <text x="270" y="100" text-anchor="middle" font-family="cursive" font-size="60" fill="#00e5ff" stroke="#00e5ff" stroke-width="1">OPEN</text>
                   <defs><filter id="glow"><feGaussianBlur stdDeviation="3" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`
    },
    // 49. Wanted Cyber (9:16)
    {
        id: 'frame49', w: 540, h: 960, bg: '#000',
        slots: [{ x: 40, y: 200, w: 460, h: 500 }],
        decor: (s) => `<rect x="30" y="190" width="480" height="520" fill="none" stroke="#00ff00" stroke-width="2"/>
                   <text x="270" y="100" text-anchor="middle" font-family="monospace" fill="#00ff00" font-size="40" letter-spacing="5">TARGET</text>
                   <text x="270" y="150" text-anchor="middle" font-family="monospace" fill="red" font-size="30">LOCATED</text>
                   <rect x="0" y="0" width="540" height="960" fill="url(#grid)" opacity="0.2" pointer-events="none"/>`
    },
    // 50. Playing Card (3:4)
    {
        id: 'frame50', w: 540, h: 720, bg: 'white',
        slots: [{ x: 80, y: 100, w: 380, h: 520 }],
        decor: (s) => `<text x="50" y="60" font-size="50" fill="black">A</text><text x="50" y="100" font-size="40" fill="black">♠</text>
                   <text x="490" y="660" font-size="50" fill="black" transform="rotate(180 490 660)">A</text>
                   <text x="490" y="620" font-size="40" fill="black" transform="rotate(180 490 620)">♠</text>
                   <rect x="80" y="100" width="380" height="520" fill="none" stroke="black" stroke-width="2"/>`
    },
    // 51. Ticket Stub (16:9)
    {
        id: 'frame51', w: 960, h: 540, bg: '#fff3e0',
        slots: [{ x: 250, y: 40, w: 660, h: 460 }],
        decor: (s) => `<path d="M200 0 V540" stroke="black" stroke-width="2" stroke-dasharray="10 5"/>
                   <text x="100" y="270" text-anchor="middle" font-size="30" transform="rotate(-90 100 270)" font-family="monospace" fill="#bf360c">ADMIT ONE</text>
                   <text x="300" y="520" font-family="monospace" font-size="20">ROW: A  SEAT: 1</text>
                   <circle cx="200" cy="0" r="20" fill="#333"/><circle cx="200" cy="540" r="20" fill="#333"/>`
    },
    // 52. Browser Window (4:3) -> 960x720
    {
        id: 'frame52', w: 960, h: 720, bg: '#f1f1f1',
        slots: [{ x: 0, y: 80, w: 960, h: 640 }],
        decor: (s) => `<rect width="960" height="80" fill="#ddd"/>
                   <circle cx="30" cy="40" r="10" fill="#ff5f56"/>
                   <circle cx="60" cy="40" r="10" fill="#ffbd2e"/>
                   <circle cx="90" cy="40" r="10" fill="#27c93f"/>
                   <rect x="130" y="20" width="600" height="40" rx="5" fill="white"/>
                   <text x="150" y="45" font-family="sans-serif" font-size="16" fill="#777">https://photobooth.studio</text>`
    },
    // 53. Billboard (1:1)
    {
        id: 'frame53', w: 600, h: 600, bg: '#42a5f5',
        slots: [{ x: 50, y: 50, w: 500, h: 300 }], // Top billboard
        decor: (s) => `<rect x="250" y="350" width="100" height="250" fill="#616161"/> <!-- Pole -->
                   <rect x="40" y="40" width="520" height="320" fill="none" stroke="#212121" stroke-width="10"/>
                   <text x="300" y="420" text-anchor="middle" fill="white" font-weight="bold" font-size="30">YOUR AD HERE</text>`
    },
    // 54. Fish Eye Lens (1:1) - Simulated via circular mask and distortion overlay
    {
        id: 'frame54', w: 600, h: 600, bg: 'black',
        slots: [{ x: 0, y: 0, w: 600, h: 600, rx: 300 }],
        decor: (s) => `<circle cx="300" cy="300" r="300" fill="url(#grad2)" opacity="0.4" pointer-events="none"/>
                   <defs><radialGradient id="grad2"><stop offset="80%" stop-color="transparent"/><stop offset="100%" stop-color="black"/></radialGradient></defs>`
    },
    // 55. Receipt (9:16)
    {
        id: 'frame55', w: 540, h: 960, bg: 'white',
        slots: [{ x: 40, y: 200, w: 460, h: 460 }],
        decor: (s) => `<text x="270" y="80" text-anchor="middle" font-family="monospace" font-size="30">RECEIPT</text>
                   <text x="40" y="120" font-family="monospace" font-size="16">ITEM: MEMORIES ... $99.00</text>
                   <text x="40" y="150" font-family="monospace" font-size="16">TAX: LOVE ...... $00.00</text>
                   <line x1="20" y1="180" x2="520" y2="180" stroke="black" stroke-dasharray="5 5"/>
                   <line x1="20" y1="680" x2="520" y2="680" stroke="black" stroke-dasharray="5 5"/>
                   <text x="270" y="720" text-anchor="middle" font-family="monospace" font-size="20">THANK YOU!</text>
                   <path d="M0 960 L20 940 L40 960 L60 940 L80 960 L100 940 L120 960 L140 940 L160 960 L180 940 L200 960 L220 940 L240 960 L260 940 L280 960 L300 940 L320 960 L340 940 L360 960 L380 940 L400 960 L420 940 L440 960 L460 940 L480 960 L500 940 L520 960 L540 940" fill="white" stroke="none"/>`
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
