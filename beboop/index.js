/////////////////////////// PLAYER ////////////////////////////////
class Player {
    constructor(x, y) {
        this.w = 100;
        this.h = 150;
        this.x = x;
        this.y = y - this.h / 2;
        this.px = x; // previous x
        this.walkRight = [walk1Right, standRight, walk2Right];
        this.walkLeft = [walk1Left, standLeft, walk2Left];
        this.time = frameCount;
        this.goingRight = true;
        this.currentImage = 1;
    }

    render() {
        push();
        imageMode(CENTER);
        if (this.goingRight) { // facing right direction
            //standing still
            if (!(keyIsPressed && (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW))) {
                image(standRight, this.x, this.y, this.w, this.h);
            } else {
                // walking right
                this.getImage();
                image(this.walkRight[this.currentImage], this.x, this.y, this.w, this.h);
            }
        } else { // facing left direction
            // standing still
            if (!(keyIsPressed && (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW))) {
                image(standLeft, this.x, this.y, this.w, this.h);
            } else {
                // walking left
                this.getImage();
                image(this.walkLeft[this.currentImage], this.x, this.y, this.w, this.h);
            }
        }
        pop();
    }

    // updates current image index in walking sequence
    getImage() {
        //getting direction
        if (this.px < this.x) {
            this.goingRight = true;
        }
        if (this.px > this.x) {
            this.goingRight = false;
        }
        // time to change image
        if (frameCount > this.time + 10) {
            //if end of array,
            if (this.currentImage === this.walkRight.length - 1) {
                this.currentImage = 0;
            } else {
                this.currentImage++;
            }
            this.time = frameCount;
        }
    }

    onKey() {
        if (keyIsDown(RIGHT_ARROW)) {
            if (this.x < 4000) {
                this.px = this.x;
                this.x += 3;
            }
        }
        if (keyIsDown(LEFT_ARROW) && this.y > 0) {
            if (this.x > 0) {
                this.px = this.x;
                this.x -= 3;
            }
        }
    }
}

/////////////////////////// LOGIC GATE ///////////////////////////
class Gate {

    constructor(type, x, y) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.w = 50;
        this.h = 50;
        this.pressed = false;
        this.collide = false;
        this.snap = null;
    }

    render() {
        push();
        imageMode(CENTER);
        switch (this.type) {
            case "not":
                image(not, this.x, this.y, 75, 75);
                break;
            case "and":
                image(and, this.x, this.y, 75, 75);
                break;
            case "or":
                image(or, this.x, this.y, 75, 75);
                break;
        }
        pop();
    }

    //updates position of gate to mouse position if pressed/dragged
    update() {
        if (this.pressed) {
            this.x = mouseX;
            this.y = mouseY;
        }
    }

    // is the mouse over this gate?
    isMouseOver() {
        return mouseX > this.x - this.w / 2 && mouseX < this.x + this.w / 2
            && mouseY > this.y - this.h / 2 && mouseY < this.y + this.h / 2;
    }
}

////////////////// ABSTRACT CIRCUIT ////////////////////////////////////
class Circuit {

    constructor() {
        this.inputGates = null;
        this.solution = null;
        this.gatePositions = null;
        this.sources = null;
        this.complete = false;
        this.optionGates = null;
    }

    run() {
        background(50);
        // title text
        push();
        textAlign(CENTER);
        fill(255);
        textFont(font, 15);
        text("Complete the circuit!", 100, 75, 500, 200);
        textFont(font, 10);
        text("Drag the correct gates", width / 2, 675);

        //render everything
        this.render();

        // option gate dragging
        for (let i = 0; i < this.optionGates.length; i++) {
            this.optionGates[i].update();
        }

        this.checkCollision();
        this.checkComplete();
    }

