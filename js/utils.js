// 유틸리티 함수 모음

/**
 * AABB 충돌 감지 (Axis-Aligned Bounding Box)
 * @param {Object} a - 첫 번째 객체 {x, y, width, height}
 * @param {Object} b - 두 번째 객체 {x, y, width, height}
 * @returns {boolean} 충돌 여부
 */
function checkCollision(a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}

/**
 * 랜덤 정수 생성
 * @param {number} min - 최솟값
 * @param {number} max - 최댓값
 * @returns {number} 랜덤 정수
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 랜덤 실수 생성
 * @param {number} min - 최솟값
 * @param {number} max - 최댓값
 * @returns {number} 랜덤 실수
 */
function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * 박스 내 랜덤 위치 생성
 * @param {number} boxWidth - 박스 너비
 * @param {number} boxHeight - 박스 높이
 * @param {number} objectWidth - 객체 너비
 * @param {number} objectHeight - 객체 높이
 * @returns {Object} {x, y}
 */
function randomPosition(boxWidth, boxHeight, objectWidth, objectHeight) {
  return {
    x: randomInt(0, boxWidth - objectWidth),
    y: randomInt(0, boxHeight - objectHeight)
  };
}

/**
 * 값 제한 (clamp)
 * @param {number} value - 값
 * @param {number} min - 최솟값
 * @param {number} max - 최댓값
 * @returns {number} 제한된 값
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Debounce 함수
 * @param {Function} func - 실행할 함수
 * @param {number} wait - 대기 시간 (ms)
 * @returns {Function} debounced 함수
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
