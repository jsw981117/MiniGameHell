// 메테오 클래스
class Meteor {
  constructor() {
    this.width = CONFIG.METEOR.WIDTH;
    this.height = CONFIG.METEOR.HEIGHT;
    this.color = CONFIG.METEOR.COLOR;
    this.active = false;
    this.x = 0;
    this.y = 0;
    this.speed = 0;
  }

  /**
   * 메테오 활성화 및 초기화
   * @param {number} boxWidth - 박스 너비
   */
  spawn(boxWidth) {
    this.active = true;
    this.x = randomInt(0, boxWidth - this.width);
    this.y = -this.height;
    this.speed = randomFloat(
      RUNTIME_CONFIG.meteor.minSpeed,
      RUNTIME_CONFIG.meteor.maxSpeed
    );
  }

  /**
   * 메테오 업데이트
   * @param {number} deltaTime - 프레임 시간 (초)
   * @param {number} boxHeight - 박스 높이
   */
  update(deltaTime, boxHeight) {
    if (!this.active) return;

    this.y += this.speed * deltaTime;

    // 화면 밖으로 나가면 비활성화
    if (this.y > boxHeight) {
      this.active = false;
    }
  }

  /**
   * 메테오 그리기
   * @param {CanvasRenderingContext2D} ctx - 캔버스 컨텍스트
   */
  render(ctx) {
    if (!this.active) return;

    // 메테오 본체
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // 불타는 효과 (꼬리)
    ctx.fillStyle = '#ff8800';
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.moveTo(this.x + this.width / 2, this.y);
    ctx.lineTo(this.x, this.y - 10);
    ctx.lineTo(this.x + this.width, this.y - 10);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1.0;

    // 테두리
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }

  /**
   * 메테오 비활성화
   */
  deactivate() {
    this.active = false;
  }
}

// 메테오 풀 관리 클래스
class MeteorPool {
  constructor(size, boxWidth, boxHeight) {
    this.pool = [];
    this.boxWidth = boxWidth;
    this.boxHeight = boxHeight;

    // 객체 풀 미리 생성
    for (let i = 0; i < size; i++) {
      this.pool.push(new Meteor());
    }
  }

  /**
   * 사용 가능한 메테오 가져오기
   * @returns {Meteor|null}
   */
  spawn() {
    // 비활성 메테오 찾기
    for (let i = 0; i < this.pool.length; i++) {
      if (!this.pool[i].active) {
        this.pool[i].spawn(this.boxWidth);
        return this.pool[i];
      }
    }
    return null; // 풀이 가득 찬 경우
  }

  /**
   * 모든 메테오 업데이트
   * @param {number} deltaTime - 프레임 시간 (초)
   */
  update(deltaTime) {
    for (let i = 0; i < this.pool.length; i++) {
      this.pool[i].update(deltaTime, this.boxHeight);
    }
  }

  /**
   * 모든 활성 메테오 그리기
   * @param {CanvasRenderingContext2D} ctx - 캔버스 컨텍스트
   */
  render(ctx) {
    for (let i = 0; i < this.pool.length; i++) {
      this.pool[i].render(ctx);
    }
  }

  /**
   * 활성 메테오 목록 반환
   * @returns {Array<Meteor>}
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
   * 모든 메테오 비활성화
   */
  reset() {
    for (let i = 0; i < this.pool.length; i++) {
      this.pool[i].deactivate();
    }
  }
}
