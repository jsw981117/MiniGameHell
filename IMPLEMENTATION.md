# 🛠️ Star Dodge 구현 문서

## 📁 프로젝트 구조

```
MiniGameHell/
├── index.html              # 메인 HTML 파일
├── css/
│   └── style.css          # 게임 스타일시트
├── js/
│   ├── config.js          # 게임 설정 상수
│   ├── utils.js           # 유틸리티 함수
│   ├── Player.js          # 플레이어 클래스
│   ├── Star.js            # 별 클래스
│   ├── Meteor.js          # 메테오 클래스 (객체 풀링)
│   ├── game.js            # 메인 게임 로직
│   └── settings.js        # 설정 모달 관리
├── assets/
│   ├── images/            # 이미지 파일 (추후 확장)
│   ├── audio/             # 오디오 파일 (추후 확장)
│   └── fonts/             # 폰트 파일 (추후 확장)
├── GAME_DESIGN.md         # 게임 기획서
├── IMPLEMENTATION.md      # 구현 문서 (현재 파일)
└── README.md              # 프로젝트 README
```

---

## 🎯 핵심 구현 사항

### 1. 반응형 캔버스 시스템 (game.js)

**목적**: 다양한 화면 크기에서 일관된 게임 경험 제공

```javascript
function resizeCanvas() {
  const aspectRatio = gameBox.width / gameBox.height;
  const windowRatio = windowWidth / windowHeight;

  // 화면 비율에 따라 캔버스 크기 조정
  if (windowRatio > aspectRatio) {
    canvas.height = Math.min(windowHeight * 0.9, gameBox.height);
    canvas.width = canvas.height * aspectRatio;
  } else {
    canvas.width = Math.min(windowWidth * 0.9, gameBox.width);
    canvas.height = canvas.width / aspectRatio;
  }

  scale = canvas.width / gameBox.width;
}
```

**최적화**:
- `debounce` 함수 사용 (250ms)
- resize 이벤트 발생 횟수 제한

---

### 2. 객체 풀링 패턴 (Meteor.js)

**목적**: 메테오 생성/삭제 시 메모리 할당 최소화

```javascript
class MeteorPool {
  constructor(size) {
    this.pool = [];
    // 미리 객체 생성
    for (let i = 0; i < size; i++) {
      this.pool.push(new Meteor());
    }
  }

  spawn() {
    // 비활성 객체 재사용
    for (let i = 0; i < this.pool.length; i++) {
      if (!this.pool[i].active) {
        this.pool[i].spawn(boxWidth);
        return this.pool[i];
      }
    }
    return null;
  }
}
```

**장점**:
- 가비지 컬렉션 최소화
- 안정적인 FPS 유지
- 풀 크기: 20개 (CONFIG.METEOR.POOL_SIZE)

---

### 3. 물리 시스템 (Player.js)

**구현 내용**:
- 간단한 중력 적용
- 2단 점프 메커니즘
- 벽 충돌 시 방향 전환

```javascript
update(deltaTime) {
  // 중력 적용
  this.velocityY += RUNTIME_CONFIG.player.gravity * deltaTime;

  // 수직 이동
  this.y += this.velocityY * deltaTime;

  // 바닥 충돌 처리
  if (this.y + this.height >= this.boxHeight) {
    this.y = this.boxHeight - this.height;
    this.velocityY = 0;
    this.jumpCount = 0;  // 점프 카운터 리셋
  }
}
```

**deltaTime 사용**:
- 프레임 독립적 움직임
- `performance.now()` 사용

---

### 4. 충돌 감지 (utils.js)

**AABB (Axis-Aligned Bounding Box) 알고리즘**:

```javascript
function checkCollision(a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}
```

**선택 이유**:
- 원형 충돌보다 계산 빠름
- 사각형 객체에 적합
- 충분한 정확도

---

### 5. 게임 상태 관리 (game.js)

**4가지 상태**:
- `READY`: 초기 화면
- `PLAYING`: 게임 진행 중
- `PAUSED`: 일시정지
- `GAMEOVER`: 게임 종료

```javascript
const gameState = {
  current: CONFIG.STATE.READY,
  score: 0,
  time: 0,
  meteorTimer: 0,
  meteorInterval: 2.0
};
```

---

### 6. 난이도 증가 시스템 (game.js)

**메테오 생성 주기 동적 감소**:

```javascript
// 메테오 생성 후
gameState.meteorInterval = Math.max(
  gameState.meteorInterval * RUNTIME_CONFIG.meteor.spawnInterval.decreaseRate,
  RUNTIME_CONFIG.meteor.spawnInterval.minimum
);
```

**특징**:
- 지수 감소 (0.98 배율)
- 최소값 제한 (0.5초)
- 시간 경과에 따라 자동 난이도 상승

---

### 7. 입력 처리 (game.js)

**크로스 플랫폼 지원**:

