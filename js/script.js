const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const displayPlayerScore = document.querySelector(".player");
const displayAiScore = document.querySelector(".ai");
const buttonRestart = document.querySelector(".restart");
const moreBalls = document.querySelector(".ball");
const lessBalls = document.querySelector(".less");

canvas.width = 1000;
canvas.height = 500;

let boardWidth = canvas.width;
let playerScore = 0;
let aiScore = 0;
let setScore = 25;
let multi = false;
let difficulty = 0.2;
let ballSpeed = 2;
let paddleSpeed = 8;

const addBalls = () => {
  const ball = new Ball(
    15,
    canvas.width / 2 - 4,
    canvas.height / 2 - 4,
    "white"
  );
  collObjects.push(ball);
  gameBalls.push(ball);
};

const removeBall = () => {
  if (collObjects.length > 3) collObjects.pop();
  if (gameBalls.length > 1) gameBalls.pop();
};

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
  if (e.keyCode === 87) playerPaddle.moveUp(gameBalls);
  if (e.keyCode === 83) playerPaddle.moveDown(gameBalls);
  if (multi) {
    if (e.keyCode === 38) aiPaddle.moveUp(gameBalls);
    if (e.keyCode === 40) aiPaddle.moveDown(gameBalls);
  }
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
    this.speed = paddleSpeed;
    this.middleHeight = height / 2;
  }

  aiMove(gameBalls) {
    let closest = canvas.width;
    let closestCount;
    let temp;
    for (let i = 0; i < gameBalls.length; i++) {
      if (this.posX < gameBalls[i].posX) {
        temp = this.posX - gameBalls[i].posX;
      } else {
        temp = gameBalls[i].posX - this.posX;
      }
      if (closest > temp) {
        closest = temp;
        closestCount = i;
      }
    }
    if (
      this.posY + this.middleHeight >
      gameBalls[closestCount].posY + gameBalls[closestCount].middleHeight
    ) {
      this.moveUp(gameBalls);
    } else {
      this.moveDown(gameBalls);
    }
  }

  moveUp(gameBalls) {
    const paddleTop = this.posY;
    const paddleLeft = this.posX;
    const paddleRight = this.posX + this.width;
    let ballBottom;
    let ballLeft;
    let ballRight;
    let collision = false;

    for (let i = 0; i < gameBalls.length; i++) {
      ballBottom = gameBalls[i].posY + gameBalls[i].height;
      ballLeft = gameBalls[i].posX;
      ballRight = gameBalls[i].posX + gameBalls[i].width;

      if (
        ((paddleLeft <= ballLeft && ballLeft <= paddleRight) ||
          (paddleLeft <= ballRight && ballRight <= paddleRight)) &&
        (paddleTop >= ballBottom && paddleTop - this.speed <= ballBottom)
      ) {
        this.posY = ballBottom;
        collision = !collision;
        break;
      } else if (paddleTop - this.speed < 0) {
        this.posY = 0;
        collision = !collision;
        break;
      }
    }

    if (!collision) this.posY -= this.speed;
  }

  moveDown(gameBalls) {
    const paddleBottom = this.posY + this.height;
    const paddleLeft = this.posX;
    const paddleRight = this.posX + this.width;
    let ballTop;
    let ballLeft;
    let ballRight;
    let collision = false;

    for (let i = 0; i < gameBalls.length; i++) {
      ballTop = gameBalls[i].posY;
      ballLeft = gameBalls[i].posX;
      ballRight = gameBalls[i].posX + gameBalls[i].width;

      if (
        ((paddleLeft <= ballLeft && ballLeft <= paddleRight) ||
          (paddleLeft <= ballRight && ballRight <= paddleRight)) &&
        (paddleBottom <= ballTop && paddleBottom + this.speed >= ballTop)
      ) {
        this.posY = ballTop - this.height;
        collision = !collision;
        break;
      } else if (paddleBottom + this.speed > canvas.height) {
        this.posY = canvas.height - this.height;
        collision = !collision;
        break;
      }
    }

    if (!collision) this.posY += this.speed;
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
    this.speedX = ballSpeed;
    this.speedY = ballSpeed;
    this.directionX = true;
    this.directionY = true;
  }

  restartBall() {
    if (Math.round(Math.random())) this.directionX = !this.directionX;
    if (Math.round(Math.random())) this.directionY = !this.directionY;
    this.speedX = ballSpeed;
    this.speedY = ballSpeed;
    this.posX = canvas.width / 2 - this.width / 2;
    this.posY = canvas.height / 2 - this.height / 2;
  }

  moveBall(collObject) {
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
  }
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

const playerPaddle = new Paddle(18, 110, 10, 50, "red");
const aiPaddle = new Paddle(18, 110, canvas.width - 30, 100, "blue");
const ball = new Ball(15, canvas.width / 2 - 4, canvas.height / 2 - 4, "white");

collObjects.push(playerPaddle, aiPaddle, ball);
gameBalls.push(ball);

const game = () => {
  if (boardWidth !== canvas.width) changeBoardSize();
  screenRefresher();
  ballMoves(gameBalls);
  // if (!multi)
  aiPaddle.aiMove(gameBalls);
  updateScore();
  drawObject(collObjects, ctx);
  if (playerScore == setScore || aiScore == setScore) clearInterval(play);
};

buttonRestart.addEventListener("click", gameReset);
moreBalls.addEventListener("click", addBalls);
lessBalls.addEventListener("click", removeBall);
window.addEventListener("keydown", controlWithKeyboard);
let play = setInterval(game, 1000 / 60);