    checkCollision() {
        //reset collisions
        for (let i = 0; i < this.optionGates.length; i++) {
            this.optionGates[i].collide = false;
        }
        // iterates through all gate positions
        for (let i = 0; i < this.gatePositions.length; i++) {
            let p = this.gatePositions[i];
            let collide = false;
            // iterates through all gate options
            for (let j = 0; j < this.optionGates.length; j++) {
                let g = this.optionGates[j];
                if (!g.collide) {
                    if (p.x > g.x - g.w / 2 && p.x < g.x + g.w / 2
                        && p.y > g.y - g.h / 2 && p.y < g.y + g.h / 2) {
                        this.inputGates[i] = g.type;
                        collide = true;
                        g.collide = true;
                        g.snap = this.gatePositions[i];
                    }
                }
            }
            if (!collide) {
                this.inputGates[i] = null;
            }
        }
    }

    //checks for circuit completion and dings if so
    checkComplete() {
        let result = true;
        for (let i = 0; i < this.solution.length; i++) {
            result = result && this.solution[i] === this.inputGates[i];
        }
        let oldComplete = this.complete;
        this.complete = result;
        if ((this.complete !== oldComplete) && this.complete) {
            bing.play();
        }
    }

    //total render method
    render() {
        push();
        this.renderLines();
        this.renderLightbulb();
        this.renderSources();
        this.renderGatePosns();
        this.renderGates();
        pop();
    }

    // lit or dim bulb depending if completed
    renderLightbulb() {
        push();
        if (this.complete) {
            noStroke();
            fill(255, 255, 0, 10);
            ellipse(600, height / 2, 120, 120);
            fill(255, 255, 0, 20);
            ellipse(600, height / 2, 90, 90);
            fill(255, 255, 0);
        } else {
            stroke(0, 250, 255);
            strokeWeight(2);
            fill(50);
        }
        ellipse(600, height / 2, 70, 70);
        pop();
    }

    renderSources() {
        push();
        const spacing = height / (this.sources.length + 1);
        for (let i = 0; i < this.sources.length; i++) {
            rectMode(CENTER);
            noStroke();
            textAlign(CENTER);
            textFont(sourceFont, 20);
            if (this.sources[i]) { // on source
                //rings for on
                fill(255, 10);
                noStroke();
                ellipse(100, (i + 1) * spacing, 100, 100);
                fill(255, 20);
                ellipse(100, (i + 1) * spacing, 75, 75);
                fill(255);

                ellipse(100, (i + 1) * spacing, 50, 50);
                fill(0);

                text("on", 100, (i + 1) * spacing + 5);
            } else { // off source
                fill(0);
                ellipse(100, (i + 1) * spacing, 50, 50);
                fill(255);
                text("off", 100, (i + 1) * spacing + 5);
            }
        }
        pop();
    }

    renderGatePosns() {
        push();
        rectMode(CENTER);
        noFill();
        stroke(0, 250, 255);
        strokeWeight(2);
        for (let i = 0; i < this.gatePositions.length; i++) {
            let p = this.gatePositions[i];
            rect(p.x, p.y, 50, 50);
        }
        pop();
    }

    renderGates() {
        push();
        for (let i = 0; i < this.optionGates.length; i++) {
            this.optionGates[i].render();
        }
        pop();
    }

    renderLines() {
        //abstract
    }

    mouseP() {
        for (let i = 0; i < this.optionGates.length; i++) {
            let g = this.optionGates[i];
            g.pressed = g.isMouseOver();
            if (g.pressed) {
                break;
            }
        }
    }

    mouseR() {
        for (let i = 0; i < this.optionGates.length; i++) {
            let g = this.optionGates[i];
            g.pressed = false;
            if (g.collide) {
                g.x = g.snap.x;
                g.y = g.snap.y;
            }
        }
    }
}

////////////////////////////// CIRCUIT 1 /////////////////////////////////
class Circuit1 extends Circuit {

    constructor() {
        super();
        this.initialize();
    }

    initialize() {
        this.solution = ["not"];
        this.gatePositions = [new Posn(width / 2, height / 2)];
        this.sources = [false];
        this.complete = false;
        this.inputGates = [null];
        this.optionGates = [new Gate("and", 175, 600),
            new Gate("or", 350, 600), new Gate("not", 525, 600)];
    }

    renderLines() {
        push();
        stroke(0, 250, 255);
        strokeWeight(2);
        line(100, 350, 325, 350);
        line(375, 350, 600, 350);
        pop();
    }
}

////////////////////////////// CIRCUIT 2 /////////////////////////////////
class Circuit2 extends Circuit {

