// 플레이어 클래스
class Player {
  constructor(x, y, boxWidth, boxHeight) {
    this.boxWidth = boxWidth;
    this.boxHeight = boxHeight;

    // 크기 초기화
    this.updateSize();

    // 위치 설정
    this.x = x;
    this.y = y;

    // 이동 관련
    this.velocityX = RUNTIME_CONFIG.player.speed;
    this.velocityY = 0;
    this.direction = 1; // 1: 오른쪽, -1: 왼쪽

    // 점프 관련
    this.jumpCount = 0;
    this.isGrounded = false;

    // 렌더링
    this.color = CONFIG.PLAYER.COLOR;
  }

  /**
   * 크기 업데이트 (설정 변경 시 호출)
   */
  updateSize() {
    this.width = RUNTIME_CONFIG.player.width;
    this.height = RUNTIME_CONFIG.player.height;
  }

  /**
   * 플레이어 업데이트
   * @param {number} deltaTime - 프레임 시간 (초)
   */
  update(deltaTime) {
    // 좌우 자동 이동
    this.x += this.velocityX * this.direction * deltaTime;

    // 벽 충돌 시 방향 전환
    if (this.x <= 0) {
      this.x = 0;
      this.direction = 1;
    } else if (this.x + this.width >= this.boxWidth) {
      this.x = this.boxWidth - this.width;
      this.direction = -1;
    }

    // 중력 적용
    this.velocityY += RUNTIME_CONFIG.player.gravity * deltaTime;

    // 수직 이동
    this.y += this.velocityY * deltaTime;

    // 바닥 충돌
    if (this.y + this.height >= this.boxHeight) {
      this.y = this.boxHeight - this.height;
      this.velocityY = 0;
      this.jumpCount = 0;
      this.isGrounded = true;
    } else {
      this.isGrounded = false;
    }

    // 천장 충돌
    if (this.y <= 0) {
      this.y = 0;
      this.velocityY = 0;
    }
  }

  /**
   * 점프 실행
   */
  jump() {
    const maxJumps = RUNTIME_CONFIG.player.maxJumps;

    // -1이면 무제한 공중 점프
    if (maxJumps === -1) {
      this.velocityY = -RUNTIME_CONFIG.player.jumpForce;
      this.jumpCount++;
      return;
    }

    // 일반 점프 제한
    if (this.jumpCount < maxJumps) {
      this.velocityY = -RUNTIME_CONFIG.player.jumpForce;
      this.jumpCount++;
    }
  }

  /**
   * 플레이어 그리기
   * @param {CanvasRenderingContext2D} ctx - 캔버스 컨텍스트
   */
  render(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // 방향 표시 (작은 삼각형)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    if (this.direction === 1) {
      ctx.moveTo(this.x + this.width, this.y + this.height / 2);
      ctx.lineTo(this.x + this.width - 10, this.y + this.height / 2 - 5);
      ctx.lineTo(this.x + this.width - 10, this.y + this.height / 2 + 5);
    } else {
      ctx.moveTo(this.x, this.y + this.height / 2);
      ctx.lineTo(this.x + 10, this.y + this.height / 2 - 5);
      ctx.lineTo(this.x + 10, this.y + this.height / 2 + 5);
    }
    ctx.closePath();
    ctx.fill();
  }

  /**
   * 플레이어 리셋
   */
  reset() {
    this.x = (this.boxWidth - this.width) / 2;
    this.y = this.boxHeight - this.height - 10;
    this.velocityY = 0;
    this.direction = 1;
    this.jumpCount = 0;
    this.isGrounded = true;
  }
}
