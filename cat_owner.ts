// Canvas setup
const canvas = document.getElementById("crazy-cat-lady-canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
canvas.width = 450;
canvas.height = 450;

const floor = new Image();
floor.src = `/static/cat_owner/co_assets/img/floor.png`;
floor.onload = () => {
    drawFloor();
};

// declaring variables
let time: number = 0; // 24 hr day cycle
let tensOfMins: number = 0;
let mins: number = 0; // for the mins
let days: number = 0;
let updateTimer: number = 1000;
let lastUpdate: number = 0;
let dayTime: number = 144000;
let hourTime: number = 6000;

let numberOfCats: number = 0; // start with zero
let cats: Cat[] = [];
let deadCats: number = 0;
let highestNumberOfCats: number = 0;
let oldestCat: number = 0;
let adoptedNumber: number = 0;
let bornNumber: number = 0;
let catFood: number = 1;
let rating: string = "";
let males: number = 0;
let females: number = 0;
let bowl: Bowl;

let menu: boolean = true;
let gameOver: boolean = false;
let playing: boolean = false;

// let lastFrameTime = performance.now();
let lastDayTime = performance.now();
let lastTimeUpdate = performance.now(); 
let lastHourUpdate = performance.now(); 
let lastTensOfMinsUpdate = performance.now();
let lastMinsUpdate = performance.now();
let lastCatUpdate = performance.now();
let lastFrameTime = 0;
let currentCat: Cat | null = null; // Track the currently displayed cat

const menuElement = document.getElementById("menu");
const menuTitle = document.getElementById('menu-title');
const playButton = document.getElementById('play');
const howToButton = document.getElementById('how-to');
const howToPopup = document.getElementById('how-to-popup');
const backButton = document.getElementById('back');
const disclaimer = document.getElementById('disclaimer');
const gameOverTitle = document.getElementById("game-over-title");
const eventElement = document.getElementById("event-title");
const panel = document.getElementById("panel");
const addFoodButton = document.getElementById("addFoodButton");
const adoptButton = document.getElementById("adopt");
const cleanButton = document.getElementById("clean");
const quitButton = document.getElementById("quit");
const gameOverMenu = document.getElementById("game-over-menu");
const toMenuButton = document.getElementById("to-menu");
const closeStatsButton = document.getElementById("closeStats");
const renameButton = document.getElementById("rename");

const oldestStat = document.getElementById("oldest-cat");
const highestStat = document.getElementById("highest-number-of-cats");
const adoptedStat = document.getElementById("adopted-cats");
const bornStat = document.getElementById("born-cats");
const diedStat = document.getElementById("died-cats");
const ratingStat = document.getElementById("rating");

const statsDiv = document.getElementById('catStats');
const nameElement = document.getElementById('catName');
const detailsElement = document.getElementById('catDetails');

let isDesktop = window.innerWidth > 768;
let scaleFactor = 1;

function resizeCanvas(canvas: HTMLCanvasElement, cats: Cat[]): void {
    let isDesktop = window.innerWidth > 768;
    let scaleFactor = isDesktop ? 1.3 : 1;
    canvas.width = 450 * scaleFactor;
    canvas.height = 450 * scaleFactor;
    cats.forEach((cat: Cat) => {
        let scaledx = canvas.width / 450;
        let scaledy = canvas.height / 450;
        let scaledxpos = cat.xpos * scaledx;
        let scaledypos = cat.xpos * scaledy;
        cat.xpos = scaledxpos;
        cat.ypos = scaledypos;
    })
}

window.addEventListener('resize', () => resizeCanvas(canvas, cats));
resizeCanvas(canvas, cats); // Initial setup



function showElement(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.remove('hidden');
        element.classList.add('visible');
    } else {
        console.error(`Element with ID '${elementId}' not found.`);
    }
}

function hideElement(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.remove('visible');
        element.classList.add('hidden');
    } else {
        console.error(`Element with ID '${elementId}' not found.`);
    }
}

function toggleElement(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
        if (element.classList.contains('hidden')) {
            showElement(elementId);
        } else {
            hideElement(elementId);
        }
    } else {
        console.error(`Element with ID '${elementId}' not found.`);
    }
}

