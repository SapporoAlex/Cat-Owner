window.addEventListener("load", function () {
    var canvas = document.getElementById("crazy-cat-lady-canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = 600; // Width based on window size
    canvas.height = 400; // Height based on window size
    // declaring variables
    var time = 6; // 24 hr day cycle
    var tensOfMins = 0;
    var mins = 0; // for the mins
    var numberOfCats = 0; // start with zero
    var cats = [];
    var days = 0;
    var updateTimer = 1000;
    var lastUpdate = 0;
    var dayTime = 108000;
    var catStand = new Image();
    catStand.src = "assets/img/catstand.png";
    // cat class
    var Cat = /** @class */ (function () {
        function Cat() {
            this.moveCooldown = 2000; // 2 seconds cooldown
            this.lastMoveTime = 0; // Track the last time the cat moved
            this.speed = 1;
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
        Cat.prototype.moveCat = function () {
            var currentTime = Date.now();
            // Check if enough time has passed for the cooldown
            if (currentTime - this.lastMoveTime > this.moveCooldown) {
                // Randomly choose a direction to move
                var direction = Math.floor(Math.random() * 4); // 0 = left, 1 = right, 2 = up, 3 = down
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
        };
        Cat.prototype.ageCat = function () {
            this.age++;
        };
        Cat.prototype.agingCat = function () {
            var aging = Math.random() * 5;
            if (this.age > 90) {
                this.health -= aging;
            }
        };
        Cat.prototype.getHungry = function () {
            var hungerPangs = Math.random() * 5;
            if (!this.ateRecently && hungerPangs > 1) {
                this.hungry = true;
            }
        };
        Cat.prototype.drawCat = function () {
            if (catStand.complete && catStand.width > 0 && catStand.height > 0) {
                ctx.save();
                if (this.facing === "left") {
                    ctx.translate(this.xpos + 50, this.ypos);
                    ctx.scale(-1, 1); // Flip image horizontally for left-facing cats
                    ctx.drawImage(catStand, 0, 0, 50, 50);
                }
                else {
                    ctx.drawImage(catStand, this.xpos, this.ypos, 50, 50);
                }
                ctx.restore();
            }
            else {
                ctx.fillStyle = "gray";
                ctx.fillRect(this.xpos, this.ypos, 50, 50); // Placeholder if image not loaded
            }
        };
        return Cat;
    }());
    function draw() {
        console.log("Drawing frame...");
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas to avoid overlapping
        // Update and draw each cat
        cats.forEach(function (cat) {
            cat.drawCat();
            console.log("x: ".concat(cat.xpos, ", y: ").concat(cat.ypos));
        });
        // Draw time and cat count
        ctx.font = "14px Arial";
        ctx.fillStyle = "black";
        ctx.fillText("Time: ".concat(time, ":").concat(tensOfMins).concat(mins), 70, 15);
        ctx.fillText("Day: ".concat(days), 150, 15);
        ctx.fillText("Cats: ".concat(numberOfCats), 10, 15);
        // Repeat draw function for animation
        requestAnimationFrame(draw);
    }
    // Daily update for cat statuses
    function dailyUpdate() {
        addCat();
        days++;
        cats.forEach(function (cat) {
            cat.ageCat();
            cat.agingCat();
            cat.getHungry();
        });
    }
    // Add a new cat
    function addCat() {
        var newCat = new Cat();
        cats.push(newCat);
        numberOfCats++;
        console.log("Added cat: Total cats = ".concat(numberOfCats));
    }
    // Update cats, check if they can move
    function updateCats() {
        var curTime = Date.now();
        if (curTime - lastUpdate > updateTimer) {
            randomMove();
            lastUpdate = curTime;
        }
    }
    // Randomly move cats
    function randomMove() {
        cats.forEach(function (cat) {
            // Make the cat move if it's not sleeping, sick, injured, or scared
            if (!cat.sleeping && !cat.sick && !cat.injured && !cat.scared) {
                cat.moveCat();
            }
        });
    }
    // after canvas is created this is where the game's code begins
    catStand.onload = function () {
        console.log("Image loaded, starting draw loop...");
        addCat(); // Add an initial cat for testing
        draw(); // Start drawing after image is loaded
        // Simulate time
        setInterval(function () {
            dayTime = 144000;
            dailyUpdate();
        }, dayTime);
        setInterval(function () {
            time = (time + 1) % 24; // Increment time and wrap around to 0 after 23
        }, 6000); // Adjust interval as needed
        setInterval(function () {
            tensOfMins = (tensOfMins + 1) % 6; // Increment time and wrap around to 0 after 6
        }, 1000); // Adjust interval as needed
        setInterval(function () {
            mins = (mins + 1) % 10; // Increment time and wrap around to 0 after 10
        }, 100); // Adjust interval as needed
        // Regularly update cats' movement
        setInterval(function () {
            updateCats();
        }, 200); // Update movement every 200 ms
    };
    catStand.onerror = function () {
        console.error("Failed to load catStand image.");
    };
});
