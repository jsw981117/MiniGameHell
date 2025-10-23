// 게임 설정 상수
const CONFIG = {
  // 게임 박스 크기 (기준)
  BOX: {
    WIDTH: 800,
    HEIGHT: 1400
  },

  // 타워 설정
  TOWER: {
    WIDTH: 80,
    HEIGHT: 80,
    INITIAL_HP: 100,
    MAX_HP: 100,
    HP_DECAY_RATE: 0.5,      // HP/s
    ENEMY_DAMAGE: 15,         // 적 1마리당 데미지
    SHOOT_INTERVAL: 0.8,      // 초
    COLOR: '#0088ff'
  },

  // 투사체 설정
  PROJECTILE: {
    WIDTH: 10,
    HEIGHT: 10,
    SPEED: 500,               // px/s
    POOL_SIZE: 30,            // 객체 풀 크기
    COLOR: '#ffaa00'
  },

  // 플레이어 설정
  PLAYER: {
    WIDTH: 80,
    HEIGHT: 80,
    SPEED: 500,               // px/s
    JUMP_FORCE: 800,          // px
    GRAVITY: 1500,            // px/s²
    MAX_JUMPS: -1,            // 최대 점프 횟수 (-1: 무제한)
    COLOR: '#00ff00'
  },

  // 별 설정
  STAR: {
    SIZE: 90,
    HEAL_AMOUNT: 10,          // 획득 시 타워 체력 회복
    COLOR: '#ffff00',
    GLOW_COLOR: '#ffff00'
  },

  // 적 설정 (구 메테오)
  ENEMY: {
    WIDTH: 40,
    HEIGHT: 40,
    HP: 1,                    // 체력
    MIN_SPEED: 200,           // px/s (낙하 속도)
    MAX_SPEED: 600,           // px/s (낙하 속도)
    GROUND_SPEED_MULT: 0.75,  // 지상 이동 속도 배율
    SPAWN_INTERVAL: {
      INITIAL: 2.0,           // 초
      MINIMUM: 0.5,           // 초
      DECREASE_RATE: 0.98     // 매 생성마다 감소율
    },
    POOL_SIZE: 20,            // 객체 풀 크기
    COLOR: '#ff4444'
  },

  // 체력 회복
  HEAL: {
    ENEMY_KILL: 5             // 적 처치 시 타워 체력 회복
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
  tower: {
    width: CONFIG.TOWER.WIDTH,
    height: CONFIG.TOWER.HEIGHT,
    initialHp: CONFIG.TOWER.INITIAL_HP,
    maxHp: CONFIG.TOWER.MAX_HP,
    hpDecayRate: CONFIG.TOWER.HP_DECAY_RATE,
    enemyDamage: CONFIG.TOWER.ENEMY_DAMAGE,
    shootInterval: CONFIG.TOWER.SHOOT_INTERVAL
  },
  projectile: {
    width: CONFIG.PROJECTILE.WIDTH,
    height: CONFIG.PROJECTILE.HEIGHT,
    speed: CONFIG.PROJECTILE.SPEED
  },
  player: {
    width: CONFIG.PLAYER.WIDTH,
    height: CONFIG.PLAYER.HEIGHT,
    speed: CONFIG.PLAYER.SPEED,
    jumpForce: CONFIG.PLAYER.JUMP_FORCE,
    gravity: CONFIG.PLAYER.GRAVITY,
    maxJumps: CONFIG.PLAYER.MAX_JUMPS  // -1 = 무제한 공중 점프
  },
  star: {
    size: CONFIG.STAR.SIZE,
    healAmount: CONFIG.STAR.HEAL_AMOUNT
  },
  enemy: {
    width: CONFIG.ENEMY.WIDTH,
    height: CONFIG.ENEMY.HEIGHT,
    hp: CONFIG.ENEMY.HP,
    minSpeed: CONFIG.ENEMY.MIN_SPEED,
    maxSpeed: CONFIG.ENEMY.MAX_SPEED,
    groundSpeedMult: CONFIG.ENEMY.GROUND_SPEED_MULT,
    spawnInterval: {
      initial: CONFIG.ENEMY.SPAWN_INTERVAL.INITIAL,
      minimum: CONFIG.ENEMY.SPAWN_INTERVAL.MINIMUM,
      decreaseRate: CONFIG.ENEMY.SPAWN_INTERVAL.DECREASE_RATE
    }
  },
  heal: {
    enemyKill: CONFIG.HEAL.ENEMY_KILL
  }
};
