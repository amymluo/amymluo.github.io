////////////////////////// FOOD CLASS /////////////////////////
class Food {
    constructor(img, points, isVeg, isPower) {
        this.img = img;
        this.points = points;
        this.fallRate = .2;
        this.gravity = .04;
        this.radius = 30;
        this.x = random(this.radius, width - this.radius);
        this.y = 0;
        this.isVeg = isVeg;
        this.isPower = isPower;
    }

    render() {
        push();
        imageMode(CENTER);
        image(this.img, this.x, this.y);
        pop();
    }

    fall() {
        this.y += this.fallRate;
        this.fallRate += this.gravity;
    }
}

////////////////////// PLAYER CLASS //////////////////////
class Player {
    constructor(img) {
        this.img = img;
        this.x = width / 2;
        this.radius = 42;
    }

    render() {
        push();
        imageMode(CENTER);
        image(this.img, this.x, height - this.radius);
        pop();
    }

    move() {
        if (keyIsPressed) {
            if (keyCode === LEFT_ARROW && this.x > this.radius) {
                this.x -= 8;
            } else if (keyCode === RIGHT_ARROW && this.x < (width - this.radius)) {
                this.x += 8;
            }
        }
    }

    // true if player has collided with food
    collide(food) {
        const x = this.x - food.x;
        const y = height - this.radius - food.y;
        const distance = Math.sqrt(x * x + y * y);
        const minDist = food.radius + this.radius;
        return distance < minDist;
    }
}

/////////////////////////////////////////////////////////////////////////
let p1;
let food; // array list of Food
let score; // int
let lives; // int starts at 3
let time; // int timer
let interval; // interval for increasing food drop rate
let title; // true to display title screen
let isGameOver; // true to display game over screen
let powerUp; // boolean if in power up state
let infoScreen; // true if display info screen
let endPower; // int frame num to end power up state
let junkFood; // array of junk food images
let vegetables; // array of vegetable images

//images
let bg, titleBG, infoBG, gameOverBG;
let john, superJohn;
let bubbleTea, pizza, burger, donut, kale,  broccoli;

let font;

//sounds
let bgMusic, powerSound, bleh, yum, aww;

function preload() {
    bg = loadImage("hcs/images/kitchen.png");
    titleBG = loadImage("hcs/images/titlescreen.png");
    infoBG = loadImage("hcs/images/info.png");
    gameOverBG = loadImage("hcs/images/gameover.png");

    john = loadImage("hcs/images/john.png");
    superJohn = loadImage("hcs/images/power john.png");
    bubbleTea = loadImage("hcs/images/bubble tea.png");

    pizza = loadImage("hcs/images/pizza.png");
    burger = loadImage("hcs/images/hamburger.png");
    donut = loadImage("hcs/images/donut.png");

    kale = loadImage("hcs/images/kale.png");
    broccoli = loadImage("hcs/images/broccoli.png");

    font = loadFont("hcs/pcsenior.ttf");

    //sounds
    soundFormats('mp3', 'wav');
    bgMusic = loadSound('hcs/sounds/bgmusic.wav');
    powerSound = loadSound('hcs/sounds/powerup.wav');
    bleh = loadSound('hcs/sounds/bleh.mp3');
    yum = loadSound('hcs/sounds/yummy.mp3');
    aww = loadSound('hcs/sounds/ah.wav');
}
///////////////////////// GAME /////////////////////////////
function setup() {
    var canvas = createCanvas(500, 500);
    canvas.parent('sketch-holder');
    junkFood = [pizza, burger, donut];

    vegetables = [kale, broccoli];
    p1 = new Player(john);
    food = [];
    food.push(new Food(junkFood[floor(random(junkFood.length))], 1, false, false));

    score = 0;
    lives = 3;
    time = 0;
    interval = 0;

    title = true;
    isGameOver = false;
    infoScreen = false;
    powerUp = false;
    endPower = 0;
    bgMusic.loop();
}

