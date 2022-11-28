const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray = [];

// handle mouse integration
const mouse = {
  x: null,
  y: null,
  radius: 150,
};

window.addEventListener("mousemove", (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

ctx.font = "30px Verdana";
ctx.fillStyle = "white";
// fillText(text, x, y, maxWidth)
ctx.fillText("A", 50, 40);

// Scan for data with getImageData(coordiantes)
const data = ctx.getImageData(0, 0, 100, 100);
// Area that we are scanning
// ctx.strokeStyle = "white";
// ctx.strokeRect(0, 0, 100, 100);

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 3;
    // Starting position of particles
    this.baseX = this.x;
    this.baseY = this.y;
    this.density = Math.random() * 30 + 1;
  }

  draw() {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }

  update() {
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 100) {
      this.size = 30;
    } else {
      this.size = 3;
    }
  }
}

// Fills array with particle objects
const init = () => {
  particleArray = [];
  for (let i = 0; i < 1500; i++) {
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    particleArray.push(new Particle(x, y));
  }
};

init();
console.log(particleArray);

// Animation loop
const animate = () => {
  // Clear canvas before each animation
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particleArray.length; i++) {
    particleArray[i].draw();
    particleArray[i].update();
  }
  requestAnimationFrame(animate);
};
animate();
