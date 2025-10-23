// 타워 클래스
class Tower {
  constructor(boxWidth, boxHeight) {
    this.boxWidth = boxWidth;
    this.boxHeight = boxHeight;
    this.color = CONFIG.TOWER.COLOR;

    // 크기 초기화
    this.updateSize();

    // 위치 설정 (하단 중앙)
    this.x = (boxWidth - this.width) / 2;
    this.y = boxHeight - this.height;

    // 체력 시스템
    this.hp = RUNTIME_CONFIG.tower.initialHp;
    this.maxHp = RUNTIME_CONFIG.tower.maxHp;

    // 사격 시스템
    this.shootTimer = 0;
    this.shootInterval = RUNTIME_CONFIG.tower.shootInterval;

    // 피격 애니메이션
    this.hitTimer = 0;
    this.hitDuration = 0.2; // 초
  }

  /**
   * 크기 업데이트 (설정 변경 시 호출)
   */
  updateSize() {
    this.width = RUNTIME_CONFIG.tower.width;
    this.height = RUNTIME_CONFIG.tower.height;
    // 위치 재계산
    this.x = (this.boxWidth - this.width) / 2;
    this.y = this.boxHeight - this.height;
  }

  /**
   * 타워 업데이트
   * @param {number} deltaTime - 프레임 시간 (초)
   * @param {boolean} hasEnemies - 적이 존재하는지 여부
   * @returns {boolean} - 투사체 발사 여부
   */
  update(deltaTime, hasEnemies) {
    // 체력 자동 감소
    this.hp -= RUNTIME_CONFIG.tower.hpDecayRate * deltaTime;
    if (this.hp < 0) this.hp = 0;

    // 피격 애니메이션 타이머
    if (this.hitTimer > 0) {
      this.hitTimer -= deltaTime;
    }

    // 사격 시스템 (적이 있을 때만)
    if (hasEnemies) {
      this.shootTimer += deltaTime;
      if (this.shootTimer >= RUNTIME_CONFIG.tower.shootInterval) {
        this.shootTimer = 0;
        return true; // 투사체 발사 신호
      }
    } else {
      this.shootTimer = 0; // 적이 없으면 타이머 리셋
    }

    return false;
  }

  /**
   * 데미지 받기
   */
  takeDamage() {
    this.hp -= RUNTIME_CONFIG.tower.enemyDamage;
    if (this.hp < 0) this.hp = 0;
    this.hitTimer = this.hitDuration; // 피격 애니메이션 시작
  }

  /**
   * 체력 회복
   * @param {number} amount - 회복량
   */
  heal(amount) {
    this.hp += amount;
    if (this.hp > this.maxHp) {
      this.hp = this.maxHp;
    }
  }

  /**
   * 타워가 살아있는지 확인
   * @returns {boolean}
   */
  isAlive() {
    return this.hp > 0;
  }

  /**
   * 타워 그리기
   * @param {CanvasRenderingContext2D} ctx - 캔버스 컨텍스트
   */
  render(ctx) {
    // 피격 시 흔들림 효과
    let offsetX = 0;
    let offsetY = 0;
    if (this.hitTimer > 0) {
      offsetX = (Math.random() - 0.5) * 4;
      offsetY = (Math.random() - 0.5) * 4;
    }

    // 타워 본체
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x + offsetX, this.y + offsetY, this.width, this.height);

    // 테두리
    ctx.strokeStyle = '#0066cc';
    ctx.lineWidth = 3;
    ctx.strokeRect(this.x + offsetX, this.y + offsetY, this.width, this.height);

    // 포신 (위쪽 중앙)
    ctx.fillStyle = '#ffaa00';
    ctx.fillRect(
      this.x + this.width / 2 - 8 + offsetX,
      this.y - 20 + offsetY,
      16,
      20
    );
  }

  /**
   * 체력바 그리기
   * @param {CanvasRenderingContext2D} ctx - 캔버스 컨텍스트
   */
  renderHealthBar(ctx) {
    const barWidth = 100;
    const barHeight = 10;
    const barX = this.x + this.width / 2 - barWidth / 2;
    const barY = this.y - 35;

    // 배경 (검은색)
    ctx.fillStyle = '#000000';
    ctx.fillRect(barX, barY, barWidth, barHeight);

    // 체력 비율
    const hpRatio = this.hp / this.maxHp;

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
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barWidth, barHeight);

    // 체력 텍스트
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(
      `${Math.ceil(this.hp)}/${this.maxHp}`,
      this.x + this.width / 2,
      barY - 3
    );
  }

  /**
   * 타워 리셋
   */
  reset() {
    this.hp = RUNTIME_CONFIG.tower.initialHp;
    this.shootTimer = 0;
    this.hitTimer = 0;
    this.updateSize(); // 위치 재계산
  }
}
