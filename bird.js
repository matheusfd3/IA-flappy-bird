let birdsArray = [];

class Bird {
  constructor() {
    this.x = 150;
    this.y = 200;
    this.vy = 0;

    this.width = 20;
    this.height = 20;
    this.weight = 1;

    this.fly = false;
    this.crashed = false;
  }

  update() {
    let curve = Math.sin(angle) * 20;
    if(this.y > canvas.height - (this.height * 3) + curve) {
      this.y = canvas.height - (this.height * 3) + curve;
      this.vy = 0;
    }else {
      this.vy += this.weight;
      this.vy *= 0.9;
      this.y += this.vy;
    }

    if(this.y < 0 + this.height) {
      this.y = 0 + this.height;
      this.vy = 0;
    }

    if(this.fly && this.y > this.height * 3) this.flap();
  }

  flap() {
    this.vy -= 2;
  }

  draw() {
    context.fillStyle = this.color;
    context.drawImage(dragonImg, this.x - 15, this.y - 5, 40, 30);
    // context.fillRect(this.x, this.y, this.width, this.height);
  }
}

function handleBirds() {
  for(let i = 0; i < birdsArray.length; i++) {
    if(!birdsArray[i].crashed) {
      birdsArray[i].update();
      birdsArray[i].draw();
    }
    
  }
}