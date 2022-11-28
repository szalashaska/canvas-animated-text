// Control variables
const connectionColorChannel = [255, 255, 255];
const particleColorChannel = [255, 255, 255];
const spredOfParticles = 20;
const thresholdConnectionDistance = 75;
let adjustX = 0;
let adjustY = 0;
const displayedText = "Hello";

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

// Font size and getImageData are responsible for text visibility
ctx.font = "30px Verdana";
ctx.fillStyle = "white";
// fillText(text, x, y, maxWidth)
ctx.fillText(displayedText, 0, 30);

// Scan for data with getImageData(coordiantes)
// const textCoords = ctx.getImageData(0, 0, 100, 100); -> by default
const textCoords = ctx.getImageData(0, 0, 100, 50);
// Area that we are scanning
ctx.strokeStyle = "white";
ctx.strokeRect(0, 0, 100, 50);

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 3;
    // Starting position of particles
    this.baseX = this.x;
    this.baseY = this.y;
    // Changing density increases the particles speed
    this.density = Math.random() * 40 + 5;
  }

  draw() {
    ctx.fillStyle = `rgb(${particleColorChannel[0]}, ${particleColorChannel[1]}, ${particleColorChannel[2]}`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }

  update() {
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let forceDirectionX = dx / distance;
    let forceDirectionY = dy / distance;
    let maxDistance = mouse.radius;
    // Calculates % of force depending on its distance from mouse
    let force = (maxDistance - distance) / maxDistance;
    // this.density: different particles will have different mass and move with different speed
    let directionX = forceDirectionX * force * this.density;
    let directionY = forceDirectionY * force * this.density;
    let returnSpeed = 10;

    if (distance < mouse.radius) {
      this.x -= directionX;
      this.y -= directionY;
    } else {
      // X and Y cases done seperatly, they don't exclude each other
      if (this.x !== this.baseX) {
        dx = this.x - this.baseX;
        // Dividing make particle goes slower
        this.x -= dx / returnSpeed;
      }
      if (this.y !== this.baseY) {
        dy = this.y - this.baseY;
        // Dividing make particle goes slower
        this.y -= dy / returnSpeed;
      }
    }
  }
}

// Fills array with particle objects
const init = () => {
  particleArray = [];
  for (let y = 0, y2 = textCoords.height; y < y2; y++) {
    for (let x = 0, x2 = textCoords.width; x < x2; x++) {
      // Opacity of element is more than 50%
      if (textCoords.data[y * 4 * textCoords.width + x * 4 + 3] > 128) {
        let positionX = x + adjustX;
        let positionY = y + adjustY;
        particleArray.push(
          new Particle(
            positionX * spredOfParticles,
            positionY * spredOfParticles
          )
        );
      }
    }
  }
};

const connect = () => {
  let oppacityValue = 1;
  for (let a = 0; a < particleArray.length; a++) {
    for (let b = a; b < particleArray.length; b++) {
      // calculate distance between every particle in array, a = b to prevent unnecessary calculation
      let dx = particleArray[a].x - particleArray[b].x;
      let dy = particleArray[a].y - particleArray[b].y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < thresholdConnectionDistance) {
        // Connect particles
        oppacityValue = 1 - distance / thresholdConnectionDistance;
        ctx.strokeStyle = `rgba(${connectionColorChannel[0]}, ${connectionColorChannel[1]}, ${connectionColorChannel[2]}, ${oppacityValue})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particleArray[a].x, particleArray[a].y);
        ctx.lineTo(particleArray[b].x, particleArray[b].y);
        ctx.stroke();
      }
    }
  }
};

// Animation loop
const animate = () => {
  // Clear canvas before each animation
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particleArray.length; i++) {
    particleArray[i].draw();
    particleArray[i].update();
  }
  connect();
  requestAnimationFrame(animate);
};

init();
animate();
