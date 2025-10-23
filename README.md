# Mini Game Hell

HTML5 Canvas를 사용한 미니 게임 프로젝트

## 프로젝트 구조

```
MiniGameHell/
├── index.html          # 메인 HTML 파일
├── css/
│   └── style.css       # 스타일시트
├── js/
│   └── game.js         # 게임 로직
├── assets/
│   ├── images/         # 이미지 파일
│   ├── audio/          # 오디오 파일
│   └── fonts/          # 폰트 파일
└── README.md           # 프로젝트 설명
```

## 실행 방법

1. 웹 브라우저에서 `index.html` 파일을 열기
2. 또는 로컬 서버를 사용하여 실행:
   ```bash
   # Python 3
   python -m http.server 8000

   # Node.js (http-server 설치 필요)
   npx http-server
   ```
3. 브라우저에서 `http://localhost:8000` 접속

## 기능

- HTML5 Canvas를 이용한 게임 렌더링
- 게임 시작/일시정지/재시작 기능
- 점수 시스템
- 키보드 입력 처리

## 개발 시작하기

`js/game.js` 파일의 `update()` 및 `render()` 함수에 게임 로직을 추가하세요.

## 라이선스

MIT
