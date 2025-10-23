// 게임 설정 상수
const CONFIG = {
  // 게임 박스 크기 (기준)
  BOX: {
    WIDTH: 800,
    HEIGHT: 1400
  },

  // 플레이어 설정
  PLAYER: {
    WIDTH: 40,
    HEIGHT: 40,
    SPEED: 300,           // px/s
    JUMP_FORCE: 500,      // px
    GRAVITY: 1500,        // px/s²
    MAX_JUMPS: 2,         // 최대 점프 횟수
    COLOR: '#00ff00'
  },

  // 별 설정
  STAR: {
    SIZE: 30,
    COLOR: '#ffff00',
    GLOW_COLOR: '#ffff00'
  },

  // 메테오 설정
  METEOR: {
    WIDTH: 40,
    HEIGHT: 40,
    MIN_SPEED: 200,       // px/s
    MAX_SPEED: 600,       // px/s
    SPAWN_INTERVAL: {
      INITIAL: 2.0,       // 초
      MINIMUM: 0.5,       // 초
      DECREASE_RATE: 0.98 // 매초 감소율
    },
    POOL_SIZE: 20,        // 객체 풀 크기
    COLOR: '#ff4444'
  },

  // 게임 상태
  STATE: {
    READY: 'ready',
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAMEOVER: 'gameover'
  }
};

// 런타임 설정 (게임 중 수정 가능)
const RUNTIME_CONFIG = {
  player: {
    speed: CONFIG.PLAYER.SPEED,
    jumpForce: CONFIG.PLAYER.JUMP_FORCE,
    gravity: CONFIG.PLAYER.GRAVITY
  },
  meteor: {
    minSpeed: CONFIG.METEOR.MIN_SPEED,
    maxSpeed: CONFIG.METEOR.MAX_SPEED,
    spawnInterval: {
      initial: CONFIG.METEOR.SPAWN_INTERVAL.INITIAL,
      minimum: CONFIG.METEOR.SPAWN_INTERVAL.MINIMUM,
      decreaseRate: CONFIG.METEOR.SPAWN_INTERVAL.DECREASE_RATE
    }
  }
};
