const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const displayPlayerScore = document.querySelector(".player");
const displayAiScore = document.querySelector(".ai");
const buttonRestart = document.querySelector(".restart");

canvas.width = 700;
canvas.height = 500;

let boardWidth = canvas.width;
let playerScore = 0;
let aiScore = 0;
const difficulty = 0.2;
const ballSpeed = 2;

const ballMoves = gameBalls => {
  gameBalls.forEach(ball => {
    ball.moveBall(collObjects);
  });
};

const changeBoardSize = () => {
  boardWidth = canvas.width;
  aiPaddle.posX = canvas.width - 30;
};

const screenRefresher = () => {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const controlWithKeyboard = e => {
  console.log(e.keyCode);
  if (e.keyCode === 87) playerPaddle.moveUp(collObjects);
  else if (e.keyCode === 83) playerPaddle.moveDown(collObjects);
};

const updateScore = () => {
  displayPlayerScore.textContent = playerScore;
  displayAiScore.textContent = aiScore;
};

const gameReset = () => {
  clearInterval(play);
  playerScore = aiScore = 0;
  gameBalls.forEach(ball => {
    ball.restartBall();
  });
  play = setInterval(game, 1000 / 60);
};

class Paddle {
  constructor(width, height, posX, posY, color) {
    this.width = width;
    this.height = height;
    this.posX = posX;
    this.posY = posY;
    this.color = color;
    this.speed = 4;
    this.middleHeight = height / 2;
  }

  moveUp = collObjects => {
    this.posY -= this.speed;
  };

  moveDown = collObjects => {
    this.posY += this.speed;
  };
}

class Ball {
  constructor(size, posX, posY, color) {
    this.width = size;
    this.height = size;
    this.color = color;
    this.posX = posX;
    this.posY = posY;
    this.middleHeight = size / 2;
    this.speedX = ballSpeed;
    this.speedY = ballSpeed;
    this.directionX = true;
    this.directionY = true;
  }

  restartBall = () => {
    if (Math.round(Math.random())) this.directionX = !this.directionX;
    if (Math.round(Math.random())) this.directionY = !this.directionY;
    this.speedX = ballSpeed;
    this.speedY = ballSpeed;
    this.posX = canvas.width / 2 - this.width / 2;
    this.posY = canvas.height / 2 - this.height / 2;
  };

  moveBall = collObject => {
    let collision = 0;
    const ballLeft = this.posX;
    const ballRight = this.posX + this.width;
    const ballTop = this.posY;
    const ballBottom = this.posY + this.height;

    if (this.directionX && this.directionY) {
      for (let i = 0; i < collObject.length; i++) {
        let objLeft = collObject[i].posX;
        let objRight = collObject[i].posX + collObject[i].width;
        let objTop = collObject[i].posY;
        let objBottom = collObject[i].posY + collObject[i].height;

        if (this === collObject[i]) continue;
        else if (
          ((objLeft <= ballLeft && ballLeft <= objRight) ||
            (objLeft <= ballRight && ballRight <= objRight)) &&
          ((objTop <= ballTop && ballTop <= objBottom) ||
            (objTop <= ballBottom && ballBottom <= objBottom))
        ) {
          this.directionX != this.directionX;
          break;
        }

        if (
          ballLeft < objRight &&
          ((objLeft <= ballLeft + this.speedX &&
            ballLeft + this.speedX <= objRight) ||
            (objLeft <= ballRight + this.speedX &&
              ballRight + this.speedX <= objRight)) &&
          ballTop < objBottom &&
          ((objTop <= ballTop + this.speedY &&
            ballTop + this.speedY <= objBottom) ||
            (objTop <= ballBottom + this.speedY &&
              ballBottom + this.speedY <= objBottom))
        ) {
          collision = 1;
          break;
        } else if (ballBottom + this.speedY > canvas.height) {
          collision = 2;
          break;
        } else if (ballRight + this.speedX > canvas.width) {
          collision = 3;
          playerScore++;
          break;
        }
      }
    } else if (this.directionX && !this.directionY) {
      for (let i = 0; i < collObject.length; i++) {
        let objLeft = collObject[i].posX;
        let objRight = collObject[i].posX + collObject[i].width;
        let objTop = collObject[i].posY;
        let objBottom = collObject[i].posY + collObject[i].height;

        if (this === collObject[i]) continue;
        else if (
          ((objLeft <= ballLeft && ballLeft <= objRight) ||
            (objLeft <= ballRight && ballRight <= objRight)) &&
          ((objTop <= ballTop && ballTop <= objBottom) ||
            (objTop <= ballBottom && ballBottom <= objBottom))
        ) {
          this.directionX != this.directionX;
          break;
        }

        if (
          ballLeft < objRight &&
          ((objLeft <= ballLeft + this.speedX &&
            ballLeft + this.speedX <= objRight) ||
            (objLeft <= ballRight + this.speedX &&
              ballRight + this.speedX <= objRight)) &&
          (ballBottom > objTop &&
            ((objTop <= ballTop - this.speedY &&
              ballTop - this.speedY <= objBottom) ||
              (objTop <= ballBottom - this.speedY &&
                ballBottom - this.speedY <= objBottom)))
        ) {
          collision = 1;
          break;
        } else if (ballTop - this.speedY < 0) {
          collision = 2;
          break;
        } else if (ballRight + this.speedX > canvas.width) {
          collision = 3;
          playerScore++;
          break;
        }
      }
    } else if (!this.directionX && this.directionY) {
      for (let i = 0; i < collObject.length; i++) {
        let objLeft = collObject[i].posX;
        let objRight = collObject[i].posX + collObject[i].width;
        let objTop = collObject[i].posY;
        let objBottom = collObject[i].posY + collObject[i].height;

        if (this === collObject[i]) continue;
        else if (
          ((objLeft <= ballLeft && ballLeft <= objRight) ||
            (objLeft <= ballRight && ballRight <= objRight)) &&
          ((objTop <= ballTop && ballTop <= objBottom) ||
            (objTop <= ballBottom && ballBottom <= objBottom))
        ) {
          this.directionX != this.directionX;
          break;
        }

        if (
          ballRight > objLeft &&
          ((objLeft <= ballLeft - this.speedX &&
            ballLeft - this.speedX <= objRight) ||
            (objLeft <= ballRight - this.speedX &&
              ballRight - this.speedX <= objRight)) &&
          ballTop < objBottom &&
          ((objTop <= ballTop + this.speedY &&
            ballTop + this.speedY <= objBottom) ||
            (objTop <= ballBottom + this.speedY &&
              ballBottom + this.speedY <= objBottom))
        ) {
          collision = 1;
          break;
        } else if (ballBottom + this.speedY > canvas.height) {
          collision = 2;
          break;
        } else if (ballLeft - this.speedX < 0) {
          collision = 3;
          aiScore++;
          break;
        }
      }
    } else {
      for (let i = 0; i < collObject.length; i++) {
        let objLeft = collObject[i].posX;
        let objRight = collObject[i].posX + collObject[i].width;
        let objTop = collObject[i].posY;
        let objBottom = collObject[i].posY + collObject[i].height;

        if (this === collObject[i]) continue;
        else if (
          ((objLeft <= ballLeft && ballLeft <= objRight) ||
            (objLeft <= ballRight && ballRight <= objRight)) &&
          ((objTop <= ballTop && ballTop <= objBottom) ||
            (objTop <= ballBottom && ballBottom <= objBottom))
        ) {
          this.directionX != this.directionX;
          break;
        }

        if (
          ballRight > objLeft &&
          ((objLeft <= ballLeft - this.speedX &&
            ballLeft - this.speedX <= objRight) ||
            (objLeft <= ballRight - this.speedX &&
              ballRight - this.speedX <= objRight)) &&
          (ballBottom > objTop &&
            ((objTop <= ballTop - this.speedY &&
              ballTop - this.speedY <= objBottom) ||
              (objTop <= ballBottom - this.speedY &&
                ballBottom - this.speedY <= objBottom)))
        ) {
          collision = 1;
          break;
        } else if (ballTop - this.speedY < 0) {
          collision = 2;
          break;
        } else if (ballLeft - this.speedX < 0) {
          collision = 3;
          aiScore++;
          break;
        }
      }
    }
    if (collision) {
      if (Math.round(Math.random()))
        this.speedX += difficulty + Math.round(Math.random()) / 8;
      else this.speedY += difficulty + Math.round(Math.random()) / 10;
      if (collision == 1) {
        this.directionX = !this.directionX;
        if (Math.round(Math.random())) this.directionY = !this.directionY;
      } else if (collision == 2) {
        this.directionY = !this.directionY;
      } else {
        this.restartBall();
      }
    } else {
      if (this.directionX) this.posX += this.speedX;
      else this.posX -= this.speedX;
      if (this.directionY) this.posY += this.speedY;
      else this.posY -= this.speedY;
    }
  };
}

const drawObject = (collObjects, context) => {
  collObjects.forEach(collObject => {
    context.fillStyle = collObject.color;
    context.fillRect(
      collObject.posX,
      collObject.posY,
      collObject.width,
      collObject.height
    );
  });
};

const collObjects = [];
const gameBalls = [];

const playerPaddle = new Paddle(20, 120, 10, 50, "blue");
const aiPaddle = new Paddle(20, 120, canvas.width - 30, 100, "orange");
const ball = new Ball(10, canvas.width / 2 - 4, canvas.height / 2 - 4, "green");

collObjects.push(playerPaddle, aiPaddle, ball);
gameBalls.push(ball);

const game = () => {
  if (boardWidth !== canvas.width) changeBoardSize();
  screenRefresher();
  ballMoves(gameBalls);
  updateScore();
  drawObject(collObjects, ctx);
  if (playerScore == 15 || aiScore == 15) clearInterval(play);
};

buttonRestart.addEventListener("click", gameReset);
window.addEventListener("keydown", controlWithKeyboard);
let play = setInterval(game, 1000 / 60);
