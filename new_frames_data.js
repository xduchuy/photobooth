const NEW_FRAMES = [
    // Frame 16: Magazine Cover (9:16)
    {
        id: "frame16", name: "Vogue Cover", src: "frame16.svg", ratio: "9-16",
        slots: [{ x: 0, y: 0, width: 540, height: 720 }] // Full bleed photo behind
    },
    // Frame 17: Wanted Poster (9:16)
    {
        id: "frame17", name: "Wanted Poster", src: "frame17.svg", ratio: "9-16",
        slots: [{ x: 90, y: 220, width: 360, height: 330 }]
    },
    // Frame 18: Tamagotchi (1:1)
    {
        id: "frame18", name: "Digital Pet", src: "frame18.svg", ratio: "1-1",
        slots: [{ x: 180, y: 180, width: 240, height: 240 }]
    },
    // Frame 19: CD Cover (1:1)
    {
        id: "frame19", name: "Album Art", src: "frame19.svg", ratio: "1-1",
        slots: [{ x: 20, y: 20, width: 560, height: 560 }]
    },
    // Frame 20: Phone Interface (9:16)
    {
        id: "frame20", name: "Social Live", src: "frame20.svg", ratio: "9-16",
        slots: [{ x: 0, y: 60, width: 540, height: 900 }]
    },
    // Frame 21: Scrapbook (4:3) -> using 3:4 or 4:3. Let's do 3:4 vertical.
    {
        id: "frame21", name: "Scrapbook", src: "frame21.svg", ratio: "3-4",
        slots: [{ x: 50, y: 80, width: 440, height: 500 }]
    },
    // Frame 22: Rainy Window (9:16)
    {
        id: "frame22", name: "Rainy Mood", src: "frame22.svg", ratio: "9-16",
        slots: [{ x: 20, y: 20, width: 500, height: 920 }]
    },
    // Frame 23: Heart Locket (1:1)
    {
        id: "frame23", name: "Locket", src: "frame23.svg", ratio: "1-1",
        slots: [{ x: 100, y: 100, width: 400, height: 380 }] // Needs manual tweaking for heart shape in mind
    },
    // Frame 24: Grid 4x (Square 1:1) - 4 slots
    {
        id: "frame24", name: "Grid 4x", src: "frame24.svg", ratio: "1-1",
        slots: [
            { x: 10, y: 10, width: 285, height: 285 },
            { x: 305, y: 10, width: 285, height: 285 },
            { x: 10, y: 305, width: 285, height: 285 },
            { x: 305, y: 305, width: 285, height: 285 }
        ]
    },
    // Frame 25: Photo Booth Classic (9:16) - 4 Slots Vertical
    {
        id: "frame25", name: "Classic Strip 4", src: "frame25.svg", ratio: "9-16",
        slots: [
            { x: 40, y: 40, width: 460, height: 200 },
            { x: 40, y: 260, width: 460, height: 200 },
            { x: 40, y: 480, width: 460, height: 200 },
            { x: 40, y: 700, width: 460, height: 200 }
        ]
    },
    // Frame 26: Blob Shape (1:1)
    {
        id: "frame26", name: "Blob", src: "frame26.svg", ratio: "1-1",
        slots: [{ x: 50, y: 50, width: 500, height: 500 }]
    },
    // Frame 27: VHS Glitch (16:9)
    {
        id: "frame27", name: "VHS Glitch", src: "frame27.svg", ratio: "16-9",
        slots: [{ x: 50, y: 50, width: 860, height: 440 }]
    },
    // Frame 28: Newspaper (9:16)
    {
        id: "frame28", name: "Daily News", src: "frame28.svg", ratio: "9-16",
        slots: [{ x: 30, y: 150, width: 480, height: 350 }]
    },
    // Frame 29: Winter Snow (3:4) - Vertical
    {
        id: "frame29", name: "Winter", src: "frame29.svg", ratio: "3-4",
        slots: [{ x: 40, y: 40, width: 460, height: 560 }]
    },
    // Frame 30: Spooky (1:1)
    {
        id: "frame30", name: "Spooky", src: "frame30.svg", ratio: "1-1",
        slots: [{ x: 80, y: 80, width: 440, height: 440 }]
    },
    // Frame 31: Cute Cat (9:16)
    {
        id: "frame31", name: "Meow", src: "frame31.svg", ratio: "9-16",
        slots: [{ x: 50, y: 150, width: 440, height: 500 }]
    },
    // Frame 32: Birthday (1:1)
    {
        id: "frame32", name: "HBD", src: "frame32.svg", ratio: "1-1",
        slots: [{ x: 50, y: 50, width: 500, height: 500 }]
    },
    // Frame 33: Wanted Dead/Alive Wide (16:9)
    {
        id: "frame33", name: "Western Wide", src: "frame33.svg", ratio: "16-9",
        slots: [{ x: 300, y: 100, width: 360, height: 340 }] // Offset
    },
    // Frame 34: Breaking News (16:9)
    {
        id: "frame34", name: "Breaking News", src: "frame34.svg", ratio: "16-9",
        slots: [{ x: 0, y: 0, width: 960, height: 540 }] // Full bg
    },
    // Frame 35: Museum Gold (3:4)
    {
        id: "frame35", name: "Museum", src: "frame35.svg", ratio: "3-4",
        slots: [{ x: 80, y: 80, width: 380, height: 480 }]
    }
];

if (typeof window !== "undefined") {
    window.NEW_FRAMES_DATA = NEW_FRAMES;
}
