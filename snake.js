const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const box = 20;
const canvasSize = 400;
let snake = [{ x: 9 * box, y: 10 * box }];
let direction = null;
let food = randomPosition();
let score = 0;
let gameInterval = null;
let isGameOver = false;

function randomPosition() {
  return {
    x: Math.floor(Math.random() * (canvasSize / box)) * box,
    y: Math.floor(Math.random() * (canvasSize / box)) * box
  };
}

function draw() {
  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? '#6f6' : '#afa';
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // Draw food
  ctx.fillStyle = '#f44';
  ctx.fillRect(food.x, food.y, box, box);
}

function move() {
  if (isGameOver) return;

  let head = { x: snake[0].x, y: snake[0].y };

  if (direction === 'LEFT') head.x -= box;
  if (direction === 'RIGHT') head.x += box;
  if (direction === 'UP') head.y -= box;
  if (direction === 'DOWN') head.y += box;

  // Wall collision
  if (
    head.x < 0 || head.x >= canvasSize ||
    head.y < 0 || head.y >= canvasSize
  ) {
    gameOver();
    return;
  }

  // Self collision
  for (let i = 0; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      gameOver();
      return;
    }
  }

  // Food collision
  if (head.x === food.x && head.y === food.y) {
    snake.unshift(head);
    score++;
    document.getElementById('score').textContent = 'Score: ' + score;
    food = randomPosition();
  } else {
    snake.unshift(head);
    snake.pop();
  }

  draw();
}

function gameOver() {
  clearInterval(gameInterval);
  isGameOver = true;
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#fff';
  ctx.font = '32px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
  document.getElementById('restart').style.display = 'inline-block';
}

function restartGame() {
  snake = [{ x: 9 * box, y: 10 * box }];
  direction = null;
  food = randomPosition();
  score = 0;
  isGameOver = false;
  document.getElementById('score').textContent = 'Score: 0';
  document.getElementById('restart').style.display = 'none';
  draw();
  clearInterval(gameInterval);
  gameInterval = setInterval(move, 120);
}

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
  else if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
  else if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
  else if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
});

document.getElementById('restart').onclick = restartGame;

draw();
gameInterval = setInterval(move, 120);