if (playButton) {
    playButton.addEventListener('click', () => {
        hideElement('menu');
        showElement('panel');
        showElement('addFoodButton');
        showElement('adopt');
        showElement('clean');
        showElement('quit');
    });
}

if (quitButton) {
    quitButton.addEventListener('click', () => {
        hideElement('panel');
        hideElement('addFoodButton');
        hideElement('adopt');
        hideElement('clean');
        hideElement('quit');

        showElement('game-over-menu');
        showElement("game-over-title");
        showElement("stats");
        if (highestStat && highestNumberOfCats) {
            highestStat.textContent = `Cat High: ${highestNumberOfCats}`;
        }
        showElement("highest-number-of-cats");
        if (oldestStat && oldestCat) {
            oldestStat.textContent = `Oldest Cat: ${oldestCat}`;
        }
        showElement("oldest-cat");
        if (adoptedStat && adoptedNumber) {
            adoptedStat.textContent = `Cats Adopted: ${adoptedNumber}`;
        }
        showElement("adopted-cats");
        if (bornStat && bornNumber) {
            bornStat.textContent = `Cats Born: ${bornNumber}`;
        }
        showElement("born-cats");
        if (diedStat && deadCats) {
            diedStat.textContent = `Cats Lost: ${deadCats}`;
        }
        showElement("died-cats");
        if (ratingStat && rating) {
            ratingStat.textContent = `Rating: ${rating}`;
        }
        showElement("rating");
        showElement('to-menu');
    })
}

if (howToButton) {
    howToButton.addEventListener('click', () => {
        hideElement('how-to');
        hideElement('play');
        showElement('how-to-popup');
        showElement('back');
    });
}

if (backButton) {
    backButton.addEventListener('click', () => {
        hideElement('how-to-popup');
        hideElement('back');
        showElement('play');
        showElement('how-to');
        showElement('menu');
    });
}

if (toMenuButton) {
    toMenuButton.addEventListener('click', () => {
        resetGame();
        hideElement('game-over-menu');
        showElement('menu');
        showElement('how-to');
        showElement('menu-title');
        showElement('play');
        showElement('disclaimer');
    });
}

if (addFoodButton) {
    addFoodButton.addEventListener('click', () => {
        bowl.addFood();
    });
}

if (cleanButton) {
    cleanButton.addEventListener('click', () => {
        // Loop through the cats array in reverse to avoid skipping elements
        for (let i = cats.length - 1; i >= 0; i--) {
            if (cats[i].dead) {
                cats.splice(i, 1);  // Remove the dead cat from the array
            }
        }
    });
}

if (adoptButton) {
    adoptButton.addEventListener('click', () => {
        addCat();
    });
}

class Bowl {
    currentImageIndex: number;
    maxImages: number;
    xpos: number;
    ypos: number;
    imageBasePath: string;
    currentImage: HTMLImageElement;
    height: number;
    width: number;

    constructor() {
        this.currentImageIndex = 1; // Start with bowl1.png
        this.maxImages = 5; // Maximum number of bowl images
        this.xpos = canvas.width - 100; // Bowl's x position
        this.ypos = 100; // Bowl's y position
        this.imageBasePath = "/static/cat_owner/co_assets/img/bowl"; // Base path for images
        this.currentImage = new Image();
        this.updateBowlImage();
        this.height = 40;
        this.width = 40;
    }

    addFood() {
        if (this.currentImageIndex < this.maxImages) {
            this.currentImageIndex++;
            catFood++;
            this.updateBowlImage();
        } else {
            console.error("The bowl is full!");
        }
    }

    updateBowlImage() {
        // Construct the new image path
        const newImageSrc = `${this.imageBasePath}${this.currentImageIndex}.png`;
        this.currentImage.src = newImageSrc; // Set the new source for the Image object

        this.currentImage.onload = () => {
            // Draw the updated image on the canvas once it loads
            this.drawBowl();
        };

        this.currentImage.onerror = () => {
            console.error(`Failed to load image: ${newImageSrc}`);
        };
    }

