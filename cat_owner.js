var _a;
// Canvas setup
var canvas = document.getElementById("crazy-cat-lady-canvas");
var ctx = canvas.getContext("2d");
canvas.width = 450;
canvas.height = 450;
var floor = new Image();
floor.src = "assets/img/floor.png";
floor.onload = function () {
    drawFloor();
};
// declaring variables
var time = 0; // 24 hr day cycle
var tensOfMins = 0;
var mins = 0; // for the mins
var days = 0;
var updateTimer = 1000;
var lastUpdate = 0;
var dayTime = 144000;
var hourTime = 6000;
var numberOfCats = 0; // start with zero
var cats = [];
var deadCats = 0;
var highestNumberOfCats = 0;
var oldestCat = 0;
var adoptedNumber = 0;
var bornNumber = 0;
var catFood = 1;
var rating = "";
var males = 0;
var females = 0;
var bowl;
var menu = true;
var gameOver = false;
var playing = false;
// let lastFrameTime = performance.now();
var lastDayTime = performance.now();
var lastTimeUpdate = performance.now();
var lastHourUpdate = performance.now();
var lastTensOfMinsUpdate = performance.now();
var lastMinsUpdate = performance.now();
var lastCatUpdate = performance.now();
var lastFrameTime = 0;
var currentCat = null; // Track the currently displayed cat
var menuElement = document.getElementById("menu");
var menuTitle = document.getElementById('menu-title');
var playButton = document.getElementById('play');
var howToButton = document.getElementById('how-to');
var howToPopup = document.getElementById('how-to-popup');
var backButton = document.getElementById('back');
var disclaimer = document.getElementById('disclaimer');
var gameOverTitle = document.getElementById("game-over-title");
var eventElement = document.getElementById("event-title");
var panel = document.getElementById("panel");
var addFoodButton = document.getElementById("addFoodButton");
var adoptButton = document.getElementById("adopt");
var cleanButton = document.getElementById("clean");
var quitButton = document.getElementById("quit");
var gameOverMenu = document.getElementById("game-over-menu");
var toMenuButton = document.getElementById("to-menu");
var closeStatsButton = document.getElementById("closeStats");
var renameButton = document.getElementById("rename");
var oldestStat = document.getElementById("oldest-cat");
var highestStat = document.getElementById("highest-number-of-cats");
var adoptedStat = document.getElementById("adopted-cats");
var bornStat = document.getElementById("born-cats");
var diedStat = document.getElementById("died-cats");
var ratingStat = document.getElementById("rating");
var statsDiv = document.getElementById('catStats');
var nameElement = document.getElementById('catName');
var detailsElement = document.getElementById('catDetails');
var isDesktop = window.innerWidth > 768;
var scaleFactor = 1;
function resizeCanvas(canvas, cats) {
    var isDesktop = window.innerWidth > 768;
    var scaleFactor = isDesktop ? 1.3 : 1;
    canvas.width = 450 * scaleFactor;
    canvas.height = 450 * scaleFactor;
    cats.forEach(function (cat) {
        var scaledx = canvas.width / 450;
        var scaledy = canvas.height / 450;
        var scaledxpos = cat.xpos * scaledx;
        var scaledypos = cat.xpos * scaledy;
        cat.xpos = scaledxpos;
        cat.ypos = scaledypos;
    });
}
window.addEventListener('resize', function () { return resizeCanvas(canvas, cats); });
resizeCanvas(canvas, cats); // Initial setup
function showElement(elementId) {
    var element = document.getElementById(elementId);
    if (element) {
        element.classList.remove('hidden');
        element.classList.add('visible');
    }
    else {
        console.error("Element with ID '".concat(elementId, "' not found."));
    }
}
function hideElement(elementId) {
    var element = document.getElementById(elementId);
    if (element) {
        element.classList.remove('visible');
        element.classList.add('hidden');
    }
    else {
        console.error("Element with ID '".concat(elementId, "' not found."));
    }
}
function toggleElement(elementId) {
    var element = document.getElementById(elementId);
    if (element) {
        if (element.classList.contains('hidden')) {
            showElement(elementId);
        }
        else {
            hideElement(elementId);
        }
    }
    else {
        console.error("Element with ID '".concat(elementId, "' not found."));
    }
}
if (playButton) {
    playButton.addEventListener('click', function () {
        hideElement('menu');
        showElement('panel');
        showElement('addFoodButton');
        showElement('adopt');
        showElement('clean');
        showElement('quit');
    });
}
if (quitButton) {
    quitButton.addEventListener('click', function () {
        hideElement('panel');
        hideElement('addFoodButton');
        hideElement('adopt');
        hideElement('clean');
        hideElement('quit');
        showElement('game-over-menu');
        showElement("game-over-title");
        showElement("stats");
        if (highestStat && highestNumberOfCats) {
            highestStat.textContent = "Cat High: ".concat(highestNumberOfCats);
        }
        showElement("highest-number-of-cats");
        if (oldestStat && oldestCat) {
            oldestStat.textContent = "Oldest Cat: ".concat(oldestCat);
        }
        showElement("oldest-cat");
        if (adoptedStat && adoptedNumber) {
            adoptedStat.textContent = "Cats Adopted: ".concat(adoptedNumber);
        }
        showElement("adopted-cats");
        if (bornStat && bornNumber) {
            bornStat.textContent = "Cats Born: ".concat(bornNumber);
        }
        showElement("born-cats");
        if (diedStat && deadCats) {
            diedStat.textContent = "Cats Lost: ".concat(deadCats);
        }
        showElement("died-cats");
        if (ratingStat && rating) {
            ratingStat.textContent = "Rating: ".concat(rating);
        }
        showElement("rating");
        showElement('to-menu');
    });
}
if (howToButton) {
    howToButton.addEventListener('click', function () {
        hideElement('how-to');
        hideElement('play');
        showElement('how-to-popup');
        showElement('back');
    });
}
if (backButton) {
    backButton.addEventListener('click', function () {
        hideElement('how-to-popup');
        hideElement('back');
        showElement('play');
        showElement('how-to');
        showElement('menu');
    });
}
if (toMenuButton) {
    toMenuButton.addEventListener('click', function () {
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
    addFoodButton.addEventListener('click', function () {
        bowl.addFood();
    });
}
if (cleanButton) {
    cleanButton.addEventListener('click', function () {
        // Loop through the cats array in reverse to avoid skipping elements
        for (var i = cats.length - 1; i >= 0; i--) {
            if (cats[i].dead) {
                cats.splice(i, 1); // Remove the dead cat from the array
            }
        }
    });
}
if (adoptButton) {
    adoptButton.addEventListener('click', function () {
        addCat();
    });
}
var Bowl = /** @class */ (function () {
    function Bowl() {
        this.currentImageIndex = 1; // Start with bowl1.png
        this.maxImages = 5; // Maximum number of bowl images
        this.xpos = canvas.width - 100; // Bowl's x position
        this.ypos = 100; // Bowl's y position
        this.imageBasePath = "assets/img/bowl"; // Base path for images
        this.currentImage = new Image();
        this.updateBowlImage();
        this.height = 40;
        this.width = 40;
    }
    Bowl.prototype.addFood = function () {
        if (this.currentImageIndex < this.maxImages) {
            this.currentImageIndex++;
            catFood++;
            this.updateBowlImage();
        }
        else {
            console.error("The bowl is full!");
        }
    };
    Bowl.prototype.updateBowlImage = function () {
        var _this = this;
        // Construct the new image path
        var newImageSrc = "".concat(this.imageBasePath).concat(this.currentImageIndex, ".png");
        this.currentImage.src = newImageSrc; // Set the new source for the Image object
        this.currentImage.onload = function () {
            // Draw the updated image on the canvas once it loads
            _this.drawBowl();
        };
        this.currentImage.onerror = function () {
            console.error("Failed to load image: ".concat(newImageSrc));
        };
    };
    Bowl.prototype.drawBowl = function () {
        var bowlscaledheight = this.height * scaleFactor;
        var bowlscaledwidth = this.width * scaleFactor;
        var bowlscaledxpos = this.xpos * scaleFactor;
        var bowlscaledypos = this.ypos * scaleFactor;
        ctx.drawImage(this.currentImage, bowlscaledxpos, bowlscaledypos, bowlscaledheight, bowlscaledwidth);
    };
    return Bowl;
}());
// cat class
var Cat = /** @class */ (function () {
    function Cat(options) {
        if (options === void 0) { options = {}; }
        this.moveCooldown = 2000; // 2 seconds cooldown
        this.lastMoveTime = 0; // Track the last time the cat moved
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
    Cat.prototype.randomColor = function () {
        var colors = ["white", "black", "brown", "orange", "yellow"];
        return colors[Math.floor(Math.random() * colors.length)];
    };
    Cat.prototype.randomName = function () {
        var names = [
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
    };
    Cat.prototype.loadImages = function () {
        var _this = this;
        var states = ["stand", "walkleft", "walkright", "sleep", "sick", "dead", "fighting"];
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
            // Update the last move time to prevent moving again too soon
            this.lastMoveTime = currentTime;
        }
    };
    Cat.prototype.drawCat = function () {
        var now = performance.now();
        // Update animation frame every 500ms
        if (now - this.lastFrameTime > 250) {
            this.frameIndex = (this.frameIndex + 1) % this.images[this.state].length;
            this.lastFrameTime = now;
        }
        var image = this.images[this.state][this.frameIndex];
        if (image.complete && image.width > 0) {
            var scaledx = canvas.width / 450;
            var scaledy = canvas.height / 450;
            var scaledheight = this.height * scaledx;
            var scaledwidth = this.width * scaledy;
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
                }
                else {
                    this.state = "walkleft";
                    this.facing = "left";
                    this.xpos -= this.speed;
                }
            }
            else if (this.direction == 1) { // Move right
                if (this.xpos >= canvas.width - 50) {
                    this.direction = 4; // Stop if at right boundary
                }
                else {
                    this.state = "walkright";
                    this.facing = "right";
                    this.xpos += this.speed;
                }
            }
            else if (this.direction == 2) { // Move up
                if (this.ypos <= 0) {
                    this.direction = 4; // Stop if at top boundary
                }
                else {
                    this.state = "walkleft";
                    this.facing = "left";
                    this.ypos -= this.speed;
                }
            }
            else if (this.direction == 3) { // Move down
                if (this.ypos >= canvas.height - 50) { // Adjust for cat's height
                    this.direction = 4; // Stop if at bottom boundary
                }
                else {
                    this.state = "walkright";
                    this.facing = "right";
                    this.ypos += this.speed; // Correctly update ypos
                }
            }
            else if (this.direction == 4) { // Stop moving
                this.state = "stand";
                // No update needed; cat stays in place
            }
            if (this.xpos > canvas.width) {
                this.xpos = canvas.width - 100;
            }
            if (this.ypos > canvas.height) {
                this.ypos = canvas.height - 100;
            }
            // old
            if (!this.fighting && !this.sleeping && !this.dead && !this.hungry && !this.injured && !this.sick && !this.scared && this.age > 10) {
                if (this.direction == 0) { // Move left
                    if (this.xpos <= 0) {
                        this.direction = 4; // Stop if at left boundary
                    }
                    else {
                        this.state = "walkleft";
                        this.facing = "left";
                        this.xpos -= this.speed / 2;
                    }
                }
                else if (this.direction == 1) { // Move right
                    if (this.xpos >= canvas.width - 50) {
                        this.direction = 4; // Stop if at right boundary
                    }
                    else {
                        this.state = "walkright";
                        this.facing = "right";
                        this.xpos += this.speed / 2;
                    }
                }
                else if (this.direction == 2) { // Move up
                    if (this.ypos <= 0) {
                        this.direction = 4; // Stop if at top boundary
                    }
                    else {
                        this.state = "walkleft";
                        this.facing = "left";
                        this.ypos -= this.speed / 2;
                    }
                }
                else if (this.direction == 3) { // Move down
                    if (this.ypos >= canvas.height - 50) { // Adjust for cat's height
                        this.direction = 4; // Stop if at bottom boundary
                    }
                    else {
                        this.state = "walkright";
                        this.facing = "right";
                        this.ypos += this.speed / 2; // Correctly update ypos
                    }
                }
                else if (this.direction == 4) { // Stop moving
                    this.state = "stand";
                    // No update needed; cat stays in place
                }
                if (this.xpos > canvas.width) {
                    this.xpos = canvas.width - 100;
                }
                if (this.ypos > canvas.height) {
                    this.ypos = canvas.height - 100;
                }
            }
        }
        if (this.fighting && !this.dead) {
            if (this.direction == 0) { // Move left
                if (this.xpos <= 0) {
                    this.direction = 4; // Stop if at left boundary
                }
                else {
                    this.state = "fighting";
                    this.facing = "left";
                    this.xpos -= this.speed * 2;
                }
            }
            else if (this.direction == 1) { // Move right
                if (this.xpos >= canvas.width - 50) {
                    this.direction = 4; // Stop if at right boundary
                }
                else {
                    this.state = "fighting";
                    this.facing = "right";
                    this.xpos += this.speed * 2;
                }
            }
            else if (this.direction == 2) { // Move up
                if (this.ypos <= 0) {
                    this.direction = 4; // Stop if at top boundary
                }
                else {
                    this.state = "fighting";
                    this.facing = "left";
                    this.ypos -= this.speed * 2;
                }
            }
            else if (this.direction == 3) { // Move down
                if (this.ypos >= canvas.height - 50) { // Adjust for cat's height
                    this.direction = 4; // Stop if at bottom boundary
                }
                else {
                    this.state = "fighting";
                    this.facing = "right";
                    this.ypos += this.speed * 2; // Correctly update ypos
                }
            }
            else if (this.direction == 4) {
                this.state = "fighting";
            }
        }
        if (this.hungry && !this.sleeping) {
            if (this.xpos < canvas.width - 120) {
                this.xpos += this.speed;
            }
            if (this.ypos > 120) {
                this.ypos -= this.speed;
            }
        }
    };
    Cat.prototype.ageCat = function () {
        if (!this.dead) {
            this.age++;
        }
    };
    Cat.prototype.agingCat = function () {
        var aging = Math.random() * 20;
        if (this.age > 10) {
            this.health -= aging;
            this.energy -= aging;
        }
    };
    Cat.prototype.dieOfOld = function () {
        if (this.age > 20) {
            this.dead = Math.random() > 0.8;
            if (this.dead) {
                this.sleeping = false;
                this.causeOfDeath = "natural causes";
                numberOfCats--;
                deadCats++;
            }
        }
    };
    Cat.prototype.getFighting = function () {
        if (this.stress > 10 && !this.sleeping && !this.injured && !this.sick && !this.dead && !this.fighting) {
            this.resetState();
            this.fighting = true;
            this.stress -= Math.floor(Math.random() * 5) + 1;
        }
    };
    Cat.prototype.getStressed = function () {
        if (this.hungry || this.energy < 5 && !this.sleeping) {
            this.stress += Math.floor(Math.random() * 3) + 1;
        }
    };
    Cat.prototype.getHungry = function () {
        if (!this.sleeping && !this.dead) {
            this.hunger += Math.floor(Math.random() * 3) + 1;
            if (this.hunger > 30) {
                this.health -= 5;
                this.stress += 5;
                this.resetState();
                this.hungry = true;
                this.ateRecently = false;
            }
        }
    };
    Cat.prototype.loseEnergy = function () {
        if (!this.sleeping && !this.dead) {
            if (this.age > 10) {
                this.energy -= Math.floor(Math.random() * 6) + 1;
            }
            else {
                this.energy -= Math.floor(Math.random() * 3) + 1;
            }
            if (this.energy <= 1) {
                this.sleeping = true;
            }
        }
    };
    Cat.prototype.regainEnergy = function () {
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
    };
    Cat.prototype.getSick = function () {
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
    };
    Cat.prototype.getRecovered = function () {
        if (this.sick) {
            this.sick = Math.random() > 0.5;
            if (this.sick) {
                this.health -= 5;
            }
        }
    };
    Cat.prototype.checkMating = function () {
        if (this.sex == "male") {
            males++;
        }
        if (this.sex == "female") {
            females++;
        }
    };
    Cat.prototype.getPregnant = function () {
        if (males > 0 && females > 0 && this.sex == "female" && !this.pregnant)
            this.pregnant = Math.random() > 0.9;
    };
    Cat.prototype.undergoPregnancy = function () {
        if (this.pregnant) {
            this.pregnancy++;
            this.energy - 20;
            if (this.pregnancy >= 5) {
                this.pregnant = false;
                this.pregnancy = 0;
                var mumXLoc = this.xpos;
                var mumYLoc = this.ypos;
                var randomTimes = Math.floor(Math.random() * 6) + 1;
                for (var i = 0; i < randomTimes; i++) {
                    var kitten = new Cat({
                        xpos: mumXLoc,
                        ypos: mumYLoc,
                        color: Math.random() > 0.7 ? this.color : this.randomColor(),
                    });
                    setupCatClickHandler([kitten]);
                    cats.push(kitten);
                    numberOfCats++;
                    bornNumber++;
                }
                alert("".concat(this.name, " gave birth to ").concat(randomTimes, " kittens!"));
            }
        }
    };
    Cat.prototype.getDead = function () {
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
    };
    Cat.prototype.resetState = function () {
        this.fighting = false;
        this.scared = false;
        this.sleeping = false;
    };
    Cat.prototype.calmDown = function () {
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
    };
    Cat.prototype.eat = function () {
        if (this.hungry && catFood > 0 && this.xpos > canvas.width - 150 && this.ypos < 150) {
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
    };
    return Cat;
}());
function setupCatClickHandler(cats) {
    canvas.addEventListener('click', function (event) {
        var rect = canvas.getBoundingClientRect();
        var mouseX = event.clientX - rect.left;
        var mouseY = event.clientY - rect.top;
        var clickedCat;
        for (var _i = 0, cats_1 = cats; _i < cats_1.length; _i++) {
            var cat = cats_1[_i];
            var scaledx = canvas.width / 450;
            var scaledy = canvas.height / 450;
            if (mouseX >= (cat.xpos * scaledx) && mouseX <= (cat.xpos * scaledx) + (cat.width * scaledx) &&
                mouseY >= (cat.ypos * scaledy) && mouseY <= (cat.ypos * scaledy) + (cat.height * scaledy)) {
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
    closeStatsButton.addEventListener('click', function () {
        hideElement('cat-stats');
    });
}
if (renameButton) {
    renameButton.addEventListener('click', function () {
        if (currentCat) {
            var newName = prompt("Enter a new name for this cat:", currentCat.name);
            if (newName !== null && newName.trim() !== "") {
                currentCat.name = newName.trim();
                updateCatStatsUI(currentCat); // Update the stats UI
                console.log("Cat renamed to: ".concat(currentCat.name));
            }
        }
        else {
            console.error("No cat selected for renaming.");
        }
    });
}
function updateCatStatsUI(cat) {
    var statsElement = document.getElementById('cat-stats');
    if (statsElement) {
        statsElement.querySelector('#catName').textContent = "".concat(cat.name);
    }
}
function showCatStats(cat) {
    showElement("cat-stats");
    showElement("catName");
    // Set the name and details
    if (nameElement) {
        nameElement.textContent = cat.name;
    }
    if (detailsElement) {
        detailsElement.innerHTML = "\n<li>Age: ".concat(cat.age, "</li>\n<li>Sex: ").concat(cat.sex, "</li>\n<li>Health: %").concat(Math.floor(cat.health), "</li>\n<li>Energy: %").concat(Math.floor(cat.energy * 10), "</li>\n<li>State: ").concat(cat.state, "</li>\n<h2 style=\"margin-left: -40px; text-align: center;\">Conditions</h2>\n<li>").concat(cat.dead === true ? "Cause of death: " + cat.causeOfDeath : "", "</li>\n<li>").concat(cat.hunger >= 30 ? "hungry" : "", "</li>\n<li>").concat(cat.ateRecently === true ? "ate recently" : "", "</li>\n<li>").concat(cat.stress >= 5 ? "stressed" : "", "</li>\n<li>").concat(cat.energy <= 3 ? "sleepy" : "", "</li>\n<li>").concat(cat.stress <= 2 ? "happy" : "", "</li>\n<li>").concat(cat.sex === "female" ? (cat.pregnant ? "pregnant" : "") : "", "</li>\n        ");
    }
    // Show the stats div
    if (statsDiv) {
        statsDiv.style.display = 'block';
    }
}
// Close the stats view
(_a = document.getElementById('closeStats')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
    var statsDiv = document.getElementById('cat-stats');
    hideElement('catStats');
});
function resetGame() {
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
function resetMatingCheck() {
    males = 0;
    females = 0;
}
function drawFloor() {
    // Clear the canvas (optional, depending on your drawing needs)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw the floor image to cover the canvas
    ctx.drawImage(floor, 0, 0, canvas.width, canvas.height);
}
function checkHighestNo() {
    if (numberOfCats > highestNumberOfCats) {
        highestNumberOfCats = numberOfCats;
    }
}
function checkOldest(cat) {
    if (cat.age > oldestCat) {
        oldestCat = cat.age;
    }
}
// Update cats, check if they can move
function updateCats() {
    checkHighestNo();
    cats.forEach(function (cat) {
        randomMove(cat);
        checkOldest(cat);
    });
}
// Randomly move cats
function randomMove(cat) {
    // Make the cat move if it's not sleeping, sick, injured, or scared
    if (!cat.sleeping && !cat.sick && !cat.injured && !cat.scared) {
        cat.redirectCat();
    }
}
function drawCats() {
    // Update and draw each cat
    cats.forEach(function (cat) {
        cat.drawCat();
    });
}
function refresh() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function drawUI() {
    // Draw time and cat count
    ctx.font = 'bold 20px "Comic Sans MS", cursive, sans-serif';
    ctx.fillStyle = "purple";
    // ctx.fillText(`Time: ${time}:${tensOfMins}${mins}`, 70, 15);
    // ctx.fillText(`Day: ${days}`, 150, 15);
    ctx.fillText("Cats: ".concat(numberOfCats), 15, (canvas.height - 15));
}
function hourlyUpdate() {
    cats.forEach(function (cat) {
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
function dailyUpdate() {
    days++;
    bowl.addFood();
    cats.forEach(function (cat) {
        cat.checkMating();
    });
    cats.forEach(function (cat) {
        cat.getPregnant();
        cat.undergoPregnancy();
        cat.ageCat();
        cat.agingCat();
    });
    resetMatingCheck();
}
// Add a new cat
function addCat() {
    var newCat = new Cat({
        age: Math.floor(Math.random() * 5),
    });
    setupCatClickHandler([newCat]);
    cats.push(newCat);
    numberOfCats++;
    adoptedNumber++;
}
function addBowl() {
    bowl = new Bowl();
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
