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
let tower = null;
let projectilePool = null;
let player = null;
let star = null;
let enemyPool = null;

// 게임 상태
let gameState = {
  current: CONFIG.STATE.READY,
  score: 0,
  time: 0,
  lastTime: 0,
  enemyTimer: 0,
  enemyInterval: RUNTIME_CONFIG.enemy.spawnInterval.initial
};

// 입력 상태
let inputPressed = false;

/**
 * 캔버스 크기 조정 (반응형)
 */
function resizeCanvas() {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  // 실제 DOM 요소 높이 계산
  const topUI = document.querySelector('.top-ui');
  const controls = document.querySelector('.controls');
  const gameContainer = document.querySelector('.game-container');

  // UI 요소들의 실제 높이
  const topUIHeight = topUI ? topUI.offsetHeight : 0;
  const controlsHeight = controls ? controls.offsetHeight : 0;

  // 컨테이너 패딩 (CSS에서 20px * 2)
  const containerStyle = gameContainer ? window.getComputedStyle(gameContainer) : null;
  const containerPaddingTop = containerStyle ? parseInt(containerStyle.paddingTop) : 20;
  const containerPaddingBottom = containerStyle ? parseInt(containerStyle.paddingBottom) : 20;

  // 체력바 공간 (높이 30px + 여유 20px)
  const healthBarSpace = 50;

  // 캔버스와 다른 요소 사이의 마진 (여유 공간)
  const margins = 40;

  // 사용할 수 없는 공간 총합
  const reservedSpace = topUIHeight + controlsHeight + containerPaddingTop + containerPaddingBottom + margins + healthBarSpace;

  // 사용 가능한 공간 계산
  const availableWidth = windowWidth * 0.95;
  const availableHeight = windowHeight - reservedSpace;

  // 게임 박스 비율 계산
  const aspectRatio = gameBox.width / gameBox.height;
  const windowRatio = windowWidth / windowHeight;

  // 화면에 맞게 스케일 조정 (박스 비율 유지)
  if (windowRatio > aspectRatio) {
    // 세로가 제약 조건
    canvas.height = Math.min(Math.max(availableHeight, 300), gameBox.height);
    canvas.width = canvas.height * aspectRatio;
  } else {
    // 가로가 제약 조건
    canvas.width = Math.min(Math.max(availableWidth, 300), gameBox.width);
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
  tower = new Tower(gameBox.width, gameBox.height);

  projectilePool = new ProjectilePool(
    CONFIG.PROJECTILE.POOL_SIZE,
    gameBox.width,
    gameBox.height
  );

  player = new Player(
    (gameBox.width - CONFIG.PLAYER.WIDTH) / 2,
    gameBox.height - CONFIG.PLAYER.HEIGHT - 10,
    gameBox.width,
    gameBox.height
  );

  star = new Star(gameBox.width, gameBox.height);

  enemyPool = new EnemyPool(
    CONFIG.ENEMY.POOL_SIZE,
    gameBox.width,
    gameBox.height
  );

  // 게임 상태 초기화
  gameState.current = CONFIG.STATE.READY;
  gameState.score = 0;
  gameState.time = 0;
  gameState.enemyTimer = 0;
  gameState.enemyInterval = RUNTIME_CONFIG.enemy.spawnInterval.initial;

  updateScore();
  renderReadyScreen();
}

/**
 * 게임 시작
 */
function startGame() {
  if (gameState.current === CONFIG.STATE.READY || gameState.current === CONFIG.STATE.GAMEOVER) {
    // 오브젝트 리셋
    tower.reset();
    projectilePool.reset();
    player.reset();
    star.spawn();
    enemyPool.reset();

    // 상태 초기화
    gameState.current = CONFIG.STATE.PLAYING;
    gameState.score = 0;
    gameState.time = 0;
    gameState.lastTime = performance.now();
    gameState.enemyTimer = 0;
    gameState.enemyInterval = RUNTIME_CONFIG.enemy.spawnInterval.initial;

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
  // 활성 적 목록 가져오기
  const activeEnemies = enemyPool.getActive();
  const hasEnemies = activeEnemies.length > 0;

  // 타워 업데이트 (적이 있을 때 발사 여부 반환)
  const shouldShoot = tower.update(deltaTime, hasEnemies);
  if (shouldShoot && hasEnemies) {
    // 투사체 발사 (타워 중앙 상단에서)
    const towerCenterX = tower.x + tower.width / 2;
    const towerTopY = tower.y;
    projectilePool.spawn(towerCenterX, towerTopY, activeEnemies);
  }

  // 투사체 업데이트
  projectilePool.update(deltaTime);

  // 플레이어 업데이트
  player.update(deltaTime);

  // 별 업데이트
  star.update(deltaTime);

  // 적 업데이트 (타워 정보 필요)
  enemyPool.update(deltaTime, tower);

  // 적 생성 타이머
  gameState.enemyTimer += deltaTime;
  if (gameState.enemyTimer >= gameState.enemyInterval) {
    enemyPool.spawn();
    gameState.enemyTimer = 0;

    // 난이도 증가 (생성 주기 감소)
    gameState.enemyInterval = Math.max(
      gameState.enemyInterval * RUNTIME_CONFIG.enemy.spawnInterval.decreaseRate,
      RUNTIME_CONFIG.enemy.spawnInterval.minimum
    );
  }

  // 충돌 감지: 플레이어 ↔ 별
  if (checkCollision(player, star)) {
    gameState.score++;
    updateScore();
    tower.heal(RUNTIME_CONFIG.star.healAmount);
    star.spawn();
  }

  // 충돌 감지: 플레이어 ↔ 적
  for (let i = 0; i < activeEnemies.length; i++) {
    const enemy = activeEnemies[i];
    if (checkCollision(player, enemy)) {
      enemy.deactivate();
      tower.heal(RUNTIME_CONFIG.heal.enemyKill);
    }
  }

  // 충돌 감지: 투사체 ↔ 적
  const activeProjectiles = projectilePool.getActive();
  for (let i = 0; i < activeProjectiles.length; i++) {
    const projectile = activeProjectiles[i];
    for (let j = 0; j < activeEnemies.length; j++) {
      const enemy = activeEnemies[j];
      if (checkCollision(projectile, enemy)) {
        projectile.deactivate();
        enemy.deactivate();
        tower.heal(RUNTIME_CONFIG.heal.enemyKill);
        break; // 투사체는 하나의 적만 명중
      }
    }
  }

  // 충돌 감지: 적 ↔ 타워
  for (let i = 0; i < activeEnemies.length; i++) {
    const enemy = activeEnemies[i];
    if (checkCollision(enemy, tower)) {
      enemy.deactivate();
      tower.takeDamage();
    }
  }

  // 타워 체력 체크 (게임 오버)
  if (!tower.isAlive()) {
    gameOver();
    return;
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

  // 체력바 렌더링 (박스 위, scale 적용 전)
  renderTowerHealthBar();

  // 스케일 적용
  ctx.save();
  ctx.scale(scale, scale);

  // 박스 테두리
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, gameBox.width, gameBox.height);

  // 게임 오브젝트 렌더링 (뒤에서 앞으로)
  star.render(ctx);
  enemyPool.render(ctx);
  projectilePool.render(ctx);
  tower.render(ctx);
  player.render(ctx);

  ctx.restore();
}

/**
 * 타워 체력바 렌더링 (박스 밖 위쪽)
 */
function renderTowerHealthBar() {
  // 체력바 크기 (박스 너비의 90%)
  const barWidth = canvas.width * 0.9;
  const barHeight = 30;
  const barX = (canvas.width - barWidth) / 2;
  const barY = 10; // 캔버스 상단에서 10px 아래

  // 배경 (어두운 회색)
  ctx.fillStyle = '#333333';
  ctx.fillRect(barX, barY, barWidth, barHeight);

  // 체력 비율
  const hpRatio = tower.hp / tower.maxHp;

  // 체력에 따른 색상 (초록 → 노랑 → 빨강)
  let barColor;
  if (hpRatio > 0.6) {
    barColor = '#00ff00'; // 초록
  } else if (hpRatio > 0.3) {
    barColor = '#ffff00'; // 노랑
  } else {
    barColor = '#ff0000'; // 빨강
  }

  // 현재 체력
  ctx.fillStyle = barColor;
  ctx.fillRect(barX, barY, barWidth * hpRatio, barHeight);

  // 테두리
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.strokeRect(barX, barY, barWidth, barHeight);

  // 체력 텍스트
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(
    `Tower HP: ${Math.ceil(tower.hp)} / ${tower.maxHp}`,
    canvas.width / 2,
    barY + barHeight / 2
  );

  // 텍스트 그림자 효과
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3;
  ctx.strokeText(
    `Tower HP: ${Math.ceil(tower.hp)} / ${tower.maxHp}`,
    canvas.width / 2,
    barY + barHeight / 2
  );
  ctx.fillText(
    `Tower HP: ${Math.ceil(tower.hp)} / ${tower.maxHp}`,
    canvas.width / 2,
    barY + barHeight / 2
  );
}

/**
 * 준비 화면 렌더링
 */
function renderReadyScreen() {
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.scale(scale, scale);

  ctx.fillStyle = '#ffd700';
  ctx.font = 'bold 36px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Tower Defense Runner', gameBox.width / 2, gameBox.height / 2 - 60);

  ctx.fillStyle = '#ffffff';
  ctx.font = '22px Arial';
  ctx.fillText('스페이스바, 클릭, 터치로', gameBox.width / 2, gameBox.height / 2 - 10);

  ctx.fillStyle = '#00ff00';
  ctx.font = 'bold 24px Arial';
  ctx.fillText('게임 시작!', gameBox.width / 2, gameBox.height / 2 + 25);

  ctx.fillStyle = '#aaaaaa';
  ctx.font = '16px Arial';
  ctx.fillText('또는 하단 버튼을 클릭하세요', gameBox.width / 2, gameBox.height / 2 + 60);

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
  ctx.fillText('GAME OVER', gameBox.width / 2, gameBox.height / 2 - 60);

  ctx.fillStyle = '#ffd700';
  ctx.font = 'bold 30px Arial';
  ctx.fillText(`점수: ${gameState.score}`, gameBox.width / 2, gameBox.height / 2 + 10);

  ctx.fillStyle = '#ffffff';
  ctx.font = '22px Arial';
  ctx.fillText('스페이스바, 클릭, 터치로 재시작', gameBox.width / 2, gameBox.height / 2 + 55);

  ctx.fillStyle = '#aaaaaa';
  ctx.font = '16px Arial';
  ctx.fillText('또는 하단 버튼을 클릭하세요', gameBox.width / 2, gameBox.height / 2 + 85);

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

  // READY 상태에서 게임 시작
  if (gameState.current === CONFIG.STATE.READY) {
    startGame();
    inputPressed = true;
    return;
  }

  // GAMEOVER 상태에서 재시작
  if (gameState.current === CONFIG.STATE.GAMEOVER) {
    startGame();
    inputPressed = true;
    return;
  }

  // PLAYING 상태에서 점프
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
