// SELECT CANVAS
const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

// GAME VARS AND CONSTS
let totalBirds = 250;
let birds = [];

let frames = 0;
const DEGREE = Math.PI/180;

const sprite = new Image();
sprite.src = 'img/sprite.png';

const background = {
  sX: 0,
  sY: 0,
  width: 275,
  height: 226,
  x: 0,
  y: canvas.height - 226,

  draw: function () {
    context.drawImage(sprite, this.sX, this.sY, this.width, this.height, this.x, this.y, this.width, this.height);
    context.drawImage(sprite, this.sX, this.sY, this.width, this.height, this.x + this.width, this.y, this.width, this.height);
  }
}

const foreground = {
  sX: 276,
  sY: 0,
  width: 224,
  height: 112,
  x: 0,
  y: canvas.height - 112,

  dx: 2,

  update: function () {
    this.x = (this.x - this.dx)%(this.width/2);
  },

  draw: function () {
    context.drawImage(sprite, this.sX, this.sY, this.width, this.height, this.x, this.y, this.width, this.height);
    context.drawImage(sprite, this.sX, this.sY, this.width, this.height, this.x + this.width, this.y, this.width, this.height);
  }
}

const pipes = {
  position: [],

  top: {
    sX: 553,
    sY: 0,
  },
  bottom: {
    sX: 502,
    sY: 0,
  },

  width: 53,
  height: 400,
  gap: 85,
  maxYPosition: -150,
  dx: 2,

  update: function() {
    if(frames%110 == 0) {
      this.position.push({
        x: canvas.width,
        y: this.maxYPosition * (Math.random() + 1)
      });
    }
    for(let i = 0; i < this.position.length; i++) {
      let p = this.position[i];
      
      let bottomPipeYPosition = p.y + this.height + this.gap;

      // COLLISION DETECTION      
      for(let j = 0; j < birds.length; j++) {
        // TOP PIPE
        if(birds[j].x + birds[j].radius > p.x && birds[j].x - birds[j].radius < p.x + this.width && 
        birds[j].y + birds[j].radius > p.y && birds[j].y - birds[j].radius < p.y + this.height) {
          information.alive -= !birds[j].alive ? 0 : 1;
          birds[j].alive = false;
        }
        // BOTTOM PIPE
        if(birds[j].x + birds[j].radius > p.x && birds[j].x - birds[j].radius < p.x + this.width && 
        birds[j].y + birds[j].radius > bottomPipeYPosition && birds[j].y - birds[j].radius < 
        bottomPipeYPosition + this.height) {
          information.alive -= !birds[j].alive ? 0 : 1;
          birds[j].alive = false;
        }
      }

      // MOVE THE PIPES TO THE LEFT
      p.x -= this.dx;

      // if the pipes go beyond canvas, we delete them from the array
      if(p.x + this.width <= 0) {
        this.position.shift();
        information.score += 1;
        information.bestScore = Math.max(information.score, information.bestScore);
      }
    }
  },

  draw: function() {
    for (let i = 0; i < this.position.length; i++) {
      let p = this.position[i];

      let topYPosition = p.y;
      let bottomYPosition = p.y + this.height + this.gap;

      // top pipe
      context.drawImage(sprite, this.top.sX, this.top.sY, this.width, this.height, p.x, topYPosition, this.width, this.height);
      //bottom pipe
      context.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.width, this.height, p.x, bottomYPosition, this.width, this.height);
    }
  },

  reset: function() {
    this.position = [];
  }
}

class Bird {
  animation = [
    {sX: 276, sY: 112},
    {sX: 276, sY: 139},
    {sX: 276, sY: 164},
    {sX: 276, sY: 139},
  ];
  alive = true;
  x = 50;
  y = 150;
  width = 34;
  height = 26;

  radius = 12;

  frame = 0;

  gravity = 0.25;
  jump = 4.6;
  speed = 0;
  rotation = 0;

  update() {
    this.frame += frames % 5 == 0 ? 1 : 0;
    this.frame = this.frame % this.animation.length;

    this.speed += this.gravity;
    this.y += this.speed;
    this.rotation = 0;

    if(this.y + this.height/2 >= canvas.height - foreground.height) {
      this.y = canvas.height - foreground.height - this.height/2;
      this.alive = false;
      information.alive--;
    }

    if(this.speed >= this.jump) {
      this.rotation = 90 * DEGREE;
      this.frame = 1;
    }else {
      this.rotation = -25 * DEGREE;
    }
  }

  draw() {
    let bird = this.animation[this.frame];

    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.rotation);
    context.drawImage(sprite, bird.sX, bird.sY, this.width, this.height, - this.width/2, - this.height/2, this.width, this.height);
  
    context.restore();
  }

  flap() {
    if(this.y - this.radius <= 40) return;
    this.speed = -this.jump;
  }
}

const information = {
  score: 0,
  alive: totalBirds,
  generation: 1,
  bestScore: 0,

  draw: function() {
    context.fillStyle = '#FFF';
    context.strokeStyle = '#000';
    context.font = '35px Teko';

    context.fillText(this.score, 140, 50);
    context.strokeText(this.score, 140, 50);

    context.font = '20px Teko';

    context.fillText('Vivos: ' + this.alive, 20, 410);

    context.fillText('Geração: ' + this.generation, 20, 435);

    context.fillText('Recorde: ' + this.bestScore, 20, 460);
  },

  reset: function() {
    this.score = 0;
    this.alive = totalBirds;
  },
}

// IA
let Architect = synaptic.Architect;
let Network = synaptic.Network;
let genomes = [];
let genetic = new Genetic(2, 2, 1);

function updateIA() {
  let alive = totalBirds;
  for(let i = 0; i < birds.length; i++) {
    alive -= birds[i].alive ? 0 : 1;
    genomes[i].score = birds[i].alive ? information.score : genomes[i].score;

    if(birds[i].alive) {
      let input = [
        parseFloat((birds[i].y / 355).toFixed(2)),
        pipes.position.length == 0 ? 1: parseFloat(((pipes.position[0].y + pipes.height + (pipes.gap/2)) / 292.5).toFixed(2)),
      ];

      let active = genetic.activateNetwork(genomes[i], input);

      if (active[0] > 0.50) {
        birds[i].flap()
      }
    }
  }

  if(alive == 0) {
    genetic.prepareCrossover();
    information.generation++;
    reset();
  }
}

// CONTROL THE GAME
function createBirds() {
  while(birds.length < totalBirds) {
    birds.push(new Bird());
  }
};

createBirds();

function reset() {
  birds = [];
  pipes.reset();
  information.reset();
  createBirds();
}

// DRAW
function draw() {
  context.fillStyle = '#70c5ce';
  context.fillRect(0, 0, canvas.width, canvas.height);

  background.draw();
  pipes.draw();
  foreground.draw();
  for(let i = 0; i < birds.length; i++) {
    if(birds[i].alive) {
      birds[i].draw();
    };
  }
  information.draw();
}

// UPDATE
function update() {
  for(let i = 0; i < birds.length; i++) {
    if(birds[i].alive) {
      birds[i].update();
    }
  }
  foreground.update();
  pipes.update();
  updateIA();
}

// LOOP
(function loop() {
  update();
  draw();
  frames++;

  requestAnimationFrame(loop);
})();