    constructor() {
        super();
        this.initialize();
    }

    initialize() {
        this.solution = ["and"];
        this.gatePositions = [new Posn(width / 2, height / 2)];
        this.sources = [true, true];
        this.complete = false;
        this.inputGates = [null];
        this.optionGates = [new Gate("and", 233, 600), new Gate("not", 466, 600)];
    }

    renderLines() {
        push();
        stroke(0, 250, 255);
        strokeWeight(2);
        line(100, 233, 250, 233);
        line(100, 466, 250, 466);

        line(250, 233, 250, 330);
        line(250, 466, 250, 370);

        line(250, 330, 325, 330);
        line(250, 370, 325, 370);

        line(375, 350, 600, 350);
        pop();
    }
}

////////////////////////////// CIRCUIT 3 /////////////////////////////////
class Circuit3 extends Circuit {

    constructor() {
        super();
        this.initialize();
    }

    initialize() {
        this.solution = ["or"];
        this.gatePositions = [new Posn(width / 2, height / 2)];
        this.sources = [true, false];
        this.complete = false;
        this.inputGates = [null];
        this.optionGates = [new Gate("and", 175, 600), new Gate("or", 350, 600),
            new Gate("not", 525, 600)];
    }

    renderLines() {
        push();
        stroke(0, 250, 255);
        strokeWeight(2);
        line(100, 233, 250, 233);
        line(100, 466, 250, 466);

        line(250, 233, 250, 330);
        line(250, 466, 250, 370);

        line(250, 330, 325, 330);
        line(250, 370, 325, 370);

        line(375, 350, 600, 350);
        pop();
    }
}

////////////////////////////// CIRCUIT 4 /////////////////////////////////
class Circuit4 extends Circuit {

    constructor() {
        super();
        this.initialize();
    }

    initialize() {
        this.solution = ["and", "not"];
        this.gatePositions = [new Posn(width / 2.5, height / 2),
            new Posn(width / 1.6, height / 2)];
        this.sources = [true, false];
        this.complete = false;
        this.inputGates = [null, null];
        this.optionGates = [new Gate("and", 175, 600), new Gate("or", 350, 600),
            new Gate("not", 525, 600)];
    }

    renderLines() {
        push();
        stroke(0, 250, 255);
        strokeWeight(2);
        line(100, 233, 175, 233);
        line(100, 466, 175, 466);

        line(175, 233, 175, 330);
        line(175, 466, 175, 370);

        line(175, 330, 255, 330);
        line(175, 370, 255, 370);

        line(305, 350, 411, 350);
        line(462, 350, 600, 350);
        pop();
    }
}

////////////////////////////// CIRCUIT 5 /////////////////////////////////
class Circuit5 extends Circuit {

    constructor() {
        super();
        this.initialize();
    }

    initialize() {
        this.solution = ["and", "not", "or"];
        this.gatePositions = [new Posn(width / 2.5, height / 2.65),
            new Posn(width / 2.5, height / 1.6), new Posn(width / 1.6, height / 2)];
        this.sources = [false, false, false];
        this.complete = false;
        this.inputGates = [null, null, null];
        this.optionGates = [new Gate("and", 175, 600), new Gate("or", 350, 600),
            new Gate("not", 525, 600)];
    }

    renderLines() {
        push();
        stroke(0, 250, 255);
        strokeWeight(2);
        line(100, 175, 175, 175);
        line(175, 175, 175, 243);
        line(175, 243, 255, 243);

        line(100, 350, 175, 350);
        line(175, 350, 175, 283);
        line(175, 283, 255, 283);

        line(100, 525, 175, 525);
        line(175, 525, 175, 435);
        line(175, 435, 255, 435);

        line(305, 265, 350, 265);
        line(350, 265, 350, 330);
        line(350, 330, 411, 330);

        line(305, 435, 350, 435);
        line(350, 435, 350, 370);
        line(350, 370, 411, 370);

        line(462, 350, 600, 350);
        pop();
    }
}

////////////////////////////// CIRCUIT 5 /////////////////////////////////
class Circuit6 extends Circuit {

    constructor() {
        super();
        this.initialize();
    }

