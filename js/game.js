// 캔버스 설정
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 게임 박스 크기 (기준)
let gameBox = {
  width: CONFIG.BOX.WIDTH,
  height: CONFIG.BOX.HEIGHT
};

// 스케일 비율
let scale = 1;

// 게임 오브젝트
let player = null;
let star = null;
let meteorPool = null;

// 게임 상태
let gameState = {
  current: CONFIG.STATE.READY,
  score: 0,
  time: 0,
  lastTime: 0,
  meteorTimer: 0,
  meteorInterval: RUNTIME_CONFIG.meteor.spawnInterval.initial
};

// 입력 상태
let inputPressed = false;

/**
 * 캔버스 크기 조정 (반응형)
 */
function resizeCanvas() {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  // 게임 박스 비율 계산
  const aspectRatio = gameBox.width / gameBox.height;
  const windowRatio = windowWidth / windowHeight;

  // 화면에 맞게 스케일 조정
  if (windowRatio > aspectRatio) {
    // 세로가 기준
    canvas.height = Math.min(windowHeight * 0.9, gameBox.height);
    canvas.width = canvas.height * aspectRatio;
  } else {
    // 가로가 기준
    canvas.width = Math.min(windowWidth * 0.9, gameBox.width);
    canvas.height = canvas.width / aspectRatio;
  }

  scale = canvas.width / gameBox.width;
}

/**
 * 게임 초기화
 */
function initGame() {
  resizeCanvas();

  // 게임 오브젝트 생성
  player = new Player(
    (gameBox.width - CONFIG.PLAYER.WIDTH) / 2,
    gameBox.height - CONFIG.PLAYER.HEIGHT - 10,
    gameBox.width,
    gameBox.height
  );

  star = new Star(gameBox.width, gameBox.height);
  meteorPool = new MeteorPool(CONFIG.METEOR.POOL_SIZE, gameBox.width, gameBox.height);

  // 게임 상태 초기화
  gameState.current = CONFIG.STATE.READY;
  gameState.score = 0;
  gameState.time = 0;
  gameState.meteorTimer = 0;
  gameState.meteorInterval = RUNTIME_CONFIG.meteor.spawnInterval.initial;

  updateScore();
  renderReadyScreen();
}

/**
 * 게임 시작
 */
function startGame() {
  if (gameState.current === CONFIG.STATE.READY || gameState.current === CONFIG.STATE.GAMEOVER) {
    // 오브젝트 리셋
    player.reset();
    star.spawn();
    meteorPool.reset();

    // 상태 초기화
    gameState.current = CONFIG.STATE.PLAYING;
    gameState.score = 0;
    gameState.time = 0;
    gameState.lastTime = performance.now();
    gameState.meteorTimer = 0;
    gameState.meteorInterval = RUNTIME_CONFIG.meteor.spawnInterval.initial;

    updateScore();
    gameLoop();
  }
}

/**
 * 게임 일시정지
 */
function togglePause() {
  if (gameState.current === CONFIG.STATE.PLAYING) {
    gameState.current = CONFIG.STATE.PAUSED;
  } else if (gameState.current === CONFIG.STATE.PAUSED) {
    gameState.current = CONFIG.STATE.PLAYING;
    gameState.lastTime = performance.now();
    gameLoop();
  }
}

/**
 * 게임 재시작
 */
function resetGame() {
  initGame();
}

/**
 * 게임 오버
 */
function gameOver() {
  gameState.current = CONFIG.STATE.GAMEOVER;
  renderGameOverScreen();
}

/**
 * 점수 업데이트
 */
function updateScore() {
  document.getElementById('scoreValue').textContent = gameState.score;
}

/**
 * 게임 업데이트
 */