    drawBowl() {
        let bowlscaledheight = this.height * scaleFactor;
        let bowlscaledwidth = this.width * scaleFactor;
        let bowlscaledxpos = this.xpos * scaleFactor;
        let bowlscaledypos = this.ypos * scaleFactor;
        ctx.drawImage(this.currentImage, bowlscaledxpos, bowlscaledypos, bowlscaledheight, bowlscaledwidth);
    }
}


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
    fighting: boolean;
    dead: boolean;
    scared: boolean;
    sleeping: boolean;
    sex: string;
    pregnant: boolean;
    pregnancy: number;
    energy: number;
    hunger: number;
    stress: number;
    speed: number;
    direction: number;
    color: string;
    name: string;
    state: string;
    images: { [state: string]: HTMLImageElement[] };
    frameIndex: number;
    lastFrameTime: number;
    causeOfDeath: string;
    height: number;
    width: number;

    private moveCooldown: number = 2000; // 2 seconds cooldown
    private lastMoveTime: number = 0; // Track the last time the cat moved

    constructor(options: Partial<Cat> = {}) {
        this.health = 100;
        this.age = 0;
        this.facing = Math.random() > 0.5 ? "left" : "right";
        this.xpos = Math.random() * canvas.width;
        this.ypos = Math.random() * canvas.height;
        this.sick = false;
        this.injured = false;
        this.ateRecently = true;
        this.hungry = false;
        this.fighting = false;
        this.dead = false;
        this.scared = false;
        this.sleeping = false;
        this.sex = Math.random() > 0.5 ? "male" : "female";
        this.pregnant = false;
        this.pregnancy = 0;
        this.energy = 10;
        this.hunger = 0;
        this.stress = 0;
        this.speed = 1;
        this.direction = 4; // stationary by default
        this.state = "walkleft";
        this.color = this.randomColor();
        this.name = this.randomName();
        this.images = {};
        this.frameIndex = 0;
        this.lastFrameTime = 0;
        this.loadImages();
        this.causeOfDeath = "Caticide";
        this.height = 40;
        this.width = 40;
        Object.assign(this, options);
    }

    randomColor(): string {
        const colors = ["white", "black", "brown", "orange", "yellow"];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    randomName(): string {
        const names = [
            "Pirka", "Awsesome cat name", "Freja", "Odin", "Zeus", "Let's fighting love", "Primagen", "Zelenski", 
            "Catpool", "Captain Deadpool", "Obama", "Andrew", "Alex", "Gombei", "Loki", "Thor", "Galore",
            "Arry Po'Ah!", "Cute A$$ Myama Fugga", "Doggy", "Spartan", "Anko", "Kat", "Davis", "Alice", 
            "Bob", "Charlie", "Diana", "Edward", "Fiona", "George", "Hannah", "Ian", "Jessica",
            "Kevin", "Laura", "Michael", "Nina", "Oliver", "Paula", "Quincy", "Rachel", "Sam", "Tina",
            "Uma", "Victor", "Wendy", "Xander", "Yvonne", "Zach", "Liam", "Emma", "Noah", "Ava",
            "Sophia", "James", "Mia", "Benjamin", "Amelia", "Elijah", "Isabella", "Lucas", "Harper", 
            "Mason", "Evelyn", "Logan", "Abigail", "Alexander", "Ella", "Ethan", "Aria", "Jacob", 
            "Chloe", "William", "Scarlett", "Daniel", "Grace", "Sebastian", "Zoe", "Matthew", "Emily", 
            "Jackson", "Lily", "Levi", "Madison", "Owen", "Victoria", "Henry", "Aurora", "Gabriel", 
            "Brooklyn", "Carter", "Penelope", "Wyatt", "Riley", "Dylan", "Layla", "Nathan", "Luna", 
            "Caleb", "Ellie", "Isaac", "Stella", "Andrew", "Hazel", "Joshua", "Nora", "Ryan", "Zoey", 
            "Asher", "Mila", "Julian", "Savannah", "Hunter", "Addison", "Aaron", "Hannah", "Luke", 
            "Bella", "Grayson", "Willow", "Isaiah", "Lucy", "Connor", "Paisley", "Eli", "Sophie", 
            "Landon", "Audrey", "David", "Claire", "Nathaniel", "Violet", "Christian", "Skylar", 
            "Samuel", "Peyton", "Adam", "Everly", "Elias", "Sadie", "Joseph", "Aaliyah", "Nolan", 
            "Ruby", "Anthony", "Aubrey", "Colton", "Piper", "Brayden", "Autumn", "Tyler", "Caroline", 
            "Austin", "Kennedy", "Parker", "Serenity", "Jordan", "Madeline", "Cooper", "Cora", 
            "Cameron", "Eva", "Evan", "Naomi", "Angel", "Delilah", "Dominic", "Lila", "Hudson", 
            "Jasmine", "Gavin", "Ivy", "Robert", "Isla", "Miles", "Olive", "Sawyer", "Summer", 
            "Chase", "Sienna", "Jonathan", "Eliana", "Adrian", "Genevieve", "Bentley", "Arabella", 
            "Zane", "Adalyn", "Vincent", "Alexandra", "Micah", "Allison", "Bennett", "Lilah", 
            "Maxwell", "Anastasia", "Theo", "Daisy", "Ryder", "Josephine", "Ezra", "Athena", 
            "Jaxon", "Leah", "Kai", "Margaret", "Wesley", "Juliette", "Declan", "Cecilia", 
            "Axel", "Angelina", "Roman", "Lydia", "Jasper", "Marley", "Silas", "Emery", "Xavier", 
            "Alana", "Archer", "Eden", "Calvin", "Vivian", "Jude", "Brielle", "Tristan", "Brooklynn", 
            "Elliott", "Amaya", "Finn", "Mackenzie", "Matteo", "Remi", "Holden", "Adelaide", 
            "Grant", "Camila", "Abel", "Eliza", "Malachi", "Rosalie", "Kaden", "Gabrielle", 
            "Graham", "Daniela", "August", "Malia", "Quinn", "Blake", "Tobias", "Rowan", "Zion", 
            "Sloane", "Jayden", "Rebecca", "Emmett", "Valentina", "Lincoln", "Catalina", "Brooks", 
            "Madeleine", "Maddox", "Elise", "Ellis", "Annabelle", "Beckett", "Melody", "Emerson", 
            "Felicity", "Knox", "Annalise", "Harrison", "Athena", "Maximus", "Rylee", "Reid", 
            "Mckenna", "Easton", "Mira", "Phoenix", "Alina", "Kingston", "Clementine", "Ronan", 
            "Elaina", "Atlas", "Phoebe", "Walker", "Tessa", "Enzo", "Francesca", "Cash", "Veronica", 
            "Cruz", "Georgia", "Lane", "Selena", "Hugo", "Gemma", "Porter", "Bianca", "Colby", 
            "Anaya", "Spencer", "Vivienne", "Jayce", "Ariel", "Erik", "Monica", "Brody", "Esme"
        ];
        return names[Math.floor(Math.random() * names.length)];
    }
    

    loadImages(): void {
        const states = ["stand", "walkleft", "walkright", "sleep", "sick", "dead", "fighting"];
        states.forEach((state) => {
            this.images[state] = [];
            for (let i = 1; i <= 2; i++) { // Assuming 2 frames per state
                const img = new Image();
                img.src = `/static/cat_owner/co_assets/img/${this.color}${state}${i}.png`;
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
            // Update the last move time to prevent moving again too soon
            this.lastMoveTime = currentTime;
        }
    }

    drawCat(): void {
        const now = performance.now();
    
        // Update animation frame every 500ms
        if (now - this.lastFrameTime > 250) {
            this.frameIndex = (this.frameIndex + 1) % this.images[this.state].length;
            this.lastFrameTime = now;
        }
    
        const image = this.images[this.state][this.frameIndex];
        if (image.complete && image.width > 0) {
            let scaledx = canvas.width / 450;
            let scaledy = canvas.height / 450;
            let scaledheight = this.height * scaledx;
            let scaledwidth = this.width * scaledy;
            ctx.drawImage(image, this.xpos, this.ypos, scaledheight, scaledwidth);
        }
    
        if (this.sick) {
            this.state = "sick";
        }

        if (this.dead) {
            this.state = "dead";
        }

        if (this.sleeping) {
            this.state = "sleep";
        }
        
        else if (!this.fighting && !this.sleeping && !this.dead && !this.hungry && !this.injured && !this.sick && !this.scared) {
            // Regular Movement logic
            if (this.direction == 0) { // Move left
                if (this.xpos <= 0) {
                    this.direction = 4; // Stop if at left boundary
                } else {
                    this.state = "walkleft";
                    this.facing = "left";
                    this.xpos -= this.speed;
                }
            } else if (this.direction == 1) { // Move right
                if (this.xpos >= canvas.width - 50) {
                    this.direction = 4; // Stop if at right boundary
                } else {
                    this.state = "walkright";
                    this.facing = "right";
                    this.xpos += this.speed;
                }
            } else if (this.direction == 2) { // Move up
                if (this.ypos <= 0) {
                    this.direction = 4; // Stop if at top boundary
                } else {
                    this.state = "walkleft";
                    this.facing = "left";
                    this.ypos -= this.speed;
                }
            } else if (this.direction == 3) { // Move down
                if (this.ypos >= canvas.height - 50) { // Adjust for cat's height
                    this.direction = 4; // Stop if at bottom boundary
                } else {
                    this.state = "walkright";
                    this.facing = "right";
                    this.ypos += this.speed; // Correctly update ypos
                }
            } else if (this.direction == 4) { // Stop moving
                this.state = "stand";
                // No update needed; cat stays in place
            } if (this.xpos > canvas.width) {
                this.xpos = canvas.width - 100;
            } if (this.ypos > canvas.height) {
                this.ypos = canvas.height - 100;
            } 
            // old
            if (!this.fighting && !this.sleeping && !this.dead && !this.hungry && !this.injured && !this.sick && !this.scared && this.age > 10) {
                if (this.direction == 0) { // Move left
                    if (this.xpos <= 0) {
                        this.direction = 4; // Stop if at left boundary
                    } else {
                        this.state = "walkleft";
                        this.facing = "left";
                        this.xpos -= this.speed / 2;
                    }
                } else if (this.direction == 1) { // Move right
                    if (this.xpos >= canvas.width - 50) {
                        this.direction = 4; // Stop if at right boundary
                    } else {
                        this.state = "walkright";
                        this.facing = "right";
                        this.xpos += this.speed / 2;
                    }
                } else if (this.direction == 2) { // Move up
                    if (this.ypos <= 0) {
                        this.direction = 4; // Stop if at top boundary
                    } else {
                        this.state = "walkleft";
                        this.facing = "left";
                        this.ypos -= this.speed / 2;
                    }
                } else if (this.direction == 3) { // Move down
                    if (this.ypos >= canvas.height - 50) { // Adjust for cat's height
                        this.direction = 4; // Stop if at bottom boundary
                    } else {
                        this.state = "walkright";
                        this.facing = "right";
                        this.ypos += this.speed / 2; // Correctly update ypos
                    }
                } else if (this.direction == 4) { // Stop moving
                    this.state = "stand";
                    // No update needed; cat stays in place
                } if (this.xpos > canvas.width) {
                    this.xpos = canvas.width - 100;
                } if (this.ypos > canvas.height) {
                    this.ypos = canvas.height - 100;
                } 
            }
        }
        if (this.fighting && !this.dead) {
            if (this.direction == 0) { // Move left
                if (this.xpos <= 0) {
                    this.direction = 4; // Stop if at left boundary
                } else {
                    this.state = "fighting";
                    this.facing = "left";
                    this.xpos -= this.speed * 2;
                }
            } else if (this.direction == 1) { // Move right
                if (this.xpos >= canvas.width - 50) {
                    this.direction = 4; // Stop if at right boundary
                } else {
                    this.state = "fighting";
                    this.facing = "right";
                    this.xpos += this.speed * 2;
                }
            } else if (this.direction == 2) { // Move up
                if (this.ypos <= 0) {
                    this.direction = 4; // Stop if at top boundary
                } else {
                    this.state = "fighting";
                    this.facing = "left";
                    this.ypos -= this.speed * 2;
                }
            } else if (this.direction == 3) { // Move down
                if (this.ypos >= canvas.height - 50) { // Adjust for cat's height
                    this.direction = 4; // Stop if at bottom boundary
                } else {
                    this.state = "fighting";
                    this.facing = "right";
                    this.ypos += this.speed * 2; // Correctly update ypos
                }
            } else if (this.direction == 4) {
                this.state = "fighting";
            } 
        }

        if (this.hungry && !this.sleeping) {
            if (this.xpos < canvas.width - 120){
                this.xpos += this.speed;
            }
            if (this.ypos > 120) {
                this.ypos -= this.speed;
            }
        }
        
    }
    
    ageCat(): void {
        if (!this.dead) {
            this.age++;
        }
    }

    agingCat(): void {
        const aging: number = Math.random() * 20;
        if (this.age > 10) {
            this.health -= aging;
            this.energy -= aging;
        }
    }

    dieOfOld(): void {
        if (this.age > 20) {
            this.dead = Math.random() > 0.8;
            if (this.dead) {
                this.sleeping = false;
                this.causeOfDeath = "natural causes";
                numberOfCats--;
                deadCats++;
            }
        }
    }

    getFighting(): void {
        if (this.stress > 10 && !this.sleeping && !this.injured && !this.sick && !this.dead && !this.fighting) {
            this.resetState();
            this.fighting = true;
            this.stress -= Math.floor(Math.random() * 5) + 1;
        }
    }

    getStressed(): void {
        if (this.hungry || this.energy < 5 && !this.sleeping ) {
            this.stress += Math.floor(Math.random() * 3) + 1;
        }
    }

    getHungry(): void {
        if (!this.sleeping && !this.dead){
            this.hunger += Math.floor(Math.random() * 3) + 1;
            if (this.hunger > 30) {
                this.health -= 5;
                this.stress += 5;
                this.resetState();
                this.hungry = true;
                this.ateRecently = false;
        }
    }
    }

    loseEnergy(): void {
        if (!this.sleeping && !this.dead) {
            if (this.age > 10) {
                this.energy -= Math.floor(Math.random() * 6) + 1;
            } else {
                this.energy -= Math.floor(Math.random() * 3) + 1;
            }
            if (this.energy <= 1) {
                this.sleeping = true;
            }
        }
    }

    regainEnergy(): void {
        if (this.sleeping) {
            this.energy += Math.floor(Math.random() * 3) + 1;
            if (this.energy > 8) {
                this.stress = 0;
                this.health += 5;
                if (this.health > 100) {
                    this.health = 100;
                }
                this.resetState();
            }
        }
    }

    getSick(): void {
        if (this.stress > 5 && !this.sick) {
            this.sick = Math.random() > 0.7;
            if (this.sick) {
                this.resetState();
                this.sick = true;
                this.health -= 15;
            }
        if (this.sick) {
            this.health -= 10;
        }
        }
    }

    getRecovered(): void {
        if (this.sick) {
            this.sick = Math.random() > 0.5;
            if (this.sick) {
                this.health -= 5;
            }
        }
    }

    checkMating(): void {
        if (this.sex == "male") {
            males++;
        }
        if (this.sex == "female") {
            females++;
        }
    }

    getPregnant(): void {
        if (males > 0 && females > 0 && this.sex == "female" && !this.pregnant)
            this.pregnant = Math.random() > 0.9;
    }

    undergoPregnancy(): void {
        if (this.pregnant) {
            this.pregnancy++;
            this.energy - 20;
            if (this.pregnancy >= 5) {
                this.pregnant = false;
                this.pregnancy = 0;
                const mumXLoc = this.xpos;
                const mumYLoc = this.ypos;
                const randomTimes = Math.floor(Math.random() * 6) + 1;
                for (let i = 0; i < randomTimes; i++) {
                    const kitten = new Cat({
                        xpos: mumXLoc,
                        ypos: mumYLoc,
                        color: Math.random() > 0.7 ? this.color : this.randomColor(),
                    });
                    setupCatClickHandler([kitten])
                    cats.push(kitten);
                    numberOfCats++;
                    bornNumber++;
                }
                alert(`${this.name} gave birth to ${randomTimes} kittens!`);
            }
        }
    }

    getDead(): void {
        if (this.hungry && this.hunger > 50 && !this.dead) {
            this.dead = Math.random() > 0.5 ? true : false;
            if (this.dead) {
                this.causeOfDeath = "starvation";
                numberOfCats--;
                deadCats++;
                this.resetState();
                
            }
            this.health -= 10;
        }
        if (this.health <= 0 && !this.dead) {
            this.resetState();
            this.dead = true;
            this.causeOfDeath = "sickness";
            deadCats++;
            numberOfCats--;
            
        }
    }

    resetState(): void {
        this.fighting = false;
        this.scared = false;
        this.sleeping = false;
    }

    calmDown(): void {
        if (!this.sleeping && !this.dead) {
            if (this.ateRecently && this.stress > 0) {
                this.stress -= 1;
            }
            if (this.fighting) {
                this.stress -= 2;
                this.energy -= 2;
            }
            if (this.fighting && this.stress < 5) {
                this.fighting = false;
            }
            if (this.scared && this.stress > 1) {
                this.stress -= 1;
            }
        }
    }

    eat(): void {
        if (this.hungry && catFood > 0 && this.xpos > canvas.width -150 && this.ypos < 150) {
            catFood--;
            bowl.currentImageIndex = catFood;
            bowl.updateBowlImage();
            this.hunger = 0;
            this.hungry = false;
            this.stress = 0;
            this.health += 10;
            if (this.health > 100) {
                this.health = 100;
            }
            this.ateRecently = true;
        }
    }
}

function setupCatClickHandler(cats: Cat[]) {
    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        let clickedCat: Cat | undefined;

        for (const cat of cats) {
            let scaledx = canvas.width / 450;
            let scaledy = canvas.height / 450;
            if (mouseX >= (cat.xpos * scaledx) && mouseX <= (cat.xpos * scaledx) + (cat.width * scaledx) &&
                mouseY >= (cat.ypos * scaledy) && mouseY <= (cat.ypos * scaledy) + (cat.height * scaledy) ) {
                clickedCat = cat;
                break; // Exit loop when a match is found
            }
        }
        if (clickedCat) {
            currentCat = clickedCat; // Save the clicked cat for future operations
            showCatStats(clickedCat);
        }
    });
}