    initialize() {
        this.solution = ["or", "and", "not", "or"];
        this.gatePositions = [new Posn(width / 2.4, height / 3.4),
            new Posn(width / 3, height / 1.45),
            new Posn(width / 2, height / 1.45),
            new Posn(width / 1.45, height / 2)];
        this.sources = [true, false, true, true];
        this.complete = false;
        this.inputGates = [null, null, null, null];
        this.optionGates = [new Gate("and", 140, 625),
            new Gate("or", 280, 625), new Gate("or", 420, 625),
            new Gate("not", 560, 625)];
    }

    renderLines() {
        push();
        stroke(0, 250, 255);
        strokeWeight(2);
        line(100, 140, 175, 140);
        line(175, 140, 175, 185);
        line(175, 185, 265, 185);

        line(100, 280, 175, 280);
        line(175, 280, 175, 225);
        line(175, 225, 265, 225);

        line(100, 560, 175, 560);
        line(175, 560, 175, 505);
        line(175, 505, 206, 505);

        line(100, 425, 175, 425);
        line(175, 425, 175, 460);
        line(175, 460, 206, 460);

        line(318, 205, 400, 205);
        line(400, 205, 400, 330);
        line(400, 330, 457, 330);

        line(375, 480, 400, 480);
        line(400, 480, 400, 370);
        line(400, 370, 457, 370);

        line(260, 480, 325, 480);

        line(507, 350, 600, 350);
        pop();
    }
}

/////////////////////////////////// NPC ROBOT ////////////////////////////////////
class NPC {
    constructor(img, dead, circuit, x, y) {
        this.img = img;
        this.dead = dead;
        this.circuit = circuit;
        this.complete = false;
        this.displayCircuit = false;
        this.walkedPast = false;
        this.click = false;
        this.w = img.width;
        this.h = img.height;
        this.x = x;
        this.y = y - this.h / 2;
        this.button = new Button("done", 630, 660, 50, 30);
    }

    render() {
        //circuit display
        if (this.displayCircuit) {
            this.circuit.run();
            this.button.render();
        } else {
            //robot
            push();
            imageMode(CENTER);
            this.message(); // speech bubble
            if (this.complete) {
                image(this.img, this.x, this.y);
            } else {
                image(this.dead, this.x, this.y);
            }
            push();
        }
    }

    //render speech bubble
    message() {
        push();
        imageMode(CENTER);
        // "help me" speech bubble if not completed and player has walked past
        if (this.walkedPast && !this.complete) {
            image(help, this.x - this.w / 1.4, this.y - this.h / 2);
        }
        //"thank you" speech bubble
        if (this.complete) {
            image(thankYou, this.x - this.w / 1.4, this.y - this.h / 2);
        }
        pop();
    }

    // has the player walked past this robot
    hasWalkedPast(pos) {
        if (pos > this.x - 150) {
            this.walkedPast = true;
        }
    }

    mouseR() {
        //offset for clicking
        let offset;
        if (p1.x < width / 2) {
            offset = 0;
        } else if (p1.x < 4000 - width / 2) {
            offset = -p1.x + width / 2;
        } else {
            offset = width - 4000;
        }
        if (this.displayCircuit) {
            //if clicked done button
            if (mouseX > this.button.x - this.button.w / 2
                && mouseX < this.button.x + this.button.w / 2
                && mouseY > this.button.y - this.button.h / 2
                && mouseY < this.button.y + this.button.h / 2) {
                // check completion
                this.complete = this.circuit.complete;
                this.click = false;
                this.displayCircuit = false;
            }
            //send click to circuit
            this.circuit.mouseR();
        } else {
            if (mouseX > this.x - this.w / 2 + offset
                && mouseX < this.x + this.w / 2 + offset
                && mouseY > this.y - this.h / 2 && mouseY < this.y + this.h / 2) {
                this.click = true;
                if (this.click && !this.complete) {
                    this.displayCircuit = true;
                }
            }
        }
    }

    mouseP() {
        if (this.displayCircuit) {
            this.circuit.mouseP();
        }
    }
}