function update(deltaTime) {
  // 플레이어 업데이트
  player.update(deltaTime);

  // 별 업데이트
  star.update(deltaTime);

  // 메테오 업데이트
  meteorPool.update(deltaTime);

  // 메테오 생성 타이머
  gameState.meteorTimer += deltaTime;
  if (gameState.meteorTimer >= gameState.meteorInterval) {
    meteorPool.spawn();
    gameState.meteorTimer = 0;

    // 난이도 증가 (생성 주기 감소)
    gameState.meteorInterval = Math.max(
      gameState.meteorInterval * RUNTIME_CONFIG.meteor.spawnInterval.decreaseRate,
      RUNTIME_CONFIG.meteor.spawnInterval.minimum
    );
  }

  // 충돌 감지: 플레이어 ↔ 별
  if (checkCollision(player, star)) {
    gameState.score++;
    updateScore();
    star.spawn();
  }

  // 충돌 감지: 플레이어 ↔ 메테오
  const activeMeteors = meteorPool.getActive();
  for (let i = 0; i < activeMeteors.length; i++) {
    if (checkCollision(player, activeMeteors[i])) {
      gameOver();
      return;
    }
  }

  // 게임 시간 증가
  gameState.time += deltaTime;
}

/**
 * 게임 렌더링
 */
function render() {
  // 캔버스 초기화
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 스케일 적용
  ctx.save();
  ctx.scale(scale, scale);

  // 박스 테두리
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, gameBox.width, gameBox.height);

  // 게임 오브젝트 렌더링
  star.render(ctx);
  meteorPool.render(ctx);
  player.render(ctx);

  ctx.restore();
}

/**
 * 준비 화면 렌더링
 */
function renderReadyScreen() {
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.scale(scale, scale);

  ctx.fillStyle = '#ffffff';
  ctx.font = '40px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Star Dodge', gameBox.width / 2, gameBox.height / 2 - 50);

  ctx.font = '20px Arial';
  ctx.fillText('스페이스바 또는 화면 터치로 점프', gameBox.width / 2, gameBox.height / 2);
  ctx.fillText('게임 시작 버튼을 눌러주세요', gameBox.width / 2, gameBox.height / 2 + 40);

  ctx.restore();
}

/**
 * 게임 오버 화면 렌더링
 */
function renderGameOverScreen() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.scale(scale, scale);

  ctx.fillStyle = '#ff4444';
  ctx.font = 'bold 50px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('GAME OVER', gameBox.width / 2, gameBox.height / 2 - 50);

  ctx.fillStyle = '#ffffff';
  ctx.font = '30px Arial';
  ctx.fillText(`점수: ${gameState.score}`, gameBox.width / 2, gameBox.height / 2 + 20);

  ctx.font = '20px Arial';
  ctx.fillText('재시작 버튼을 눌러주세요', gameBox.width / 2, gameBox.height / 2 + 70);

  ctx.restore();
}

/**
 * 메인 게임 루프
 */
function gameLoop() {
  if (gameState.current !== CONFIG.STATE.PLAYING) {
    return;
  }

  const currentTime = performance.now();
  const deltaTime = (currentTime - gameState.lastTime) / 1000; // 초 단위
  gameState.lastTime = currentTime;

  update(deltaTime);
  render();

  requestAnimationFrame(gameLoop);
}

/**
 * 입력 처리
 */
function handleInput() {
  if (inputPressed) return;

  if (gameState.current === CONFIG.STATE.PLAYING) {
    player.jump();
    inputPressed = true;
  }
}

// 이벤트 리스너
document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('pauseBtn').addEventListener('click', togglePause);
document.getElementById('resetBtn').addEventListener('click', resetGame);

// 키보드 입력 (스페이스바)
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !inputPressed) {
    handleInput();
  }
});

document.addEventListener('keyup', (e) => {
  if (e.code === 'Space') {
    inputPressed = false;
  }
});

// 마우스 클릭
canvas.addEventListener('mousedown', handleInput);
canvas.addEventListener('mouseup', () => {
  inputPressed = false;
});

// 터치 입력
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  handleInput();
});

canvas.addEventListener('touchend', () => {
  inputPressed = false;
});

// 창 크기 변경 시 캔버스 리사이즈
window.addEventListener('resize', debounce(() => {
  resizeCanvas();
  if (gameState.current === CONFIG.STATE.READY) {
    renderReadyScreen();
  } else if (gameState.current === CONFIG.STATE.GAMEOVER) {
    renderGameOverScreen();
  }
}, 250));

// 게임 초기화
initGame();
