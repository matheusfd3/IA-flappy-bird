const canvas = document.querySelector('#game');
const context = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 400;

const totalBirds = 25;
let liveBirds = totalBirds;

let angle = 0;
let frame = 0;
let score = 0;
let bestScore = 0;
let gamespeed = 2;

let generation = 1;

let genomes = [];
let Architect = synaptic.Architect;
let Network = synaptic.Network;
let genetic = new Genetic(4, 2);

let animationFrame;
let fps = 1000 / 60;

const dragonImg = new Image();
dragonImg.src = 'dragon.png'

function main() {
  while(birdsArray.length < totalBirds) {
    birdsArray.push(new Bird());
  }

  run();
}

function run() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  
  handleObstacles();
  handleBirds();
  handleCollisions();
  handleInfo();
  
  animationFrame = requestAnimationFrame(run);

  angle += 0.12;
  frame++;
}

function reset() {
  cancelAnimationFrame(animationFrame);

  obstaclesArray = [];
  birdsArray = [];

  frame = 0;
  score = 0;

  liveBirds = totalBirds;

  main();
}

function handleCollisions() {
  for(let i = 0;i < birdsArray.length; i++) {
    if (birdsArray[i].crashed) continue;

    const closerObstacle = obstaclesArray.slice(0).reverse().find(obstacle => !obstacle.counted);

    if (checkBirdCrashWithObstacle(birdsArray[i], closerObstacle)) {
      birdsArray[i].crashed = true;
      liveBirds--;

      if(liveBirds === 0) {
        genetic.executeGenome(i, true);
        reset();
        return;
      }else {
        genetic.executeGenome(i, false);
        continue;
      }
    }

    let input = [
      birdsArray[i].y,
      closerObstacle.x,
      closerObstacle.top,
      closerObstacle.bottom
    ];

    var active = genetic.activateNetwork(genomes[i], input);

    if (active[0] >= 0.50) {
      birdsArray[i].fly = true;
    }
    else  {
      birdsArray[i].fly = false;
    }
  }
}

function checkBirdCrashWithObstacle(bird, obstacle) {
  var birdTop = bird.y;
  var birdBottom = bird.y + bird.height;
  var birdRigh = bird.x + bird.width;

  var obstacleTop = {
    position: obstacle.x,
    height: obstacle.top
  }

  var obstacleBottom = {
    position: obstacle.x,
    height: canvas.height - obstacle.bottom
  }

  if((birdTop <= obstacleTop.height && birdRigh >= obstacleTop.position) ||
      (birdBottom >= obstacleBottom.height && birdRigh >= obstacleBottom.position)) {
    return true;
  }

  return false;
}
