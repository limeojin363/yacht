# 작업 목록

## 순서별 정리

- admin 기능들(API: getUserList, getGameList)
    - API 서버 코드 작성
    - ky 패키지 설치
    - 클라이언트 API 호출 코드 작성
    - 클라이언트 페이지 파일 생성
    - user, game 탭과 각각
        - tanstack/query hook
        - UI
- users 기능들(API: signup, login)
    - API 서버 코드 작성
    - 클라이언트 API 호출 코드 작성
    - 회원가입 페이지
        - hook, UI
    - 로그인 페이지
        - hook, UI
- games 진입부
- games 진행부

## 작업 유형별 정리

### admin 기능들

- 게임 목록 보기(API, 프론트)
- 유저 목록 보기(API, 프론트)

### user 기능들

- 회원가입 UI
- 로그인 UI
- 로그아웃 UI
- 게임 진입 페이지(목록 보기와 입장)

# 프로젝트 구조(250908 Update)

## apps/client

- 클라이언트 앱

## apps/server

- 서버 앱

## packages/game

게임 상태정보 생성과 업데이트를 위한 정보 취합, 적용
 - 기능 코드
 - 스키마
 - 타입

## packages/communication

HTTP, WebSocket 통신 인터페이스
 - 스키마
 - 타입

