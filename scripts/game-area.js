class GameArea {
  constructor() {
    this.canvas = document.createElement("canvas");
  }

  start() {
    this.canvas.width = 480;
    this.canvas.height = 270;
    this.context = this.canvas.getContext("2d");
    const board = document.querySelector("section .content");
    board.innerHTML = ""
    board.insertBefore(this.canvas, board.childNodes[0]);
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  addComponent(component) {
    this.context.fillStyle = component.color;
    this.context.fillRect(component.x, component.y, component.width, component.height);
  }

}
