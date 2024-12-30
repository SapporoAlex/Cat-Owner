// Canvas setup
const canvas = document.getElementById("crazy-cat-lady-canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
canvas.width = 450;
canvas.height = 450;

// declaring variables
let time: number = 6; // 24 hr day cycle
let tensOfMins: number = 0;
let mins: number = 0; // for the mins
let numberOfCats: number = 0; // start with zero
let cats: Cat[] = [];
let days: number = 0;
let updateTimer: number = 1000;
let lastUpdate: number = 0;
let dayTime: number = 108000;

let lastFrameTime = performance.now();
let lastDayTime = performance.now();
let lastTimeUpdate = performance.now();
let lastTensOfMinsUpdate = performance.now();
let lastMinsUpdate = performance.now();
let lastCatUpdate = performance.now();


// cat class
class Cat {
    health: number;
    age: number;
    facing: "left" | "right";
    xpos: number;
    ypos: number;
    sick: boolean;
    injured: boolean;
    ateRecently: boolean;
    hungry: boolean;
    angry: boolean;
    sad: boolean;
    scared: boolean;
    sleeping: boolean;
    speed: number;
    direction: number;
    color: string;
    state: string;
    images: { [state: string]: HTMLImageElement[] };
    frameIndex: number;
    lastFrameTime: number;

    private moveCooldown: number = 2000; // 2 seconds cooldown
    private lastMoveTime: number = 0; // Track the last time the cat moved

    constructor() {
        this.health = 100;
        this.age = 0;
        this.facing = Math.random() > 0.5 ? "left" : "right";
        this.xpos = Math.random() * canvas.width;
        this.ypos = Math.random() * canvas.height;
        this.sick = false;
        this.injured = false;
        this.ateRecently = false;
        this.hungry = false;
        this.angry = false;
        this.sad = false;
        this.scared = false;
        this.sleeping = false;
        this.speed = 0.002;
        this.direction = 4; // stationary by default
        this.state = "walkleft";
        this.color = this.randomColor();
        this.images = {};
        this.frameIndex = 0;
        this.lastFrameTime = 0;
        this.loadImages();
    }

    randomColor(): string {
        // const colors = ["white", "black", "pink", "brown", "grey", "blue", "orange", "red", "yellow", "purple"];
        // return colors[Math.floor(Math.random() * colors.length)];
        return "white";
    }

    loadImages(): void {
        const states = ["stand", "walkleft", "walkright", "sleep", "sick", "injured", "scared", "hungry"];
        states.forEach((state) => {
            this.images[state] = [];
            for (let i = 1; i <= 2; i++) { // Assuming 2 frames per state
                const img = new Image();
                img.src = `assets/img/${this.color}${state}${i}.png`;
                this.images[state].push(img);
            }
        });
    }

    // This changes the cat's direction every 2 mins
    redirectCat(): void {
        const currentTime = Date.now();
        // Check if enough time has passed for the cooldown
        if (currentTime - this.lastMoveTime > this.moveCooldown) {
            // Randomly choose a direction to move
            this.direction = Math.floor(Math.random() * 5); // 0 = left, 1 = right, 2 = up, 3 = down
            console.log(this.direction);
            // Update the last move time to prevent moving again too soon
            this.lastMoveTime = currentTime;
        }
    }

    drawCat(): void {
        const now = performance.now();

        // Update animation frame every 500ms
        if (now - this.lastFrameTime > 500) {
            this.frameIndex = (this.frameIndex + 1) % this.images[this.state].length;
            this.lastFrameTime = now;
        }

        const image = this.images[this.state][this.frameIndex];
        if (image.complete && image.width > 0) {
            ctx.drawImage(image, this.xpos, this.ypos, 25, 25);
            }
            ctx.restore();
        if (this.direction == 0) {// Move left
            if (this.xpos <= 0) {
                this.xpos = this.xpos + 10;
                this.direction = 4;
            } else {
                this.state = "walkleft";
                this.facing = "left";
                this.xpos -= this.speed;
            }
        }

        if (this.direction ==  1) { // Move right
            if (this.xpos >= canvas.width - 50) {
                this.xpos = canvas.width - 50;
                this.direction = 4;
            } else {
                this.state = "walkright";
                this.facing = "right";
                this.xpos += this.speed;
            }
        }

        if (this.direction == 2) {// Move up
            if (this.ypos <= 0) {
                this.ypos = this.ypos + 10;
                this.direction = 4;
            } else {
                this.ypos -= this.speed;
            }

        }

        if (this.direction == 3) { // Move down
            if (this.ypos >= canvas.height - 25) {
                this.ypos = this.ypos - 25;
                this.direction = 4;
            } else {
                this.xpos += this.speed;
            }
        }

        if (this.direction == 4) {// don't move
                this.xpos = this.xpos;
                this.ypos = this.ypos;
                this.direction = 4;
        }
    }
    

    ageCat(): void {
        this.age++;
    }

    agingCat(): void {
        const aging: number = Math.random() * 5;
        if (this.age > 90) {
            this.health -= aging;
        }
    }

    getHungry(): void {
        const hungerPangs = Math.random() * 5;
        if (!this.ateRecently && hungerPangs > 1) {
            this.hungry = true;
        }
    }
}


function draw(): void {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas to avoid overlapping

    // Update and draw each cat
    cats.forEach((cat: Cat) => {
        cat.drawCat();
    });

    // Draw time and cat count
    ctx.font = "14px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(`Time: ${time}:${tensOfMins}${mins}`, 70, 15);
    ctx.fillText(`Day: ${days}`, 150, 15);
    ctx.fillText(`Cats: ${numberOfCats}`, 10, 15);

    // Repeat draw function for animation
    requestAnimationFrame(draw);
}

// Daily update for cat statuses
function dailyUpdate(): void {
    addCat();
    days++;
    cats.forEach((cat: Cat) => {
        cat.ageCat();
        cat.agingCat();
        cat.getHungry();
    });
}

// Add a new cat
function addCat(): void {
    const newCat = new Cat();
    cats.push(newCat);
    numberOfCats++;
    console.log(`Added cat: Total cats = ${numberOfCats}`);
}

// Update cats, check if they can move
function updateCats(): void {
        randomMove();
}

// Randomly move cats
function randomMove(): void {
    cats.forEach((cat: Cat) => {
        // Make the cat move if it's not sleeping, sick, injured, or scared
        if (!cat.sleeping && !cat.sick && !cat.injured && !cat.scared) {
            cat.redirectCat();
        }
        console.log(`x:${cat.xpos} & y:${cat.ypos}`)
    });
}

// Adjust canvas for device pixel ratio
function adjustCanvasForDPR(canvas: HTMLCanvasElement) {
    const dpr = window.devicePixelRatio || 1;

    // Save CSS size (logical pixels)
    const logicalWidth = canvas.width;
    const logicalHeight = canvas.height;

    // Set canvas dimensions to match DPR
    canvas.width = logicalWidth * dpr;
    canvas.height = logicalHeight * dpr;

    // Scale canvas context
    const ctx = canvas.getContext("2d");
    if (ctx) {
        ctx.scale(dpr, dpr);
    }

    // Restore CSS size to ensure consistent display size
    canvas.style.width = `${logicalWidth}px`;
    canvas.style.height = `${logicalHeight}px`;
}


function gameLoop(timestamp: number) {
    const elapsed = timestamp - lastFrameTime; // Time since the last frame
    lastFrameTime = timestamp;


    // Clear and redraw the canvas
    ctx.fillStyle = 'darkblue';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw all cats
    updateCats();
    draw();




    // EVERY DAY
    // Add daily updates (e.g., adding a new cat, aging, hunger)
    if (timestamp - lastDayTime >= dayTime) {
        dailyUpdate();
        lastDayTime = timestamp;
    }

    // EVERY HOUR
    // Update time
    if (timestamp - lastTimeUpdate >= 6000) {
        time = (time + 1) % 24; // Increment hour
        lastTimeUpdate = timestamp;
        addCat();
    }

    // EVERY 10 MINS
    if (timestamp - lastTensOfMinsUpdate >= 1000) {
        tensOfMins = (tensOfMins + 1) % 6; // Increment tens of minutes
        lastTensOfMinsUpdate = timestamp;
    }

    // EVERY 2 MINS
    // Update cats' movement
    if (timestamp - lastCatUpdate >= 200) {
        lastCatUpdate = timestamp;
    }

    //EVERY MIN
    if (timestamp - lastMinsUpdate >= 100) {
        mins = (mins + 1) % 10; // Increment minutes
        lastMinsUpdate = timestamp;
    }
    // Request the next frame
    requestAnimationFrame(gameLoop);
}

adjustCanvasForDPR(canvas);
// Start the game loop
gameLoop(performance.now());