if (closeStatsButton) {
    closeStatsButton.addEventListener('click', () => {
        hideElement('cat-stats');
    });
}

if (renameButton) {
    renameButton.addEventListener('click', () => {
        if (currentCat) {
            const newName = prompt("Enter a new name for this cat:", currentCat.name);
            if (newName !== null && newName.trim() !== "") {
                currentCat.name = newName.trim();
                updateCatStatsUI(currentCat); // Update the stats UI
                console.log(`Cat renamed to: ${currentCat.name}`);
            }
        } else {
            console.error("No cat selected for renaming.");
        }
    });
}

function updateCatStatsUI(cat: Cat) {
    const statsElement = document.getElementById('cat-stats');
    if (statsElement) {
        statsElement.querySelector('#catName')!.textContent = `${cat.name}`;
    }
}

function showCatStats(cat: Cat) {
    showElement("cat-stats");
    showElement("catName");

    // Set the name and details
    if (nameElement) {
        nameElement.textContent = cat.name;
    }
    if (detailsElement) {
        detailsElement.innerHTML = `
<li>Age: ${cat.age}</li>
<li>Sex: ${cat.sex}</li>
<li>Health: %${Math.floor(cat.health)}</li>
<li>Energy: %${Math.floor(cat.energy * 10)}</li>
<li>State: ${cat.state}</li>
<h2 style="margin-left: -40px; text-align: center;">Conditions</h2>
<li>${cat.dead === true ? "Cause of death: " + cat.causeOfDeath : ""}</li>
<li>${cat.hunger >= 30 ? "hungry" : ""}</li>
<li>${cat.ateRecently === true ? "ate recently" : ""}</li>
<li>${cat.stress >= 5 ? "stressed" : ""}</li>
<li>${cat.energy <= 3 ? "sleepy" : ""}</li>
<li>${cat.stress <= 2 ? "happy" : ""}</li>
<li>${cat.sex === "female" ? (cat.pregnant ? "pregnant" : "") : ""}</li>
        `;
    }
    
    // Show the stats div
    if (statsDiv) {
        statsDiv.style.display = 'block';
    }
}

