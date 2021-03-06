// ----------------------- p5 setup() and draw() -----------------------
function setup() {
  frameRate(30);
  w = window.innerWidth;
  h = window.innerHeight;
  n = floor((w * h) / 3000);
  origin = createVector(w / 2, 0);
  setupMouseVec();
  followVec = mouseVec.copy();

  // some default settings
  angleMode(DEGREES);
  colorMode(RGB);
  frameRate(30);
  createCanvas(w, h);
  noStroke();
  noiseDetail(4, 0.5);

  textFont("Raleway");
}

function draw() {
  //background coloring on turbo values
  let totalTurbo = 0;
  for (let i = 0; i < stars.length; i++) {
    stars[i].turboMod();
    totalTurbo += stars[i].turbo;
  }
  const curveUp = x => pow(x, 0.5);
  let x = curveUp(totalTurbo / stars.length); // bass
  let bgAlpha = 255 - 180 * x;
  bgAlpha > 0 ? background(34, bgAlpha) : background(34);

  // vector creation
  setupMouseVec();
  if (stars.length != 0) {
    const diff = mouseVec.copy().sub(followVec).mult((totalTurbo / stars.length) * turnrate);
    followVec = followVec.add(diff).normalize();
  }

  // shoot the stars!
  for (let star of stars) {
    star.shoot();
    star.show();
    if (star.pos.x > w) {
      star.pos.x = 0;
      star.pos.y = random(0, h);
    } else if (star.pos.x < 0) {
      star.pos.x = w;
      star.pos.y = random(0, h);
    }

    if (star.pos.y > h) {
      star.pos.x = random(0, w);
      star.pos.y = 0;
    } else if (star.pos.y < 0) {
      star.pos.x = random(0, w);
      star.pos.y = h;
    }
  }

  setStars();

  // draw header text
  textSize(48);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  fill(255, 255);
  stroke(34);
  strokeWeight(2);
  let yText = 10 * sin((frameCount / 60) * 180);
  turboSpeed = 2 * (cos((frameCount / 30) * 180) + 1);
  text("welcome!", w / 2, (h / 2) - 3 + yText);
  turbo();

  let col = color("#23a8e6");
  fill(col);
  noStroke();
  rect(0, h - 6, w, h);
  //#23a8e6
  //#0f7daf
}

// ----------------------- other methods -----------------------
function setStars() {
  for (let i = 0; i < stars.length;) {
    if (stars[i].dead) {
      stars.splice(i, 1);
    } else {
      i++;
    }
  }
  let i = 0;
  while (i < 2) { // add at most 10 stars in one frame
    if (stars.length < n) {
      let x = int(random(0, w));
      let y = int(random(0, h));
      stars = [...stars, new star(x, y)] //.push(new star(x, y));
    }
    i++;
  }
  let x = stars.length - n;
  let randoms = [];
  while (x > 0) {
    let r = floor(random(stars.length));
    // re-do if that random value has already been used
    while (randoms.indexOf(r) != -1) {
      r = floor(random(stars.length));
    }
    randoms.push(r);
    stars[r].alive = stars[r].lifetime;
    x--;
  }
  // if (stars.length > n) {
  //   stars.pop();
  // }
}

function snapAllStars() {
  for (let i = 0; i < stars.length; i++) {
    stars[i].snap();
  }
}

function setupMouseVec() {
  if (tracking == 0) {
    mouseVec = createVector(-1, 0).rotate(mouseVecAngle);
  } else if (tracking == 1) {
    mouseVec = createVector(mouseX, mouseY).sub(origin).normalize()
  } else if (tracking == 2) {
    let noiseX = noise(offsetX);
    let noiseY = noise(offsetY);
    mouseVec = createVector(noiseX * w, noiseY * h).sub(origin).normalize()
    offsetX += 0.001;
    offsetY += 0.001;
  }
}

// gaussian curve approximation
function randn_bm() {
  let u = 0;
  let v = 0;
  while (u === 0) u = random(); //Converting [0,1) to (0,1)
  while (v === 0) v = random();
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  num = num / 10.0 + 0.5; // Translate to 0 -> 1
  if (num > 1 || num < 0) return randn_bm(); // resample between 0 and 1
  return num;
}

function turbo() {
  for (let i = 0; i < stars.length; i++) {
    stars[i].turbo = 1;
  }
}

// resize function
window.addEventListener('resize', function () {
  w = window.innerWidth;
  h = window.innerHeight;
  stars = [];
  setup();
})
