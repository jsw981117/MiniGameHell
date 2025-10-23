// 게임 설정
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 게임 상태
let gameState = {
    isRunning: false,
    isPaused: false,
    score: 0,
    frame: 0
};

// 버튼 이벤트 리스너
document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('pauseBtn').addEventListener('click', togglePause);
document.getElementById('resetBtn').addEventListener('click', resetGame);

// 키보드 입력 처리
const keys = {};
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// 게임 시작
function startGame() {
    if (!gameState.isRunning) {
        gameState.isRunning = true;
        gameState.isPaused = false;
        gameLoop();
    }
}

// 일시정지 토글
function togglePause() {
    if (gameState.isRunning) {
        gameState.isPaused = !gameState.isPaused;
        if (!gameState.isPaused) {
            gameLoop();
        }
    }
}

// 게임 재시작
function resetGame() {
    gameState.isRunning = false;
    gameState.isPaused = false;
    gameState.score = 0;
    gameState.frame = 0;
    updateScore();
    clearCanvas();
}

// 캔버스 초기화
function clearCanvas() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// 점수 업데이트
function updateScore() {
    document.getElementById('scoreValue').textContent = gameState.score;
}

// 게임 업데이트
function update() {
    gameState.frame++;

    // 여기에 게임 로직 추가
    // 예: 플레이어 이동, 충돌 감지, 점수 계산 등

    // 테스트: 프레임마다 점수 증가
    if (gameState.frame % 60 === 0) {
        gameState.score++;
        updateScore();
    }
}

// 게임 렌더링
function render() {
    clearCanvas();

    // 여기에 게임 그리기 로직 추가
    // 예: 플레이어, 적, 배경 등

    // 테스트: 움직이는 사각형 그리기
    ctx.fillStyle = '#fff';
    const x = (gameState.frame % canvas.width);
    ctx.fillRect(x, canvas.height / 2 - 25, 50, 50);
}

// 메인 게임 루프
function gameLoop() {
    if (!gameState.isRunning || gameState.isPaused) {
        return;
    }

    update();
    render();

    requestAnimationFrame(gameLoop);
}

// 초기 화면 설정
clearCanvas();
ctx.fillStyle = '#fff';
ctx.font = '30px Arial';
ctx.textAlign = 'center';
ctx.fillText('게임 시작 버튼을 눌러주세요', canvas.width / 2, canvas.height / 2);
