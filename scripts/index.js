let gameArea;
let players = [];
let obstacles = [];

let limitPlayers = 50;
let livePlayers = limitPlayers;

let generation = 1;
let score = 0;
let bestScore = 0;
let frames = 0;

let interval;

let genomes = [];
let Architect = synaptic.Architect;
let Network = synaptic.Network;
let genetic = new Genetic(2, 3);

function startGame() {

  gameArea = new GameArea();

  while(players.length < limitPlayers) {
    players.push(new Component({
      width: 30,
      height: 30,
      x: 10,
      y: 120,
      color: generateColor()
    }));
  }

  gameArea.start();

  interval = setInterval(refreshGame, 0);

}

function restartGame() { 
  gameArea = null;
  players = [];
  obstacles = [];

  livePlayers = limitPlayers;

  score = 0
  frames = 0;

  startGame();
}

function refreshGame() {

  gameArea.clear();

  frames++;
  score++;

  if (frames == 1 || everyinterval(150)) {
    moreObstacle();
  }

  obstacles.forEach(function (obstacle) {
    obstacle.speedX = -1;
    obstacle.newPos();
    gameArea.addComponent(obstacle);
  });

  players.forEach(function (player){
    if(!player.crashed) {
      player.newPos();
      gameArea.addComponent(player);
    }
  });

  let lastObstacles = obstacles.slice(-6); // pegar os ultimos 8 obstaculos

  checkCrash(lastObstacles);

  refreshInfo();
}

function checkCrash(lastObstacles) {

  for(let i = 0;i < players.length; i++) {
    for(let j = 0; j < lastObstacles.length; j++) {
      if (players[i].crashed) continue;
      if(players[i].crashWith(lastObstacles[j]) || players[i].crashWall()) {
        players[i].crashed = true;
        livePlayers--;
        if(livePlayers == 0) {
          clearInterval(interval)
          genetic.executeGenome(i, true);
          restartGame();
          return;
        }else {
          genetic.executeGenome(i, false);
          continue;
        }
      }
    }
    if (players[i].crashed) continue;

    let distanceWidth = Math.abs(players[i].x - lastObstacles[0].x);
    let distanceHeight = Math.abs(players[i].y - lastObstacles[0].centerGap);

    let input = [
      distanceWidth,
      distanceHeight
    ];

    var active = genetic.activateNetwork(genomes[i], input);

    validaState(active, i);
  }
}

function validaState(active, pos) {
  if (active[0] >= 0.60) {
    moveUp(pos);
  }
  else if (active[0] <= 0.40) {
    moveDown(pos);
  }
  else {
    stopMove(pos);
  }
}

function refreshInfo() {
  let elementScore = document.querySelector(".score");
  elementScore.innerHTML = score;

  let elementBesScore = document.querySelector(".best-score");
  elementBesScore.innerHTML = bestScore;

  let elementLivePlayers = document.querySelector(".live-players");
  elementLivePlayers.innerHTML = livePlayers + "/" + limitPlayers;

  let elementGeneration = document.querySelector(".generation");
  elementGeneration.innerHTML = generation;
}

function moreObstacle() {
  let x = gameArea.canvas.width;

  let minHeight = 20;
  let maxHeight = 160;
  let height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);

  let gap = 100;

  let centerGap = Math.floor(height + (gap/2));

  //obstacle top
  obstacles.push(new Component({
    width: 10,
    height: height,
    x: x,
    y: 0,
    color: "green",
    centerGap
  }));

  //obstacle bottom
  obstacles.push(new Component({
    width: 10,
    height: x - height - gap,
    x: x,
    y: height + gap,
    color: "green",
    centerGap
  }));
}

function generateColor() {
  let hexadecimal = '0123456789ABCDEF';
  let color = '#';

  for (var i = 0; i < 6; i++) {
    color += hexadecimal[Math.floor(Math.random() * 16)];
  }

  return color
}

function everyinterval(n) {
  if ((frames / n) % 1 == 0) {return true;}
  return false;
}