// Close the stats view
document.getElementById('closeStats')?.addEventListener('click', () => {
    const statsDiv = document.getElementById('cat-stats') as HTMLDivElement;
    hideElement('catStats');
});

function resetGame(): void {
    numberOfCats = 0;
    cats = [];
    deadCats = 0;
    highestNumberOfCats = 0;
    oldestCat = 0;
    adoptedNumber = 0;
    bornNumber = 0;
    catFood = 1;
    rating = "";
    males = 0;
    females = 0;
    bowl.currentImageIndex = 1;
    bowl.updateBowlImage();
    bowl.drawBowl();
}

function resetMatingCheck(): void {
    males = 0;
    females = 0;
}

function drawFloor(): void {
    // Clear the canvas (optional, depending on your drawing needs)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the floor image to cover the canvas
    ctx.drawImage(floor, 0, 0, canvas.width, canvas.height);
}

function checkHighestNo(): void {
    if (numberOfCats > highestNumberOfCats) {
        highestNumberOfCats = numberOfCats;
    }
}

function checkOldest(cat: Cat): void {
    if (cat.age > oldestCat) {
        oldestCat = cat.age;
    }
}

// Update cats, check if they can move
function updateCats(): void {
    checkHighestNo();
    cats.forEach((cat: Cat) => {
        randomMove(cat);
        checkOldest(cat);
    });
}

