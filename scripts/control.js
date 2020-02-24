function stopMove(index) {
  players[index].speedY = 0;
  players[index].speedX = 0;
}

function moveUp(index) {
  players[index].speedY = -1;
}

function moveDown(index) {
  players[index].speedY = 1;
}

function moveLeft(index) {
  players[index].speedX = -1;
}

function moveRight(index) {
  players[index].speedX = 1;
}