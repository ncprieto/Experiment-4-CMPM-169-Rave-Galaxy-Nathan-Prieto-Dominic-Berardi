// Dominic Berardi and Nathan Prieto
// February 2, 2023
// Adapted from https://openprocessing.org/sketch/1782562
const layers = 10;
let mic;
let fft;
let galaxies = [];
let gif;
let createGif;
let rave;

function preload(){
    gif = loadImage("galaxy.gif");
    createGif = createImg("galaxy.gif");
    rave = loadSound('rave.wav');
    rave.setVolume(0.5);
    rave.loop();
}

function setup(){
    rave.play();
    createCanvas(windowWidth,windowHeight,WEBGL);
    fft = new p5.FFT();
    userStartAudio();
    fft.setInput(rave);
    galaxies.push(new Spiral(20, 25, "#ffffff", false));
    galaxies.push(new Spiral(10, 20, "#ffffff", true));
    galaxies.push(new Spiral(20, 7, "#ffffff", true));
    galaxies.push(new Spiral(10, 10, "#ffffff", true));
    galaxies.push(new Spiral(10, 5, "#ffffff", true));
    galaxies.push(new Spiral(20, 7, "#ffffff", true));
    galaxies.push(new Spiral(5, 10, "#ffffff", true));
    galaxies.push(new Spiral(10, 20, "#ffffff", true));
    galaxies.push(new Spiral(25, 20, "#ffffff", true));
    galaxies.push(new Spiral(20, 7, "#ffffff", true));
    galaxies.push(new Spiral(10, 10, "#ffffff", true));
    galaxies.push(new Spiral(10, 5, "#ffffff", true));
}

function draw(){
    background(0);
    stroke(0);
	strokeWeight(2);
    noFill();
    // control for rotationg the objects
    orbitControl();
    push();
    // create a skybox by making putting a texture onto a really big cube
    texture(gif);
    box(3500, 3500, 3500);
    pop();
    angleMode(DEGREES);
    rotateX(75);
    rotateY(30);
    rotateZ(frameCount * 1);
    for(let i in galaxies){
        push();
        galaxies[i].draw();
        pop();
    }
    createGif.position(-1000, -1000);
}

// spiral class holds info about how many lines make
// up the sprial, how far lines are away from each other
// and the postion of the spirals
class Spiral{
    constructor(lines, spread, flag){
        this.lines   = lines;
        this.spread  = spread;
        this.color   = (random(0, 255), random(0, 255), random(0, 255));
        this.zOffset = random(-1000, 1000);
        this.GetOffsets(flag);
    }

    draw(){
        let spectrum = fft.analyze();
        spectrum.shift();
        spectrum.shift();
        spectrum.shift();
        smooth();
        let i = 0;
        angleMode(RADIANS);
        beginShape();
        let x,y,z;
        for (let k = 0; k < this.lines; k++){
            let g = 0;
            for (let a = 0; a < 2 * PI; a += (1/k * 1) + g){
                x = this.spread * k * cos(a) + this.xOffset;
                y = this.spread * k * sin(a) + this.yOffset;
                z = this.zOffset;
                if (i < spectrum.length){
                    z += spectrum[i++] * .5;
                    smooth();
                    stroke(color(random(0, 255), random(0, 255), random(0, 255)));
                }
                vertex(x,y,z);
                g += PI/100;
            }
        }
        endShape();
    }

    // get offsets creates offsets for the spiral based on some random values
    GetOffsets(flag){
        if(!flag){
            this.xOffset = 1;
            this.yOffset = 1;
            return;
        }
        else{
            let a = Math.floor(random(0, 2)) == 0;
            let b = Math.floor(random(0, 2)) == 0;
            if(!a && !b){
                this.xOffset = random(-500, -1000);
                this.yOffset = random(-200, -1000);
            }
            else if(!a && b){
                this.xOffset = random(-500, 1000);
                this.yOffset = random(-500, 1000);
            }
            else if(a && !b){
                this.xOffset = random(500, -1000);
                this.yOffset = random(500, -1000);
            }
            else{
                this.xOffset = random(500, 1000);
                this.yOffset = random(500, 1000);
            }
        }
    }
}