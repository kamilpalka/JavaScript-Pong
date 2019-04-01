const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1000;
canvas.height = 500;

class Paddel {
  constructor(width, height, posX, posY, color) {
    this.width = width;
    this.height = height;
    this.posX = posX;
    this.posY = posY;
    this.color = color;
    this.speed = 4;
    this.middleHeight = height / 2;
  }
}

class Ball {
  constructor(size, posX, posY, color) {
    this.width = size;
    this.height = size;
    this.color = color;
    this.posX = posX;
    this.posY = posY;
    this.middleHeight = size / 2;
    this.speedX = 2;
    this.speedY = 2;
    this.DirectionX = true;
    this.DirectionY = true;
  }
}

const drawObject = (collisionObjects, context) => {
  collisionObjects.forEach(collisionObject => {
    context.fillStyle = collisionObject.color;
    context.fillRect(
      collisionObject.posX,
      collisionObject.posY,
      collisionObject.width,
      collisionObject.height
    );
  });
};

const collisionObjects = [];

const playerPaddel = new Paddel(20, 120, 10, 50, "blue");
const aiPaddel = new Paddel(20, 120, canvas.width - 30, 100, "black");
const ball = new Ball(30, canvas.width / 2 - 4, canvas.height / 2 - 4, "green");

collisionObjects.push(playerPaddel, aiPaddel, ball);
drawObject(collisionObjects, ctx);

console.log(playerPaddel);
