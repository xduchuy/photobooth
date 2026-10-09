const fs = require('fs');

const frames = [
    // 16. Vogue
    {
        id: 'frame16', w: 540, h: 960,
        bg: '#f0f0f0',
        slots: [{ x: 50, y: 150, w: 440, h: 760 }],
        decor: (s) => `<text x="270" y="100" text-anchor="middle" font-family="serif" font-weight="bold" font-size="80" fill="red">VOGUE</text>`
    },
    // 17. Wanted
    {
        id: 'frame17', w: 540, h: 960,
        bg: '#eaddcf',
        slots: [{ x: 90, y: 220, w: 360, h: 360 }],
        decor: (s) => `<text x="270" y="150" text-anchor="middle" font-family="serif" font-weight="bold" font-size="60" fill="#5c4b37">WANTED</text><text x="270" y="700" text-anchor="middle" font-family="serif" font-size="30" fill="#5c4b37">$50,000 REWARD</text>`
    },
    // 18. Digital Pet (1:1)
    {
        id: 'frame18', w: 600, h: 600,
        bg: '#ffb7b2',
        slots: [{ x: 180, y: 180, w: 240, h: 240 }],
        decor: (s) => `<path d="M300 100 C 150 100 100 200 100 300 C 100 500 200 550 300 550 C 400 550 500 500 500 300 C 500 200 450 100 300 100" fill="none" stroke="white" stroke-width="15"/>
                   <circle cx="150" cy="500" r="20" fill="white"/> <circle cx="300" cy="520" r="20" fill="white"/> <circle cx="450" cy="500" r="20" fill="white"/>`
    },
    // 19. Album Art (1:1)
    {
        id: 'frame19', w: 600, h: 600,
        bg: '#111',
        slots: [{ x: 25, y: 25, w: 550, h: 550 }],
        decor: (s) => `<rect x="420" y="520" width="150" height="50" fill="white"/><text x="495" y="550" text-anchor="middle" font-size="12" font-family="Arial" font-weight="bold">PARENTAL ADVISORY</text>`
    },
    // 20. Social Live (9:16)
    {
        id: 'frame20', w: 540, h: 960,
        bg: 'transparent',
        slots: [{ x: 0, y: 60, w: 540, h: 900 }], // Mostly transparent overlay
        decor: (s) => `<rect width="100%" height="80" fill="linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)"/>
                   <rect x="20" y="20" width="60" height="30" rx="4" fill="#ff0040"/>
                   <text x="50" y="40" text-anchor="middle" fill="white" font-weight="bold" font-family="sans-serif" font-size="16">LIVE</text>
                   <circle cx="40" cy="880" r="20" fill="rgba(255,255,255,0.2)" stroke="white" stroke-width="2"/>
                   <path d="M500 880 L480 870 V890 Z" fill="white"/>`
    },
    // 21. Scrapbook (3:4)
    {
        id: 'frame21', w: 540, h: 720,
        bg: '#fdf6e3',
        slots: [{ x: 50, y: 50, w: 440, h: 620 }],
        decor: (s) => `<rect x="220" y="20" width="100" height="30" fill="rgba(220,180,180,0.5)" transform="rotate(-3 270 35)"/>`
    },
    // 22. Rainy Mood (9:16)
    {
        id: 'frame22', w: 540, h: 960,
        bg: '#37474f',
        slots: [{ x: 20, y: 20, w: 500, h: 920 }],
        decor: (s) => `<text x="50" y="80" font-family="sans-serif" fill="#90a4ae" font-size="40">🌧</text>`
    },
    // 23. Locket (1:1)
    {
        id: 'frame23', w: 600, h: 600,
        bg: '#f8bbd0',
        slots: [{ x: 100, y: 100, w: 400, h: 400 }],
        decor: (s) => `<path d="M300 550 C 100 400 50 250 50 150 C 50 50 200 0 300 100 C 400 0 550 50 550 150 C 550 250 500 400 300 550" fill="none" stroke="#d81b60" stroke-width="20"/>`
    },
    // 24. Grid 4x (1:1)
    {
        id: 'frame24', w: 600, h: 600,
        bg: 'white',
        slots: [
            { x: 10, y: 10, w: 285, h: 285 },
            { x: 305, y: 10, w: 285, h: 285 },
            { x: 10, y: 305, w: 285, h: 285 },
            { x: 305, y: 305, w: 285, h: 285 }
        ],
        decor: (s) => ``
    },
    // 25. Classic Strip 4 (9:16)
    {
        id: 'frame25', w: 540, h: 960,
        bg: 'white',
        slots: [
            { x: 40, y: 40, w: 460, h: 200 },
            { x: 40, y: 260, w: 460, h: 200 },
            { x: 40, y: 480, w: 460, h: 200 },
            { x: 40, y: 700, w: 460, h: 200 }
        ],
        decor: (s) => ``
    },
    // 26. Blob (1:1)
    {
        id: 'frame26', w: 600, h: 600,
        bg: '#e1f5fe',
        slots: [{ x: 50, y: 50, w: 500, h: 500 }],
        decor: (s) => `<path d="M50 50 Q 300 0 550 50 Q 600 300 550 550 Q 300 600 50 550 Q 0 300 50 50" fill="none" stroke="#0288d1" stroke-width="10"/>`
    },
    // 27. VHS Glitch (16:9)
    {
        id: 'frame27', w: 960, h: 540,
        bg: '#212121',
        slots: [{ x: 50, y: 50, w: 860, h: 440 }],
        decor: (s) => `<text x="50" y="80" fill="#00e676" font-family="monospace" font-size="30">PLAY ▸</text>
                   <text x="800" y="500" fill="white" font-family="monospace" font-size="20">SP 0:02:44</text>`
    },
    // 28. Daily News (9:16)
    {
        id: 'frame28', w: 540, h: 960,
        bg: '#eeeeee',
        slots: [{ x: 30, y: 200, w: 480, h: 400 }],
        decor: (s) => `<text x="270" y="80" text-anchor="middle" font-family="serif" font-weight="900" font-size="60">THE DAILY</text>
                   <rect x="30" y="100" width="480" height="2" fill="black"/>
                   <text x="270" y="150" text-anchor="middle" font-family="serif" font-size="24">BREAKING NEWS</text>
                   <text x="30" y="640" font-family="serif" font-size="12" fill="#555">Lorem ipsum dolor sit amet...</text>`
    },
    // 29. Winter (3:4)
    {
        id: 'frame29', w: 540, h: 720,
        bg: '#e3f2fd',
        slots: [{ x: 40, y: 40, w: 460, h: 640 }],
        decor: (s) => `<text x="50" y="60" fill="white" font-size="40">❄️</text><text x="490" y="700" fill="white" font-size="40">❄️</text>`
    },
    // 30. Spooky (1:1)
    {
        id: 'frame30', w: 600, h: 600,
        bg: '#263238',
        slots: [{ x: 80, y: 80, w: 440, h: 440 }],
        decor: (s) => `<text x="300" y="550" text-anchor="middle" fill="#ff6e40" font-family="cursive" font-size="60">BOO!</text>
                   <circle cx="50" cy="50" r="10" fill="white" opacity="0.5"/>`
    },
    // 31. Meow (9:16)
    {
        id: 'frame31', w: 540, h: 960,
        bg: '#fff3e0',
        slots: [{ x: 50, y: 150, w: 440, h: 600 }],
        decor: (s) => `<path d="M50 150 L 80 100 L 110 150" fill="white" stroke="#ffcc80" stroke-width="4"/>
                   <path d="M490 150 L 460 100 L 430 150" fill="white" stroke="#ffcc80" stroke-width="4"/>
                   <text x="270" y="800" text-anchor="middle" font-size="40">MEOW</text>`
    },
    // 32. HBD (1:1)
    {
        id: 'frame32', w: 600, h: 600,
        bg: '#fffde7',
        slots: [{ x: 50, y: 50, w: 500, h: 500 }],
        decor: (s) => `<text x="300" y="580" text-anchor="middle" font-family="Comic Sans MS" font-size="40" fill="#fbc02d">HAPPY BIRTHDAY</text>`
    },
    // 33. Western Wide (16:9)
    {
        id: 'frame33', w: 960, h: 540,
        bg: '#d7ccc8',
        slots: [{ x: 300, y: 100, w: 360, h: 340 }],
        decor: (s) => `<text x="150" y="270" text-anchor="middle" font-family="serif" font-size="60" fill="#3e2723">WANTED</text>
                   <text x="810" y="270" text-anchor="middle" font-family="serif" font-size="40" fill="#3e2723">DEAD/ALIVE</text>`
    },
    // 34. Breaking News TV (16:9)
    {
        id: 'frame34', w: 960, h: 540,
        bg: 'transparent',
        slots: [{ x: 0, y: 0, w: 960, h: 540 }],
        decor: (s) => `<rect x="0" y="440" width="960" height="100" fill="#d32f2f"/>
                   <text x="120" y="500" fill="white" font-family="Arial" font-weight="bold" font-size="40">BREAKING NEWS</text>
                   <rect x="20" y="450" width="80" height="80" fill="white"/>
                   <text x="60" y="500" text-anchor="middle" fill="#d32f2f" font-weight="bold" font-size="20">LIVE</text>`
    },
    // 35. Museum (3:4)
    {
        id: 'frame35', w: 540, h: 720,
        bg: '#212121',
        slots: [{ x: 80, y: 80, w: 380, h: 480 }],
        decor: (s) => `<rect x="70" y="70" width="400" height="500" fill="none" stroke="#ffd700" stroke-width="10"/>
                   <text x="270" y="650" text-anchor="middle" font-family="serif" fill="#ffd700" font-size="16">Musee d'Art</text>`
    }
];

frames.forEach(f => {
    // Generate Mask Content
    // We want the background to be white (opaque), and the slots to be black (transparent)
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
  
  <!-- Background with mask -->
  <rect width="100%" height="100%" fill="${f.bg}" mask="url(#m-${f.id})"/>
  
  <!-- Decorations -->
  ${f.decor ? f.decor() : ''}
  
  <!-- Slot borders/Debug lines (Optional, but nice for polish) -->
  ${f.slots.map(s => `<rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" rx="${s.rx || 0}" fill="none" stroke="rgba(0,0,0,0.1)" stroke-width="2"/>`).join('')}
</svg>`;

    fs.writeFileSync(f.id + '.svg', svg);
    console.log('Created ' + f.id + '.svg');
});
