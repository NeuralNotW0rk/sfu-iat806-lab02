// Bounding (hyper)box dimensions
const width = 600;
const height = 600;
const depth = 600;
const redth = 600;
const greenth = 600;
const blueth = 600;

const n_max = 1000;
const n_min = 1;
const r_max = 100;
const r_min = 2;

let n = 10; // Number of balls
let r = 10; // Ball radius

// Positions
let cx = new Array(n_max).fill(0);
let cy = new Array(n_max).fill(0);
let cz = new Array(n_max).fill(0);
let cr = new Array(n_max).fill(0);
let cg = new Array(n_max).fill(0);
let cb = new Array(n_max).fill(0);

// Velocities
let cxp = new Array(n_max).fill(0);
let cyp = new Array(n_max).fill(0);
let czp = new Array(n_max).fill(0);
let crp = new Array(n_max).fill(0);
let cgp = new Array(n_max).fill(0);
let cbp = new Array(n_max).fill(0);

let drag = 0.01; // Drag coefficient (0-1)
let elast = 0.9; // Collision elasticity (0-1)

let bg = true; // Background toggle

/**
 * Check for boundaries and reverse direction on collision.
 * Also force ball within boundary to prevent clipping.
 * Takes pos and vel as objects to sync with main loop.
 * @param {int[]} pos Elementwise position vector
 * @param {int[]} vel Elementwise velocity vector
 * @param {int} index Element index
 * @param {int} range Size of bounded area
 * @param {boolean} ceiling Check ceiling (max value)
 * @param {boolean} floor Check floor (min value)
 */
function bounce(pos, vel, index, range, ceiling, floor) {
     if (ceiling && pos[index] >= range - r) {
        vel[index] = -vel[index] * elast;
        pos[index] = range - r + 1;
    }
    if (floor && pos[index] <= r) {
        vel[index] = -vel[index] * elast;
        pos[index] = r - 1;
    }
}

function setup() {
    createCanvas(width, height);
    // Random starting point in 6D
    for (let i = 0; i < n_max; i++) {
        cx[i] = random(r, width - r);
        cy[i] = random(r, height - r);
        cz[i] = random(r, depth - r);
        cr[i] = random(r, redth - r);
        cg[i] = random(r, greenth - r);
        cb[i] = random(r, blueth - r);
    }
}

function draw() {
    if (bg){
        background(0);
    }
    for (let i = 0; i < n; i++) {
        // Update positions
        cx[i] += cxp[i];
        cy[i] += cyp[i];
        cz[i] += czp[i];
        cr[i] += crp[i];
        cg[i] += cgp[i];
        cb[i] += cbp[i];

        // Check for boundary collisions
        bounce(cx, cxp, i, width, true, true);
        bounce(cy, cyp, i, height, true, false); // Open top
        bounce(cz, czp, i, width, true, true);
        bounce(cr, crp, i, redth, true, true);
        bounce(cg, cgp, i, greenth, true, true);
        bounce(cb, cbp, i, blueth, true, true);
        
        // Gravity
        cyp[i] += 1;

        // Drag
        cxp[i] *= 1 - drag;
        cyp[i] *= 1 - drag;
        czp[i] *= 1 - drag;
        crp[i] *= 1 - drag;
        cgp[i] *= 1 - drag;
        cbp[i] *= 1 - drag;

        noStroke();
        // R, G, and B positions determine ball color
        fill(cr[i] / redth * 255, cg[i] / greenth * 255, cb[i] / blueth * 255, 200);
        // X and Y behave normally, while Z scales ball size (0.5 at furthest distance)
        circle(cx[i], cy[i], r * (cz[i] + depth) / depth);
    }

    fill(255)
    text("balls: " + n, 50, 50)
    text("radius: " + r, 50, 70)
}

let accel = 0.1; // Click acceleration factor
let v = 100; // Random variability of click location

function mousePressed() {
    for (let i = 0; i < n; i++) {
        // Move toward mouse
        cxp[i] += (mouseX - cx[i] + random(-v, v)) * accel;
        cyp[i] += (mouseY - cy[i] + random(-v, v)  ) * accel;

        // Move toward "center"
        czp[i] += (depth / 2 - cz[i] + random(-v, v)) * accel;
        crp[i] += (redth / 2 - cr[i] + random(-v, v)) * accel;
        cgp[i] += (greenth / 2 - cg[i] + random(-v, v)) * accel;
        cbp[i] += (blueth / 2 - cb[i] + random(-v, v)) * accel;
    }
}

function keyPressed(){
    // Toggle background (turn off to stack frames)
    if (key === 't') {
        bg = !bg;
    }
    if (key === 'q' && n < n_max) {
        n++;
    }
    if (key === 'a' && n >= n_min + 1) {
        n--;
    }
    if (key === 'w' && r < r_max) {
        r++;
    }
    if (key === 's' && r >= r_min + 1) {
        r--;
    }
}