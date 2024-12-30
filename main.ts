window.addEventListener("load", () => {
    const canvas = document.getElementById("crazy-cat-lady-canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    canvas.width = 600;  // Width based on window size
    canvas.height = 400;  // Height based on window size

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

    const catStand = new Image();
    catStand.src = "assets/img/catstand.png";

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

        private moveCooldown: number = 2000; // 2 seconds cooldown
        private lastMoveTime: number = 0; // Track the last time the cat moved
        private targetX: number; // Target position for x-axis
        private targetY: number; // Target position for y-axis
        private speed: number = 1;

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
            this.targetX = this.xpos;
            this.targetY = this.ypos;
        }


        moveCat(): void {
            const currentTime = Date.now();
    
            // Check if enough time has passed for the cooldown
            if (currentTime - this.lastMoveTime > this.moveCooldown) {
                // Randomly choose a direction to move
                const direction = Math.floor(Math.random() * 4); // 0 = left, 1 = right, 2 = up, 3 = down
    
                // Set target positions based on random direction
                switch (direction) {
                    case 0: // Move left
                        this.targetX = Math.max(this.xpos - 50, 0);
                        break;
                    case 1: // Move right
                        this.targetX = Math.min(this.xpos + 50, canvas.width);
                        break;
                    case 2: // Move up
                        this.targetY = Math.max(this.ypos - 50, 0);
                        break;
                    case 3: // Move down
                        this.targetY = Math.min(this.ypos + 50, canvas.height);
                        break;
                }
    
                // Smoothly interpolate towards the target position
                this.xpos += (this.targetX - this.xpos) * 0.1; // Move towards target with 10% step
                this.ypos += (this.targetY - this.ypos) * 0.1; // Move towards target with 10% step
    
                // Update the last move time to prevent moving again too soon
                this.lastMoveTime = currentTime;
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

        drawCat(): void {
            if (catStand.complete && catStand.width > 0 && catStand.height > 0) {
                ctx.save();
                if (this.facing === "left") {
                    ctx.translate(this.xpos + 50, this.ypos);
                    ctx.scale(-1, 1); // Flip image horizontally for left-facing cats
                    ctx.drawImage(catStand, 0, 0, 50, 50);
                } else {
                    ctx.drawImage(catStand, this.xpos, this.ypos, 50, 50);
                }
                ctx.restore();
            } else {
                ctx.fillStyle = "gray";
                ctx.fillRect(this.xpos, this.ypos, 50, 50); // Placeholder if image not loaded
            }
        }
    }

    function draw(): void {
        console.log("Drawing frame...");
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas to avoid overlapping

        // Update and draw each cat
        cats.forEach((cat: Cat) => {
            cat.drawCat();
            console.log(`x: ${cat.xpos}, y: ${cat.ypos}`);
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
        const curTime = Date.now();
        if (curTime - lastUpdate > updateTimer) {
            randomMove();
            lastUpdate = curTime;
        }
    }

    // Randomly move cats
    function randomMove(): void {
        cats.forEach((cat: Cat) => {
            // Make the cat move if it's not sleeping, sick, injured, or scared
            if (!cat.sleeping && !cat.sick && !cat.injured && !cat.scared) {
                cat.moveCat();
            }
        });
    }

    // after canvas is created this is where the game's code begins

    catStand.onload = () => {
        console.log("Image loaded, starting draw loop...");
        addCat(); // Add an initial cat for testing
        draw(); // Start drawing after image is loaded

        // Simulate time
        setInterval(() => {
            dayTime = 144000;
            dailyUpdate();
        }, dayTime);

        setInterval(() => {
            time = (time + 1) % 24; // Increment time and wrap around to 0 after 23
        }, 6000); // Adjust interval as needed

        setInterval(() => {
            tensOfMins = (tensOfMins + 1) % 6; // Increment time and wrap around to 0 after 6
        }, 1000); // Adjust interval as needed

        setInterval(() => {
            mins = (mins + 1) % 10; // Increment time and wrap around to 0 after 10
        }, 100); // Adjust interval as needed

        // Regularly update cats' movement
        setInterval(() => {
            updateCats();
        }, 200); // Update movement every 200 ms
    };

    catStand.onerror = () => {
        console.error("Failed to load catStand image.");
    };
});
