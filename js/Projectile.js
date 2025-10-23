// 투사체 클래스
class Projectile {
  constructor() {
    this.color = CONFIG.PROJECTILE.COLOR;
    this.active = false;
    this.x = 0;
    this.y = 0;
    this.velocityX = 0;
    this.velocityY = 0;

    // 크기 초기화
    this.updateSize();
  }

  /**
   * 크기 업데이트 (설정 변경 시 호출)
   */
  updateSize() {
    this.width = RUNTIME_CONFIG.projectile.width;
    this.height = RUNTIME_CONFIG.projectile.height;
  }

  /**
   * 투사체 활성화 및 초기화
   * @param {number} x - 시작 x 좌표
   * @param {number} y - 시작 y 좌표
   * @param {Object|null} target - 목표 적 (없으면 null)
   */
  spawn(x, y, target) {
    this.active = true;
    this.x = x;
    this.y = y;

    const speed = RUNTIME_CONFIG.projectile.speed;

    if (target) {
      // 타겟이 있으면 타겟 방향으로 발사
      const dx = target.x + target.width / 2 - x;
      const dy = target.y + target.height / 2 - y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // 정규화된 방향 벡터에 속도 곱하기
      this.velocityX = (dx / distance) * speed;
      this.velocityY = (dy / distance) * speed;
    } else {
      // 타겟이 없으면 위로 발사
      this.velocityX = 0;
      this.velocityY = -speed;
    }
  }

  /**
   * 투사체 업데이트
   * @param {number} deltaTime - 프레임 시간 (초)
   * @param {number} boxWidth - 박스 너비
   * @param {number} boxHeight - 박스 높이
   */
  update(deltaTime, boxWidth, boxHeight) {
    if (!this.active) return;

    this.x += this.velocityX * deltaTime;
    this.y += this.velocityY * deltaTime;

    // 화면 밖으로 나가면 비활성화
    if (
      this.x + this.width < 0 ||
      this.x > boxWidth ||
      this.y + this.height < 0 ||
      this.y > boxHeight
    ) {
      this.active = false;
    }
  }

  /**
   * 투사체 그리기
   * @param {CanvasRenderingContext2D} ctx - 캔버스 컨텍스트
   */
  render(ctx) {
    if (!this.active) return;

    // 빛나는 효과
    ctx.shadowBlur = 5;
    ctx.shadowColor = this.color;

    // 투사체 본체
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(
      this.x + this.width / 2,
      this.y + this.height / 2,
      this.width / 2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // 그림자 제거
    ctx.shadowBlur = 0;

    // 테두리
    ctx.strokeStyle = '#ffcc00';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(
      this.x + this.width / 2,
      this.y + this.height / 2,
      this.width / 2,
      0,
      Math.PI * 2
    );
    ctx.stroke();
  }

  /**
   * 투사체 비활성화
   */
  deactivate() {
    this.active = false;
  }
}

// 투사체 풀 관리 클래스
class ProjectilePool {
  constructor(size, boxWidth, boxHeight) {
    this.pool = [];
    this.boxWidth = boxWidth;
    this.boxHeight = boxHeight;

    // 객체 풀 미리 생성
    for (let i = 0; i < size; i++) {
      this.pool.push(new Projectile());
    }
  }

  /**
   * 가장 가까운 적 찾기
   * @param {number} x - 타워 x 좌표
   * @param {number} y - 타워 y 좌표
   * @param {Array} enemies - 활성 적 목록
   * @returns {Object|null} - 가장 가까운 적 또는 null
   */
  findClosestEnemy(x, y, enemies) {
    if (enemies.length === 0) return null;

    let closest = null;
    let minDistance = Infinity;

    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      const dx = enemy.x + enemy.width / 2 - x;
      const dy = enemy.y + enemy.height / 2 - y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < minDistance) {
        minDistance = distance;
        closest = enemy;
      }
    }

    return closest;
  }

  /**
   * 투사체 발사
   * @param {number} x - 시작 x 좌표
   * @param {number} y - 시작 y 좌표
   * @param {Array} enemies - 활성 적 목록
   * @returns {Projectile|null}
   */
  spawn(x, y, enemies) {
    // 비활성 투사체 찾기
    for (let i = 0; i < this.pool.length; i++) {
      if (!this.pool[i].active) {
        // 가장 가까운 적 찾기
        const target = this.findClosestEnemy(x, y, enemies);
        this.pool[i].spawn(x, y, target);
        return this.pool[i];
      }
    }
    return null; // 풀이 가득 찬 경우
  }

  /**
   * 모든 투사체 업데이트
   * @param {number} deltaTime - 프레임 시간 (초)
   */
  update(deltaTime) {
    for (let i = 0; i < this.pool.length; i++) {
      this.pool[i].update(deltaTime, this.boxWidth, this.boxHeight);
    }
  }

  /**
   * 모든 활성 투사체 그리기
   * @param {CanvasRenderingContext2D} ctx - 캔버스 컨텍스트
   */
  render(ctx) {
    for (let i = 0; i < this.pool.length; i++) {
      this.pool[i].render(ctx);
    }
  }

  /**
   * 활성 투사체 목록 반환
   * @returns {Array<Projectile>}
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
   * 모든 투사체 비활성화
   */
  reset() {
    for (let i = 0; i < this.pool.length; i++) {
      this.pool[i].deactivate();
    }
  }

  /**
   * 모든 투사체 크기 일괄 업데이트
   */
  updateAllSizes() {
    for (let i = 0; i < this.pool.length; i++) {
      this.pool[i].updateSize();
    }
  }
}
