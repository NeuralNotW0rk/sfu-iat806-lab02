let width = 600;
let height = 600;
let depth = 600;
let redth = 600;
let greenth = 600;
let blueth = 600;

let r = 10;
let n = 100;

// Position
let cx = new Array(n).fill(0);
let cy = new Array(n).fill(0);
let cz = new Array(n).fill(0);
let cr = new Array(n).fill(0);
let cg = new Array(n).fill(0);
let cb = new Array(n).fill(0);

// Velocity
let cxp = new Array(n).fill(0);
let cyp = new Array(n).fill(0);
let czp = new Array(n).fill(0);
let crp = new Array(n).fill(0);
let cgp = new Array(n).fill(0);
let cbp = new Array(n).fill(0);

let drag = 0.01;
let elast = 0.9;

function setup() {
    createCanvas(width, height);
    // Random starting point in 6D
    for (let i = 0; i < n; i++) {
        cx[i] = random(r, width - r);
        cy[i] = random(r, height - r);
        cz[i] = random(r, depth - r);
        cr[i] = random(r, redth - r);
        cg[i] = random(r, greenth - r);
        cb[i] = random(r, blueth - r);
    }
}

function draw() {
    background(20);

    for (let i = 0; i < n; i++) {
        cx[i] += cxp[i];
        cy[i] += cyp[i];
        cz[i] += czp[i];
        cr[i] += crp[i];
        cg[i] += cgp[i];
        cb[i] += cbp[i];

        // Bounce
        if (cx[i] >= width - r || cx[i] <= r) {
            cxp[i] = -cxp[i] * elast;
        }
        if (cy[i] >= height - r) {
            cyp[i] = -cyp[i] * elast;
        } else {
            // Gravity
            cyp[i] += 1;
        }
        if (cz[i] >= depth - r || cz[i] <= r) {
            czp[i] = -czp[i] * elast;
        }
        if (cr[i] >= redth - r || cr[i] <= r) {
            crp[i] = -crp[i] * elast;
        }
        if (cg[i] >= greenth - r || cg[i] <= r) {
            cgp[i] = -cgp[i] * elast;
        }
        if (cb[i] >= blueth - r || cb[i] <= r) {
            cbp[i] = -cbp[i] * elast;
        }

        // Drag
        cxp[i] *= 1 - drag;
        cyp[i] *= 1 - drag;
        czp[i] *= 1 - drag;
        crp[i] *= 1 - drag;
        cgp[i] *= 1 - drag;
        cbp[i] *= 1 - drag;

        noStroke();
        fill(cr[i] / redth * 255, cg[i] / greenth * 255, cb[i] / blueth * 255, 200);
        circle(cx[i], cy[i], r * (cz[i] + depth) / depth);
    }

}

// Click strength and random variation
let accel = 0.1;
let v = 100;

function mousePressed() {
    for (let i = 0; i < n; i++) {
        // Move toward mouse
        cxp[i] += (mouseX - cx[i] + random(-v, v)) * accel;
        cyp[i] += (mouseY - cy[i] + random(-v, v)) * accel;

        // Move toward "center"
        czp[i] += (depth / 2 - cz[i] + random(-v, v)) * accel;
        crp[i] += (redth / 2 - cr[i] + random(-v, v)) * accel;
        cgp[i] += (greenth / 2 - cg[i] + random(-v, v)) * accel;
        cbp[i] += (blueth / 2 - cb[i] + random(-v, v)) * accel;
    }
}