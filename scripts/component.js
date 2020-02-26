class Component {
  constructor(object) {
    this.width = object.width;
    this.height = object.height;
    this.color = object.color;
    this.x = object.x;
    this.y = object.y;

    this.speedX = 0;
    this.speedY = 0;

    this.centerGap = object.centerGap;
  }

  newPos() {
    this.x += this.speedX;
    this.y += this.speedY;
  }

  crashWith(otherobj) {
    var myleft = this.x;
    var myright = this.x + (this.width);
    var mytop = this.y;
    var mybottom = this.y + (this.height);
    var otherleft = otherobj.x;
    var otherright = otherobj.x + (otherobj.width);
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + (otherobj.height);
    var crash = true;
    if ((mybottom < othertop) ||
    (mytop > otherbottom) ||
    (myright < otherleft) ||
    (myleft > otherright)) {
      crash = false;
    }
    return crash;
  }

  crashWall() {
    var myleft = this.x;
    var myright = this.x + (this.width);
    var mytop = this.y;
    var mybottom = this.y + (this.height);
    
    var gameAreaLeft = 0;
    var gameAreaTop = 0;
    var gameAreaRight = 480;
    var gameAreaBottom = 270;

    var crash = false;

    if( (myleft < gameAreaLeft) || (myright > gameAreaRight) || (mytop < gameAreaTop) || (mybottom > gameAreaBottom) ) {
      crash = true;
    }

    return crash;
  }

}