```javascript
// 키보드 (PC)
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') handleInput();
});

// 마우스 (PC)
canvas.addEventListener('mousedown', handleInput);

// 터치 (모바일)
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  handleInput();
});
```

**중복 입력 방지**:
```javascript
let inputPressed = false;

function handleInput() {
  if (inputPressed) return;
  player.jump();
  inputPressed = true;
}
```

---

### 8. 설정 시스템 (settings.js)

**IIFE 패턴 사용**:
```javascript
(function() {
  // 설정 로직
})();
```

**기능**:
- 런타임 설정 변경
- 기본값 복원
- 세션 메모리에만 저장 (LocalStorage 미사용)

---

## ⚡ 성능 최적화

### 1. 렌더링 최적화
```javascript
// 화면 밖 객체 스킵
render(ctx) {
  if (!this.active) return;
  // 렌더링 로직
}
```

### 2. 반복문 최적화
```javascript
// forEach/map 대신 for 루프 사용
for (let i = 0; i < activeMeteors.length; i++) {
  if (checkCollision(player, activeMeteors[i])) {
    gameOver();
    return;
  }
}
```

### 3. DOM 조작 최소화
```javascript
// textContent만 업데이트
function updateScore() {
  document.getElementById('scoreValue').textContent = gameState.score;
}
```

### 4. 이벤트 Debounce
```javascript
window.addEventListener('resize', debounce(resizeCanvas, 250));
```

---

## 🎨 시각 효과

### 1. 별 반짝임 효과 (Star.js)
```javascript
const glowIntensity = (Math.sin(this.time * 5) + 1) / 2;
ctx.shadowBlur = 5 + glowIntensity * 5;
```

### 2. 메테오 꼬리 효과 (Meteor.js)
```javascript
ctx.fillStyle = '#ff8800';
ctx.globalAlpha = 0.6;
ctx.beginPath();
ctx.moveTo(x + width/2, y);
ctx.lineTo(x, y - 10);
ctx.lineTo(x + width, y - 10);
ctx.fill();
```

### 3. 게임 오버 페이드 (game.js)
```javascript
ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
ctx.fillRect(0, 0, canvas.width, canvas.height);
```

---

## 🔧 기술 스택

- **HTML5 Canvas**: 게임 렌더링
- **Vanilla JavaScript**: 프레임워크 미사용
- **CSS3**: UI 스타일링 (그라데이션, 애니메이션)
- **requestAnimationFrame**: 게임 루프

---

## 📊 코드 통계

| 파일 | 라인 수 | 역할 |
|------|---------|------|
| game.js | ~340 | 메인 게임 로직 |
| Player.js | ~100 | 플레이어 클래스 |
| Meteor.js | ~120 | 메테오 클래스 + 풀 |
| Star.js | ~80 | 별 클래스 |
| config.js | ~50 | 설정 상수 |
| utils.js | ~60 | 유틸리티 함수 |
| settings.js | ~110 | 설정 UI |
| **총합** | **~860** | |

---

## 🚀 실행 방법

### 1. 로컬에서 바로 실행
```bash
# 파일 탐색기에서 index.html 더블클릭
```

### 2. 로컬 서버 사용 (권장)
```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server

# 브라우저에서 http://localhost:8000 접속
```

---

## 🐛 알려진 이슈 & 개선 사항

### 현재 제한사항
- LocalStorage 미사용 (설정값 페이지 새로고침 시 초기화)
- 오디오 효과 없음
- 이미지 스프라이트 미사용 (도형으로만 구현)

### 향후 확장 가능 기능
- 리더보드 시스템
- 다양한 파워업 아이템
- 멀티플레이 모드
- 모바일 최적화 개선
- 게임 저장/불러오기

---

## 📝 코딩 규칙

1. **함수 주석**: JSDoc 형식 사용
2. **변수 명명**: camelCase
3. **클래스 명명**: PascalCase
4. **상수 명명**: UPPER_SNAKE_CASE
5. **들여쓰기**: 2 spaces

---

## ✅ 테스트 체크리스트

- [x] PC 브라우저 테스트 (Chrome, Firefox)
- [x] 모바일 반응형 테스트
- [x] 키보드 입력 (스페이스바)
- [x] 마우스 입력 (클릭)
- [x] 터치 입력 (모바일)
- [x] 설정 변경 및 적용
- [x] 게임 시작/일시정지/재시작
- [x] 충돌 감지 정확도
- [x] 난이도 증가 시스템
- [x] 게임 오버 처리

---

## 🏆 성능 지표

**목표 성능**:
- FPS: 60fps 유지
- 메모리: 50MB 이하
- 로딩 시간: 1초 이하

**최적화 기법**:
- 객체 풀링 (메테오)
- AABB 충돌 감지
- 불필요한 렌더링 스킵
- Debounce 이벤트 처리