function draw() {
    if (title) {
        if (infoScreen) {
            background(infoBG);
        } else {
            background(titleBG);
        }
    } else if (isGameOver) {
        gameOver();
    //game play
    } else {
        background(bg);
        time++;
        if (time % 100 === 0) {
            interval ++;
        }
        drawScoreLives();
        if (powerUp) {
            powerUpOverlay();
        }
        movePlayer();
        moveFood();
        collide();
        addFood();
        endPowerTime();
    }
}
///////////////////////// GAME METHODS /////////////////////////////

//adds food every 80ish frames, interval decreasing as time progresses
function addFood() {
    let r = floor(random(15));
    if (time % (80 - interval) === 0) {
        if (r < 10) {
            food.push(new Food(junkFood[floor(random(junkFood.length))], 1, false, false));
        } else if (r < 14) {
            food.push(new Food(vegetables[floor(random(vegetables.length))], -5, true, false));
        } else {
            food.push(new Food(bubbleTea, 5, false, true));
        }
    }
}

// move and render the player
function movePlayer() {
    p1.render();
    p1.move();
}

// move and render food
function moveFood() {
    for( i = 0; i < food.length; i ++) {
        let fud = food[i];
        fud.render();
        fud.fall();
        if (hitBottom(fud)) {
            if (!fud.isVeg) {
                lives --;
                aww.play(0, 1.5, 2);
            }
            food.splice(i, 1);
            isGameOver = (lives === 0);
        }
    }
}

// check for collision between player and food
function collide() {
    for (i = 0; i < food.length; i ++) {
        let fud = food[i];
        if (p1.collide(fud)) {
            if (powerUp) {
                score += 5 * fud.points;
            } else {
                score += fud.points;
            }
            if (fud.isVeg) {
                bleh.play(0, 1.6, .7);
            } else if (fud.isPower) {
                powerSound.play(0, 1.5);
                power(time);
            } else {
                yum.play(0, 2, 2);
            }
            food.splice(i, 1);
        }
    }
}

// start power up state at given time
function power(start) {
    powerUp = true;
    endPower = start + 150;
    p1.img = superJohn;
}

// check if should end power up state
function endPowerTime() {
    if (powerUp && time > endPower) {
        powerUp = false;
        p1.img = john;
    }
}

// has the given food hit the bottom
function hitBottom(fud) {
    return fud.y >= height - fud.radius;
}

// render game over screen
function gameOver() {
    push();
    background(gameOverBG);
    fill(110);
    textFont(font, 12);
    textAlign(CENTER);
    text("score: " + score, width / 2, height / 2);
    pop();
}

//draw the score and lives top bar
function drawScoreLives() {
    push();
    textFont(font, 10);
    fill(255);
    text("lives: " + lives, 20, 20);
    text("score: " + score, height - 100, 20);
    pop();
}

// overlay for when in power up state
function powerUpOverlay() {
    push();
    fill(255, 255, 0, 20);
    rect(0, 0, width, height);
    textAlign(CENTER);
    textFont(font, 12);
    fill(100);
    text("Points 5x", width / 2, height / 2 - 50);
    pop();
}


///////////// KEYBOARD FUNCTIONS /////////////////
function keyPressed() {
    if (keyCode === ENTER || keyCode === RETURN) {
        title = false;
    }
}

function keyTyped() {
    // new game
    if (key === 'r') {
        p1 = new Player(john);
        food = [];
        food.push(new Food(junkFood[floor(random(junkFood.length))], 1, false, false));
        score = 0;
        lives = 3;
        time = 0;
        interval = 0;
        title = true;
        isGameOver = false;
        infoScreen = false;
        powerUp = false;
        endPower = 0;
        bgMusic.stop();
        bgMusic.loop();
    }
    if (key === 'i') {
        infoScreen = !infoScreen;
    }
}