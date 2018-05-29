var buses;

function setup() {
    let w = window.innerWidth;
    let h = w / 3.2;
    var canvas = createCanvas(w, h);
    buses = new Array(new Bus(loadImage("https://i.imgur.com/kC2OZ2t.png"), 0, w / 50, w / 8.5, w / 13.5, true),
        new Bus(loadImage("https://i.imgur.com/BOebGkB.png"), w, w / 8.5, w / 8.5, w / 13.5, false),
        new Bus(loadImage("https://i.imgur.com/FT3njHY.png"), 0, w / 4.5, w / 8.5, w / 13.5, true));
    // Move the canvas so it's inside our <div id="sketch-holder">.
    //canvas.position(0);
    canvas.parent('bus-holder');
}

function draw() {
    background(125, 90, 165);
    for (var i = 0; i < buses.length; i++) {
        buses[i].render();
        buses[i].move();
    }
}

function mouseMoved() {
    for (var i = 0; i < buses.length; i++) {
        if (mouseX > buses[i].x && mouseX < buses[i].x + buses[i].w && mouseY > buses[i].y && mouseY < buses[i].y + buses[i].h) {
            cursor(HAND);
            break;
        } else {
            cursor(ARROW);
        }
    }
}

function mouseReleased() {

    for (var i = 0; i < buses.length; i++) {
        if (mouseX > buses[i].x && mouseX < buses[i].x + buses[i].w
            && mouseY > buses[i].y && mouseY < buses[i].y + buses[i].h) {
            if (i === 0) {
                window.open("https://amymluo.github.io/bus-activities");
            } else if (i === 1) {
                window.open("https://amymluo.github.io/bus-activities");
            } else {
                window.open("https://amymluo.github.io/bus-activities");
            }
            break;
        }
    }
}

class Bus {
    constructor(img, x, y, w, h, right, func) {
        this.img = img;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.right = right;
        this.speed = random(1, 3);
        this.func = func;
    }

    render() {
        push();
        image(this.img, this.x, this.y, this.w, this.h);
        pop();
    }

    move() {
        if (this.right) {
            if (this.x < width) {
                this.x += this.speed;
            } else {
                this.x = 0;
            }
        } else {
            if (this.x > 0 - this.w) {
                this.x -= this.speed;
            } else {
                this.x = width;
            }
        }
    }
}