// Randomly move cats
function randomMove(cat: Cat): void {
    // Make the cat move if it's not sleeping, sick, injured, or scared
    if (!cat.sleeping && !cat.sick && !cat.injured && !cat.scared) {
        cat.redirectCat();
    
    }
}

function drawCats(): void {
    // Update and draw each cat
    cats.forEach((cat: Cat) => {
        cat.drawCat();
    });
}

function refresh(): void {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawUI(): void {
    // Draw time and cat count
    ctx.font = 'bold 20px "Comic Sans MS", cursive, sans-serif';
    ctx.fillStyle = "purple";
    // ctx.fillText(`Time: ${time}:${tensOfMins}${mins}`, 70, 15);
    // ctx.fillText(`Day: ${days}`, 150, 15);
    ctx.fillText(`Cats: ${numberOfCats}`, 15, (canvas.height - 15));
}

function hourlyUpdate(): void {
    cats.forEach((cat: Cat) => {
        if (!cat.dead) {
            cat.loseEnergy();
            cat.regainEnergy();
            cat.getHungry();
            cat.getFighting();
            cat.getStressed();
            cat.getDead();
            cat.calmDown();
            cat.getSick();
            cat.eat();
            cat.getRecovered();
            cat.dieOfOld();
        }
    });
}

// Daily update for cat statuses
function dailyUpdate(): void {
    days++;
    bowl.addFood();
    cats.forEach((cat: Cat) => {
        cat.checkMating();
    })
    cats.forEach((cat: Cat) => {
        cat.getPregnant();
        cat.undergoPregnancy();
        cat.ageCat();
        cat.agingCat();
    });
    resetMatingCheck();
}

// Add a new cat
function addCat(): void {
    const newCat = new Cat({
        age: Math.floor(Math.random() * 5),
    });
    setupCatClickHandler([newCat])
    cats.push(newCat);
    numberOfCats++;
    adoptedNumber++;
}

function addBowl(): void {
    bowl = new Bowl();
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

    // Update and draw all cats
    refresh();
    drawFloor();
    bowl.drawBowl();
    drawCats();
    updateCats();
    drawUI();

    // EVERY DAY
    // Add daily updates (e.g., adding a new cat, aging, hunger)
    if (timestamp - lastDayTime >= dayTime) {
        dailyUpdate();
        lastDayTime = timestamp;
    }

    if (timestamp - lastHourUpdate >= 6000) {
        lastHourUpdate = timestamp;
        hourlyUpdate();
    }

    if (timestamp - lastTimeUpdate >= 6000) {
        time = (time + 1) % 24; // Increment hour
        lastTimeUpdate = timestamp;
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

addBowl();
adjustCanvasForDPR(canvas);
// Start the game loop
gameLoop(performance.now());