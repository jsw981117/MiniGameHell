// 별 클래스
class Star {
  constructor(boxWidth, boxHeight) {
    this.boxWidth = boxWidth;
    this.boxHeight = boxHeight;
    this.color = CONFIG.STAR.COLOR;
    this.glowColor = CONFIG.STAR.GLOW_COLOR;

    // 크기 초기화
    this.updateSize();

    // 애니메이션
    this.time = 0;

    // 초기 위치
    this.spawn();
  }

  /**
   * 크기 업데이트 (설정 변경 시 호출)
   */
  updateSize() {
    this.size = RUNTIME_CONFIG.star.size;
    this.width = this.size;
    this.height = this.size;
  }

  /**
   * 랜덤 위치에 별 생성
   */
  spawn() {
    const pos = randomPosition(
      this.boxWidth,
      this.boxHeight,
      this.width,
      this.height
    );
    this.x = pos.x;
    this.y = pos.y;
  }

  /**
   * 별 업데이트
   * @param {number} deltaTime - 프레임 시간 (초)
   */
  update(deltaTime) {
    this.time += deltaTime;
  }

  /**
   * 별 그리기
   * @param {CanvasRenderingContext2D} ctx - 캔버스 컨텍스트
   */
  render(ctx) {
    // 반짝임 효과 (sin 함수)
    const glowIntensity = (Math.sin(this.time * 5) + 1) / 2; // 0~1
    const glowSize = 5 + glowIntensity * 5;

    // 외곽 빛
    ctx.shadowBlur = glowSize;
    ctx.shadowColor = this.glowColor;
    ctx.fillStyle = this.color;

    // 별 그리기 (5각별)
    this.drawStar(ctx, this.x + this.size / 2, this.y + this.size / 2, 5, this.size / 2, this.size / 4);

    // 그림자 제거
    ctx.shadowBlur = 0;
  }

  /**
   * 별 모양 그리기
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} cx - 중심 x
   * @param {number} cy - 중심 y
   * @param {number} spikes - 뾰족한 부분 개수
   * @param {number} outerRadius - 외부 반지름
   * @param {number} innerRadius - 내부 반지름
   */
  drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);

    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }

    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  }
}
