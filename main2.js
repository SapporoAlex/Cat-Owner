// Canvas setup
var canvas = document.getElementById("crazy-cat-lady-canvas");
var ctx = canvas.getContext("2d");
canvas.width = 450;
canvas.height = 450;
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
var lastFrameTime = performance.now();
var lastDayTime = performance.now();
var lastTimeUpdate = performance.now();
var lastTensOfMinsUpdate = performance.now();
var lastMinsUpdate = performance.now();
var lastCatUpdate = performance.now();
// cat class
var Cat = /** @class */ (function () {
    function Cat() {
        this.moveCooldown = 2000; // 2 seconds cooldown
        this.lastMoveTime = 0; // Track the last time the cat moved
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
    Cat.prototype.randomColor = function () {
        // const colors = ["white", "black", "pink", "brown", "grey", "blue", "orange", "red", "yellow", "purple"];
        // return colors[Math.floor(Math.random() * colors.length)];
        return "white";
    };
    Cat.prototype.loadImages = function () {
        var _this = this;
        var states = ["stand", "walkleft", "walkright", "sleep", "sick", "injured", "scared", "hungry"];
        states.forEach(function (state) {
            _this.images[state] = [];
            for (var i = 1; i <= 2; i++) { // Assuming 2 frames per state
                var img = new Image();
                img.src = "assets/img/".concat(_this.color).concat(state).concat(i, ".png");
                _this.images[state].push(img);
            }
        });
    };
    // This changes the cat's direction every 2 mins
    Cat.prototype.redirectCat = function () {
        var currentTime = Date.now();
        // Check if enough time has passed for the cooldown
        if (currentTime - this.lastMoveTime > this.moveCooldown) {
            // Randomly choose a direction to move
            this.direction = Math.floor(Math.random() * 5); // 0 = left, 1 = right, 2 = up, 3 = down
            console.log(this.direction);
            // Update the last move time to prevent moving again too soon
            this.lastMoveTime = currentTime;
        }
    };
    Cat.prototype.drawCat = function () {
        var now = performance.now();
        // Update animation frame every 500ms
        if (now - this.lastFrameTime > 500) {
            this.frameIndex = (this.frameIndex + 1) % this.images[this.state].length;
            this.lastFrameTime = now;
        }
        var image = this.images[this.state][this.frameIndex];
        if (image.complete && image.width > 0) {
            ctx.drawImage(image, this.xpos, this.ypos, 25, 25);
        }
        ctx.restore();
        if (this.direction == 0) { // Move left
            if (this.xpos <= 0) {
                this.xpos = this.xpos + 10;
                this.direction = 4;
            }
            else {
                this.state = "walkleft";
                this.facing = "left";
                this.xpos -= this.speed;
            }
        }
        if (this.direction == 1) { // Move right
            if (this.xpos >= canvas.width - 50) {
                this.xpos = canvas.width - 50;
                this.direction = 4;
            }
            else {
                this.state = "walkright";
                this.facing = "right";
                this.xpos += this.speed;
            }
        }
        if (this.direction == 2) { // Move up
            if (this.ypos <= 0) {
                this.ypos = this.ypos + 10;
                this.direction = 4;
            }
            else {
                this.ypos -= this.speed;
            }
        }
        if (this.direction == 3) { // Move down
            if (this.ypos >= canvas.height - 25) {
                this.ypos = this.ypos - 25;
                this.direction = 4;
            }
            else {
                this.xpos += this.speed;
            }
        }
        if (this.direction == 4) { // don't move
            this.xpos = this.xpos;
            this.ypos = this.ypos;
            this.direction = 4;
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
    return Cat;
}());
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas to avoid overlapping
    // Update and draw each cat
    cats.forEach(function (cat) {
        cat.drawCat();
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
    randomMove();
}
// Randomly move cats
function randomMove() {
    cats.forEach(function (cat) {
        // Make the cat move if it's not sleeping, sick, injured, or scared
        if (!cat.sleeping && !cat.sick && !cat.injured && !cat.scared) {
            cat.redirectCat();
        }
        console.log("x:".concat(cat.xpos, " & y:").concat(cat.ypos));
    });
}
// Adjust canvas for device pixel ratio
function adjustCanvasForDPR(canvas) {
    var dpr = window.devicePixelRatio || 1;
    // Save CSS size (logical pixels)
    var logicalWidth = canvas.width;
    var logicalHeight = canvas.height;
    // Set canvas dimensions to match DPR
    canvas.width = logicalWidth * dpr;
    canvas.height = logicalHeight * dpr;
    // Scale canvas context
    var ctx = canvas.getContext("2d");
    if (ctx) {
        ctx.scale(dpr, dpr);
    }
    // Restore CSS size to ensure consistent display size
    canvas.style.width = "".concat(logicalWidth, "px");
    canvas.style.height = "".concat(logicalHeight, "px");
}
function gameLoop(timestamp) {
    var elapsed = timestamp - lastFrameTime; // Time since the last frame
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
