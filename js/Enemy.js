// 적 클래스
class Enemy {
  constructor() {
    this.color = CONFIG.ENEMY.COLOR;
    this.active = false;
    this.x = 0;
    this.y = 0;
    this.speed = 0;
    this.hp = RUNTIME_CONFIG.enemy.hp;

    // AI 단계: 'falling' 또는 'walking'
    this.phase = 'falling';

    // 크기 초기화
    this.updateSize();
  }

  /**
   * 크기 업데이트 (설정 변경 시 호출)
   */
  updateSize() {
    this.width = RUNTIME_CONFIG.enemy.width;
    this.height = RUNTIME_CONFIG.enemy.height;
  }

  /**
   * 적 활성화 및 초기화
   * @param {number} boxWidth - 박스 너비
   */
  spawn(boxWidth) {
    this.active = true;
    this.x = randomInt(0, boxWidth - this.width);
    this.y = -this.height;
    this.speed = randomFloat(
      RUNTIME_CONFIG.enemy.minSpeed,
      RUNTIME_CONFIG.enemy.maxSpeed
    );
    this.hp = RUNTIME_CONFIG.enemy.hp;
    this.phase = 'falling';
  }

  /**
   * 적 업데이트
   * @param {number} deltaTime - 프레임 시간 (초)
   * @param {number} boxWidth - 박스 너비
   * @param {number} boxHeight - 박스 높이
   * @param {Object} tower - 타워 객체
   */
  update(deltaTime, boxWidth, boxHeight, tower) {
    if (!this.active) return;

    if (this.phase === 'falling') {
      // 1단계: 낙하
      this.y += this.speed * deltaTime;

      // 바닥에 도착하면 걷기 단계로 전환
      if (this.y + this.height >= boxHeight) {
        this.y = boxHeight - this.height;
        this.phase = 'walking';
        // 지상 이동 속도로 변경
        this.speed *= RUNTIME_CONFIG.enemy.groundSpeedMult;
      }
    } else if (this.phase === 'walking') {
      // 2단계: 타워를 향해 걷기
      const towerCenterX = tower.x + tower.width / 2;
      const enemyCenterX = this.x + this.width / 2;

      // 타워 방향으로 이동
      if (enemyCenterX < towerCenterX) {
        this.x += this.speed * deltaTime;
        // 타워를 지나치지 않도록
        if (this.x + this.width / 2 > towerCenterX) {
          this.x = towerCenterX - this.width / 2;
        }
      } else if (enemyCenterX > towerCenterX) {
        this.x -= this.speed * deltaTime;
        // 타워를 지나치지 않도록
        if (this.x + this.width / 2 < towerCenterX) {
          this.x = towerCenterX - this.width / 2;
        }
      }

      // 화면 밖으로 나가지 않도록 제한
      if (this.x < 0) this.x = 0;
      if (this.x + this.width > boxWidth) this.x = boxWidth - this.width;
    }
  }

  /**
   * 데미지 받기
   * @param {number} damage - 데미지량
   * @returns {boolean} - 죽었는지 여부
   */
  takeDamage(damage = 1) {
    this.hp -= damage;
    if (this.hp <= 0) {
      this.active = false;
      return true; // 죽음
    }
    return false; // 살아있음
  }

  /**
   * 적 그리기
   * @param {CanvasRenderingContext2D} ctx - 캔버스 컨텍스트
   */
  render(ctx) {
    if (!this.active) return;

    // 적 본체
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // 단계에 따른 시각 효과
    if (this.phase === 'falling') {
      // 낙하 중: 불타는 효과 (꼬리)
      ctx.fillStyle = '#ff8800';
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.moveTo(this.x + this.width / 2, this.y);
      ctx.lineTo(this.x, this.y - 10);
      ctx.lineTo(this.x + this.width, this.y - 10);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1.0;
    } else if (this.phase === 'walking') {
      // 걷기 중: 발 표시 (작은 사각형)
      ctx.fillStyle = '#aa0000';
      ctx.fillRect(this.x + 5, this.y + this.height, 10, 5);
      ctx.fillRect(this.x + this.width - 15, this.y + this.height, 10, 5);
    }

    // 테두리
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);

    // HP바 (HP가 1보다 큰 경우에만)
    if (RUNTIME_CONFIG.enemy.hp > 1) {
      const barWidth = this.width;
      const barHeight = 4;
      const barX = this.x;
      const barY = this.y - 8;

      // 배경
      ctx.fillStyle = '#000000';
      ctx.fillRect(barX, barY, barWidth, barHeight);

      // 현재 HP
      const hpRatio = this.hp / RUNTIME_CONFIG.enemy.hp;
      ctx.fillStyle = '#00ff00';
      ctx.fillRect(barX, barY, barWidth * hpRatio, barHeight);
    }
  }

  /**
   * 적 비활성화
   */
  deactivate() {
    this.active = false;
  }
}

// 적 풀 관리 클래스
class EnemyPool {
  constructor(size, boxWidth, boxHeight) {
    this.pool = [];
    this.boxWidth = boxWidth;
    this.boxHeight = boxHeight;

    // 객체 풀 미리 생성
    for (let i = 0; i < size; i++) {
      this.pool.push(new Enemy());
    }
  }

  /**
   * 사용 가능한 적 가져오기
   * @returns {Enemy|null}
   */
  spawn() {
    // 비활성 적 찾기
    for (let i = 0; i < this.pool.length; i++) {
      if (!this.pool[i].active) {
        this.pool[i].spawn(this.boxWidth);
        return this.pool[i];
      }
    }
    return null; // 풀이 가득 찬 경우
  }

  /**
   * 모든 적 업데이트
   * @param {number} deltaTime - 프레임 시간 (초)
   * @param {Object} tower - 타워 객체
   */
  update(deltaTime, tower) {
    for (let i = 0; i < this.pool.length; i++) {
      this.pool[i].update(deltaTime, this.boxWidth, this.boxHeight, tower);
    }
  }

  /**
   * 모든 활성 적 그리기
   * @param {CanvasRenderingContext2D} ctx - 캔버스 컨텍스트
   */
  render(ctx) {
    for (let i = 0; i < this.pool.length; i++) {
      this.pool[i].render(ctx);
    }
  }

  /**
   * 활성 적 목록 반환
   * @returns {Array<Enemy>}
   */
  getActive() {
    const active = [];
    for (let i = 0; i < this.pool.length; i++) {
      if (this.pool[i].active) {
        active.push(this.pool[i]);
      }
    }
    return active;
  }

  /**
   * 모든 적 비활성화
   */
  reset() {
    for (let i = 0; i < this.pool.length; i++) {
      this.pool[i].deactivate();
    }
  }

  /**
   * 모든 적 크기 일괄 업데이트
   */
  updateAllSizes() {
    for (let i = 0; i < this.pool.length; i++) {
      this.pool[i].updateSize();
    }
  }
}
