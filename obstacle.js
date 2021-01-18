let obstaclesArray = [];

class Obstacle {
  constructor() {
    this.top = (Math.random() * canvas.height/3) + 20;
    this.bottom = (Math.random() * canvas.height/3) + 20;
    this.x = canvas.width;
    this.width = 20;
    this.color = 'hsla(' + frame + ',100%, 50%, 1)';
    this.counted = false;
  }

  update() {
    this.x -= gamespeed;
    if(!this.counted && this.x < 150) {
      score++;
      this.counted = true;
    } 
  }

  draw() {
    context.fillStyle = this.color;
    context.fillRect(this.x, 0, this.width, this.top);
    context.fillRect(this.x, canvas.height - this.bottom, this.width, this.bottom);
  }
}

function handleObstacles() {
  if(frame%50 === 0) {
    obstaclesArray.unshift(new Obstacle())
  }

  for(let i = 0; i < obstaclesArray.length; i++) {
    obstaclesArray[i].update();
    obstaclesArray[i].draw();
  }

  if(obstaclesArray.length > 7) {
    obstaclesArray.pop();
  }
}