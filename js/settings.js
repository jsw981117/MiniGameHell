// 설정 모달 관리
(function() {
  const modal = document.getElementById('settingsModal');
  const settingsBtn = document.getElementById('settingsBtn');
  const applyBtn = document.getElementById('applySettings');
  const cancelBtn = document.getElementById('cancelSettings');
  const resetBtn = document.getElementById('resetSettings');

  // 입력 필드
  const inputs = {
    playerSpeed: document.getElementById('playerSpeed'),
    playerJumpForce: document.getElementById('playerJumpForce'),
    playerGravity: document.getElementById('playerGravity'),
    meteorMinSpeed: document.getElementById('meteorMinSpeed'),
    meteorMaxSpeed: document.getElementById('meteorMaxSpeed'),
    meteorInitialInterval: document.getElementById('meteorInitialInterval'),
    meteorMinInterval: document.getElementById('meteorMinInterval'),
    meteorDecreaseRate: document.getElementById('meteorDecreaseRate')
  };

  /**
   * 설정 값을 입력 필드에 로드
   */
  function loadSettings() {
    inputs.playerSpeed.value = RUNTIME_CONFIG.player.speed;
    inputs.playerJumpForce.value = RUNTIME_CONFIG.player.jumpForce;
    inputs.playerGravity.value = RUNTIME_CONFIG.player.gravity;
    inputs.meteorMinSpeed.value = RUNTIME_CONFIG.meteor.minSpeed;
    inputs.meteorMaxSpeed.value = RUNTIME_CONFIG.meteor.maxSpeed;
    inputs.meteorInitialInterval.value = RUNTIME_CONFIG.meteor.spawnInterval.initial;
    inputs.meteorMinInterval.value = RUNTIME_CONFIG.meteor.spawnInterval.minimum;
    inputs.meteorDecreaseRate.value = RUNTIME_CONFIG.meteor.spawnInterval.decreaseRate;
  }

  /**
   * 입력 필드 값을 설정에 적용
   */
  function applySettings() {
    RUNTIME_CONFIG.player.speed = parseFloat(inputs.playerSpeed.value);
    RUNTIME_CONFIG.player.jumpForce = parseFloat(inputs.playerJumpForce.value);
    RUNTIME_CONFIG.player.gravity = parseFloat(inputs.playerGravity.value);
    RUNTIME_CONFIG.meteor.minSpeed = parseFloat(inputs.meteorMinSpeed.value);
    RUNTIME_CONFIG.meteor.maxSpeed = parseFloat(inputs.meteorMaxSpeed.value);
    RUNTIME_CONFIG.meteor.spawnInterval.initial = parseFloat(inputs.meteorInitialInterval.value);
    RUNTIME_CONFIG.meteor.spawnInterval.minimum = parseFloat(inputs.meteorMinInterval.value);
    RUNTIME_CONFIG.meteor.spawnInterval.decreaseRate = parseFloat(inputs.meteorDecreaseRate.value);
  }

  /**
   * 기본값으로 복원
   */
  function resetToDefaults() {
    RUNTIME_CONFIG.player.speed = CONFIG.PLAYER.SPEED;
    RUNTIME_CONFIG.player.jumpForce = CONFIG.PLAYER.JUMP_FORCE;
    RUNTIME_CONFIG.player.gravity = CONFIG.PLAYER.GRAVITY;
    RUNTIME_CONFIG.meteor.minSpeed = CONFIG.METEOR.MIN_SPEED;
    RUNTIME_CONFIG.meteor.maxSpeed = CONFIG.METEOR.MAX_SPEED;
    RUNTIME_CONFIG.meteor.spawnInterval.initial = CONFIG.METEOR.SPAWN_INTERVAL.INITIAL;
    RUNTIME_CONFIG.meteor.spawnInterval.minimum = CONFIG.METEOR.SPAWN_INTERVAL.MINIMUM;
    RUNTIME_CONFIG.meteor.spawnInterval.decreaseRate = CONFIG.METEOR.SPAWN_INTERVAL.DECREASE_RATE;

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
