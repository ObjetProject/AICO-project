## 백엔드 디렉토리 구조
```
AICO-project
 ┣ backend
 ┃ ┣ router
 ┃ ┃ ┣ index.js
 ┃ ┃ ┗ path.js
 ┃ ┗ README.md
 ┣ frontend
 ┣ app.js
 ┣ package-lock.json
 ┣ package.json
 ┗ README.md
```
- app.js : 전체 흐름 관리
- backend/router : 경로 관리 
- backend/router/path.js : 프론트 경로 연결
- backend/router/index.js : url 경로 연결

프로세스 : app.js에서 서버 시작 → index.js에서 url에 따라 path.js의 명령 수행

## test 방법
```
* 터미널에 (npm start)입력 => 서버 실행됨
* 크롬에 http://localhost:3000 또는 http://localhost:3000/signup 등 url입력
```

## 🚨주의
- css랑 이미지 등 연결을 위해 app.js에 있는 파일 경로는 수정하지 말아주세요.