//////////////////// BUTTON /////////////////////////////
class Button {
    constructor(word, x, y, w, h) {
        this.word = word;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    render() {
        push();
        noFill();
        stroke(0, 250, 255);
        strokeWeight(2);
        rectMode(CENTER);
        rect(this.x, this.y, this.w, this.h);

        fill(0, 250, 255);
        noStroke();
        textAlign(CENTER);
        textFont(font, 10);
        text(this.word, this.x, this.y + 5);
        pop();
    }
}


/////////////////// POSN /////////////////////
class Posn {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}


/////////////////////////////////////////////////////////////////////////

let p1; //player
let npcs; // list of npc robots

let screen; // which screen you are on, 0 for title, 1 for info, 3+ for game
let gameOver// boolean is the game over?

//player walking sprites
let walk1Right, standRight, walk2Right, walk1Left, standLeft, walk2Left;

//screen images
let bg, titleScreen, infoScreen, endScreen, hints;

// gate & speech bubble images
let and, or, not;
let help, thankYou;

// robot images
let robot1, robot2, robot3, robot4, robot5, robot6;
let robot1Dead, robot2Dead, robot3Dead, robot4Dead, robot5Dead, robot6Dead;

//should a circuit be displayed?
// should the hints be displayed?
let circuit, showHints;

//fonts
let font, sourceFont;

//sound files
let bgMusic, bing;

function preload() {
    // logic gate images
    and = loadImage("beboop/data/images/and.png");
    or = loadImage("beboop/data/images/or.png");
    not = loadImage("beboop/data/images/not.png");

    //player walking sprites
    walk1Right = loadImage("beboop/data/images/player_walking1_right.png");
    standRight = loadImage("beboop/data/images/player_stand_right.png");
    walk2Right = loadImage("beboop/data/images/player_walking2_right.png");
    walk1Left = loadImage("beboop/data/images/player_walking1_left.png");
    standLeft = loadImage("beboop/data/images/player_stand_left.png");
    walk2Left = loadImage("beboop/data/images/player_walking2_left.png");

    // robot images
    robot1 = loadImage("beboop/data/images/robots/robot1.png");
    robot2 = loadImage("beboop/data/images/robots/robot2.png");
    robot3 = loadImage("beboop/data/images/robots/robot3.png");
    robot4 = loadImage("beboop/data/images/robots/robot4.png");
    robot5 = loadImage("beboop/data/images/robots/robot5.png");
    robot6 = loadImage("beboop/data/images/robots/robot6.png");

    // dead robot images
    robot1Dead = loadImage("beboop/data/images/robots/robot1_dead.png");
    robot2Dead = loadImage("beboop/data/images/robots/robot2_dead.png");
    robot3Dead = loadImage("beboop/data/images/robots/robot3_dead.png");
    robot4Dead = loadImage("beboop/data/images/robots/robot4_dead.png");
    robot5Dead = loadImage("beboop/data/images/robots/robot5_dead.png");
    robot6Dead = loadImage("beboop/data/images/robots/robot6_dead.png");

    //screens
    bg = loadImage("beboop/data/images/bg.jpg");
    titleScreen = loadImage("beboop/data/images/title.png");
    infoScreen = loadImage("beboop/data/images/info.png");
    endScreen = loadImage("beboop/data/images/endScreen.png");
    hints = loadImage("beboop/data/images/hints.png");

    // speech bubbles
    help = loadImage("beboop/data/images/help.png");
    thankYou = loadImage("beboop/data/images/thank you.png");

    // fonts
    font = loadFont("beboop/data/pcsenior.ttf");
    sourceFont = loadFont("beboop/data/arial.ttf");

    //sounds
    soundFormats('mp3', 'wav');
    bgMusic = loadSound("beboop/data/sounds/bgMusic.wav");
    bing = loadSound("beboop/data/sounds/bing.mp3");
}

///////////////////////// GAME /////////////////////////////
function setup() {
    var cnv = createCanvas(700, 700);
    var x = (windowWidth - width) / 2;
    //cnv.position(x);
    cnv.parent('sketch-holder');

    circuit1 = new Circuit1();
    p1 = new Player(10, 595);
    npcs = [
        new NPC(robot1, robot1Dead, new Circuit1(), 500, 590),
        new NPC(robot6, robot6Dead, new Circuit2(), 1100, 590),
        new NPC(robot4, robot4Dead, new Circuit3(), 1700, 590),
        new NPC(robot5, robot5Dead, new Circuit4(), 2300, 590),
        new NPC(robot2, robot2Dead, new Circuit5(), 2900, 590),
        new NPC(robot3, robot3Dead, new Circuit6(), 3500, 590)
    ];
    screen = 0;
    gameOver = false;
    bgMusic.loop();
}

function draw() {
    if (screen === 0) {
        background(titleScreen);
    } else if (screen === 1) {
        background(infoScreen);
    } else if (gameOver) {
        background(endScreen);
        imageMode(CORNER);
        image(endScreen, 0, 0);
    } else {
        //----------- actual game ----------------
        isGameOver();
        background(197);

        circuit = false;
        for (let i = 0; i < npcs.length; i++) {
            let n = npcs[i];
            if (n.displayCircuit) {
                circuit = true;
                n.render();
                //hints during circuit game
                textFont(font, 10);
                fill(255);
                textAlign(LEFT);
                text("Press i for hints", 500, 25);

                // show hints during circuit game
                if (showHints) {
                    push();
                    imageMode(CENTER);
                    image(hints, width / 2, height / 2);
                    pop();
                }
                break;
            }
        }
        //if no circuit, player with robots rendered
        if (!circuit) {
            //calculating offset of screen
            push();
            let offset;
            if (p1.x < width / 2) {
                offset = 0;
            } else if (p1.x < 4000 - width / 2) {
                offset = -p1.x + width / 2;
            } else {
                offset = width - 4000;
            }

            //rendering player and npcs
            translate(offset, 0);
            imageMode(CORNER);
            image(bg, 0, 0);
            for (let i = 0; i < npcs.length; i++) {
                let n = npcs[i];
                if (!n.walkedPast) {
                    n.hasWalkedPast(p1.x);
                }
                n.render();
            }
            p1.render();
            p1.onKey();

            //hints during walking sequence
            textFont(font, 10);
            fill(255);
            textAlign(LEFT);
            text("Press i for hints", 500 + -offset, 25);
            text("<- -> keys to move", 25, 610);
            text("Click robots to help", 25, 635);

            if (showHints) {
                imageMode(CENTER);
                image(hints, width / 2 + -offset, height / 2);
            }
            pop();
        }
    }
}

///////////////////////// GAME METHODS /////////////////////////////
function isGameOver() {
    let allComplete = true;
    for (let i = 0; i < npcs.length; i++) {
        allComplete = allComplete && npcs[i].complete;
    }
    gameOver = allComplete && p1.x > 3950;
}

function restart() {
    bgMusic.stop();
    npcs = [
        new NPC(robot1, robot1Dead, new Circuit1(), 500, 590),
        new NPC(robot2, robot2Dead, new Circuit2(), 1100, 590),
        new NPC(robot3, robot3Dead, new Circuit3(), 1700, 590),
        new NPC(robot4, robot4Dead, new Circuit4(), 2300, 590),
        new NPC(robot5, robot5Dead, new Circuit5(), 2900, 590),
        new NPC(robot6, robot6Dead, new Circuit6(), 3500, 590)
    ];

    p1 = new Player(10, 590);
    bgMusic.loop();
    screen = 0;
    gameOver = false;
    showHints = false;

}


///////////// KEYBOARD FUNCTIONS /////////////////
function mousePressed() {
    for (let i = 0; i < npcs.length; i++) {
        let n = npcs[i];
        if (p1.x > n.x - 150 && p1.x < n.x + 150) {
            n.mouseP();
            break;
        }
    }
}

function mouseReleased() {
    for (let i = 0; i < npcs.length; i++) {
        let n = npcs[i];
        if (p1.x > n.x - 150 && p1.x < n.x + 150) {
            n.mouseR();
            break;
        }
    }
}

function keyPressed() {
    if (keyCode === ENTER || keyCode === RETURN) {
        screen ++;
    } else if (key === 'r' || key === 'R') {
        restart();
    } else if (key === 'i' || key === 'I') {
        showHints = !showHints;
    }
}