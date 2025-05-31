const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const box = 20;
const canvasSize = 400;
let snake = [{ x: 9 * box, y: 10 * box }];
let direction = 'RIGHT'; // 초기 방향을 'RIGHT'로 설정
let food = randomPosition();
let specialFood = null;
let score = 0;
let gameInterval = null;
let isGameOver = false;
let missionText = '목표: 10점 달성!';

function randomPosition() {
  return {
    x: Math.floor(Math.random() * (canvasSize / box)) * box,
    y: Math.floor(Math.random() * (canvasSize / box)) * box
  };
}

function draw() {
  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw mission
  ctx.fillStyle = '#fff';
  ctx.font = '18px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(missionText, 10, 24);

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? '#6f6' : '#afa';
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // Draw food
  ctx.fillStyle = '#f44';
  ctx.fillRect(food.x, food.y, box, box);

  // Draw special food
  if (specialFood) {
    ctx.fillStyle = '#ff0';
    ctx.fillRect(specialFood.x, specialFood.y, box, box);
    ctx.fillStyle = '#222';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('★', specialFood.x + 4, specialFood.y + 16);
  }
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
    // 5점마다 특수 아이템 등장
    if (score % 5 === 0 && !specialFood) {
      specialFood = randomPosition();
    }
  } else if (specialFood && head.x === specialFood.x && head.y === specialFood.y) {
    snake.unshift(head);
    score += 3;
    document.getElementById('score').textContent = 'Score: ' + score;
    specialFood = null;
  } else {
    snake.unshift(head);
    snake.pop();
  }

  draw();

  // 미션 달성 시 텍스트 변경
  if (score >= 10) {
    missionText = '축하합니다! 목표 달성!';
  }
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
  direction = 'RIGHT'; // 재시작 시에도 초기 방향 설정
  food = randomPosition();
  specialFood = null;
  score = 0;
  isGameOver = false;
  missionText = '목표: 10점 달성!';
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
