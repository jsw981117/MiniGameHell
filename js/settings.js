// 설정 모달 관리
(function() {
  const modal = document.getElementById('settingsModal');
  const settingsBtn = document.getElementById('settingsBtn');
  const applyBtn = document.getElementById('applySettings');
  const cancelBtn = document.getElementById('cancelSettings');
  const resetBtn = document.getElementById('resetSettings');

  // 입력 필드
  const inputs = {
    // 타워
    towerWidth: document.getElementById('towerWidth'),
    towerHeight: document.getElementById('towerHeight'),
    towerInitialHp: document.getElementById('towerInitialHp'),
    towerMaxHp: document.getElementById('towerMaxHp'),
    towerHpDecayRate: document.getElementById('towerHpDecayRate'),
    towerEnemyDamage: document.getElementById('towerEnemyDamage'),
    towerShootInterval: document.getElementById('towerShootInterval'),
    // 투사체
    projectileWidth: document.getElementById('projectileWidth'),
    projectileHeight: document.getElementById('projectileHeight'),
    projectileSpeed: document.getElementById('projectileSpeed'),
    // 플레이어
    playerWidth: document.getElementById('playerWidth'),
    playerHeight: document.getElementById('playerHeight'),
    playerMaxJumps: document.getElementById('playerMaxJumps'),
    playerSpeed: document.getElementById('playerSpeed'),
    playerJumpForce: document.getElementById('playerJumpForce'),
    playerGravity: document.getElementById('playerGravity'),
    // 별
    starSize: document.getElementById('starSize'),
    starHealAmount: document.getElementById('starHealAmount'),
    // 적
    enemyWidth: document.getElementById('enemyWidth'),
    enemyHeight: document.getElementById('enemyHeight'),
    enemyHp: document.getElementById('enemyHp'),
    enemyMinSpeed: document.getElementById('enemyMinSpeed'),
    enemyMaxSpeed: document.getElementById('enemyMaxSpeed'),
    enemyGroundSpeedMult: document.getElementById('enemyGroundSpeedMult'),
    enemyInitialInterval: document.getElementById('enemyInitialInterval'),
    enemyMinInterval: document.getElementById('enemyMinInterval'),
    enemyDecreaseRate: document.getElementById('enemyDecreaseRate'),
    // 회복
    healEnemyKill: document.getElementById('healEnemyKill')
  };

  /**
   * 설정 값을 입력 필드에 로드
   */
  function loadSettings() {
    // 타워
    inputs.towerWidth.value = RUNTIME_CONFIG.tower.width;
    inputs.towerHeight.value = RUNTIME_CONFIG.tower.height;
    inputs.towerInitialHp.value = RUNTIME_CONFIG.tower.initialHp;
    inputs.towerMaxHp.value = RUNTIME_CONFIG.tower.maxHp;
    inputs.towerHpDecayRate.value = RUNTIME_CONFIG.tower.hpDecayRate;
    inputs.towerEnemyDamage.value = RUNTIME_CONFIG.tower.enemyDamage;
    inputs.towerShootInterval.value = RUNTIME_CONFIG.tower.shootInterval;
    // 투사체
    inputs.projectileWidth.value = RUNTIME_CONFIG.projectile.width;
    inputs.projectileHeight.value = RUNTIME_CONFIG.projectile.height;
    inputs.projectileSpeed.value = RUNTIME_CONFIG.projectile.speed;
    // 플레이어
    inputs.playerWidth.value = RUNTIME_CONFIG.player.width;
    inputs.playerHeight.value = RUNTIME_CONFIG.player.height;
    inputs.playerMaxJumps.value = RUNTIME_CONFIG.player.maxJumps;
    inputs.playerSpeed.value = RUNTIME_CONFIG.player.speed;
    inputs.playerJumpForce.value = RUNTIME_CONFIG.player.jumpForce;
    inputs.playerGravity.value = RUNTIME_CONFIG.player.gravity;
    // 별
    inputs.starSize.value = RUNTIME_CONFIG.star.size;
    inputs.starHealAmount.value = RUNTIME_CONFIG.star.healAmount;
    // 적
    inputs.enemyWidth.value = RUNTIME_CONFIG.enemy.width;
    inputs.enemyHeight.value = RUNTIME_CONFIG.enemy.height;
    inputs.enemyHp.value = RUNTIME_CONFIG.enemy.hp;
    inputs.enemyMinSpeed.value = RUNTIME_CONFIG.enemy.minSpeed;
    inputs.enemyMaxSpeed.value = RUNTIME_CONFIG.enemy.maxSpeed;
    inputs.enemyGroundSpeedMult.value = RUNTIME_CONFIG.enemy.groundSpeedMult;
    inputs.enemyInitialInterval.value = RUNTIME_CONFIG.enemy.spawnInterval.initial;
    inputs.enemyMinInterval.value = RUNTIME_CONFIG.enemy.spawnInterval.minimum;
    inputs.enemyDecreaseRate.value = RUNTIME_CONFIG.enemy.spawnInterval.decreaseRate;
    // 회복
    inputs.healEnemyKill.value = RUNTIME_CONFIG.heal.enemyKill;
  }

  /**
   * 입력 필드 값을 설정에 적용
   */
  function applySettings() {
    // 타워
    RUNTIME_CONFIG.tower.width = parseInt(inputs.towerWidth.value);
    RUNTIME_CONFIG.tower.height = parseInt(inputs.towerHeight.value);
    RUNTIME_CONFIG.tower.initialHp = parseInt(inputs.towerInitialHp.value);
    RUNTIME_CONFIG.tower.maxHp = parseInt(inputs.towerMaxHp.value);
    RUNTIME_CONFIG.tower.hpDecayRate = parseFloat(inputs.towerHpDecayRate.value);
    RUNTIME_CONFIG.tower.enemyDamage = parseInt(inputs.towerEnemyDamage.value);
    RUNTIME_CONFIG.tower.shootInterval = parseFloat(inputs.towerShootInterval.value);
    // 투사체
    RUNTIME_CONFIG.projectile.width = parseInt(inputs.projectileWidth.value);
    RUNTIME_CONFIG.projectile.height = parseInt(inputs.projectileHeight.value);
    RUNTIME_CONFIG.projectile.speed = parseFloat(inputs.projectileSpeed.value);
    // 플레이어
    RUNTIME_CONFIG.player.width = parseInt(inputs.playerWidth.value);
    RUNTIME_CONFIG.player.height = parseInt(inputs.playerHeight.value);
    RUNTIME_CONFIG.player.maxJumps = parseInt(inputs.playerMaxJumps.value);
    RUNTIME_CONFIG.player.speed = parseFloat(inputs.playerSpeed.value);
    RUNTIME_CONFIG.player.jumpForce = parseFloat(inputs.playerJumpForce.value);
    RUNTIME_CONFIG.player.gravity = parseFloat(inputs.playerGravity.value);
    // 별
    RUNTIME_CONFIG.star.size = parseInt(inputs.starSize.value);
    RUNTIME_CONFIG.star.healAmount = parseInt(inputs.starHealAmount.value);
    // 적
    RUNTIME_CONFIG.enemy.width = parseInt(inputs.enemyWidth.value);
    RUNTIME_CONFIG.enemy.height = parseInt(inputs.enemyHeight.value);
    RUNTIME_CONFIG.enemy.hp = parseInt(inputs.enemyHp.value);
    RUNTIME_CONFIG.enemy.minSpeed = parseFloat(inputs.enemyMinSpeed.value);
    RUNTIME_CONFIG.enemy.maxSpeed = parseFloat(inputs.enemyMaxSpeed.value);
    RUNTIME_CONFIG.enemy.groundSpeedMult = parseFloat(inputs.enemyGroundSpeedMult.value);
    RUNTIME_CONFIG.enemy.spawnInterval.initial = parseFloat(inputs.enemyInitialInterval.value);
    RUNTIME_CONFIG.enemy.spawnInterval.minimum = parseFloat(inputs.enemyMinInterval.value);
    RUNTIME_CONFIG.enemy.spawnInterval.decreaseRate = parseFloat(inputs.enemyDecreaseRate.value);
    // 회복
    RUNTIME_CONFIG.heal.enemyKill = parseInt(inputs.healEnemyKill.value);

    // 게임 오브젝트 크기 업데이트
    if (typeof tower !== 'undefined' && tower) tower.updateSize();
    if (typeof projectilePool !== 'undefined' && projectilePool) projectilePool.updateAllSizes();
    if (typeof player !== 'undefined' && player) player.updateSize();
    if (typeof star !== 'undefined' && star) star.updateSize();
    if (typeof enemyPool !== 'undefined' && enemyPool) enemyPool.updateAllSizes();
  }

  /**
   * 기본값으로 복원
   */
  function resetToDefaults() {
    // 타워
    RUNTIME_CONFIG.tower.width = CONFIG.TOWER.WIDTH;
    RUNTIME_CONFIG.tower.height = CONFIG.TOWER.HEIGHT;
    RUNTIME_CONFIG.tower.initialHp = CONFIG.TOWER.INITIAL_HP;
    RUNTIME_CONFIG.tower.maxHp = CONFIG.TOWER.MAX_HP;
    RUNTIME_CONFIG.tower.hpDecayRate = CONFIG.TOWER.HP_DECAY_RATE;
    RUNTIME_CONFIG.tower.enemyDamage = CONFIG.TOWER.ENEMY_DAMAGE;
    RUNTIME_CONFIG.tower.shootInterval = CONFIG.TOWER.SHOOT_INTERVAL;
    // 투사체
    RUNTIME_CONFIG.projectile.width = CONFIG.PROJECTILE.WIDTH;
    RUNTIME_CONFIG.projectile.height = CONFIG.PROJECTILE.HEIGHT;
    RUNTIME_CONFIG.projectile.speed = CONFIG.PROJECTILE.SPEED;
    // 플레이어
    RUNTIME_CONFIG.player.width = CONFIG.PLAYER.WIDTH;
    RUNTIME_CONFIG.player.height = CONFIG.PLAYER.HEIGHT;
    RUNTIME_CONFIG.player.maxJumps = CONFIG.PLAYER.MAX_JUMPS;
    RUNTIME_CONFIG.player.speed = CONFIG.PLAYER.SPEED;
    RUNTIME_CONFIG.player.jumpForce = CONFIG.PLAYER.JUMP_FORCE;
    RUNTIME_CONFIG.player.gravity = CONFIG.PLAYER.GRAVITY;
    // 별
    RUNTIME_CONFIG.star.size = CONFIG.STAR.SIZE;
    RUNTIME_CONFIG.star.healAmount = CONFIG.STAR.HEAL_AMOUNT;
    // 적
    RUNTIME_CONFIG.enemy.width = CONFIG.ENEMY.WIDTH;
    RUNTIME_CONFIG.enemy.height = CONFIG.ENEMY.HEIGHT;
    RUNTIME_CONFIG.enemy.hp = CONFIG.ENEMY.HP;
    RUNTIME_CONFIG.enemy.minSpeed = CONFIG.ENEMY.MIN_SPEED;
    RUNTIME_CONFIG.enemy.maxSpeed = CONFIG.ENEMY.MAX_SPEED;
    RUNTIME_CONFIG.enemy.groundSpeedMult = CONFIG.ENEMY.GROUND_SPEED_MULT;
    RUNTIME_CONFIG.enemy.spawnInterval.initial = CONFIG.ENEMY.SPAWN_INTERVAL.INITIAL;
    RUNTIME_CONFIG.enemy.spawnInterval.minimum = CONFIG.ENEMY.SPAWN_INTERVAL.MINIMUM;
    RUNTIME_CONFIG.enemy.spawnInterval.decreaseRate = CONFIG.ENEMY.SPAWN_INTERVAL.DECREASE_RATE;
    // 회복
    RUNTIME_CONFIG.heal.enemyKill = CONFIG.HEAL.ENEMY_KILL;

    // 게임 오브젝트 크기 업데이트
    if (typeof tower !== 'undefined' && tower) tower.updateSize();
    if (typeof projectilePool !== 'undefined' && projectilePool) projectilePool.updateAllSizes();
    if (typeof player !== 'undefined' && player) player.updateSize();
    if (typeof star !== 'undefined' && star) star.updateSize();
    if (typeof enemyPool !== 'undefined' && enemyPool) enemyPool.updateAllSizes();

    loadSettings();
  }

  /**
   * 모달 열기
   */
  function openModal() {
    loadSettings();
    modal.classList.add('show');

    // 게임 일시정지
    if (gameState && gameState.current === CONFIG.STATE.PLAYING) {
      togglePause();
    }
  }

  /**
   * 모달 닫기
   */
  function closeModal() {
    modal.classList.remove('show');
  }

  // 이벤트 리스너
  settingsBtn.addEventListener('click', openModal);

  applyBtn.addEventListener('click', () => {
    applySettings();
    closeModal();
  });

  cancelBtn.addEventListener('click', () => {
    closeModal();
  });

  resetBtn.addEventListener('click', () => {
    if (confirm('모든 설정을 기본값으로 복원하시겠습니까?')) {
      resetToDefaults();
    }
  });

  // 모달 배경 클릭 시 닫기
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // ESC 키로 모달 닫기
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
      closeModal();
    }
  });

  // 초기 설정 로드
  loadSettings();
})();
