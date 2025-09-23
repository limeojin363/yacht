# 작업 목록

- admin 모니터링 기능(API: getUserList, getGameList)
  - communications
    - 각 API 스키마/타입 작성
  - back
    - 각 API 작성
    front
    - API 호출 코드 작성
    - 어드민 페이지 파일 생성
    - tanstack/table 설치 및 설정
    - user, game 탭과 각각
        - tanstack/query hook
        - UI

- users 기본(API: signup, login)
    - API 서버 코드 작성
    - 클라이언트 API 호출 코드 작성
    - 회원가입 페이지
        - hook, UI
    - 로그인 페이지
        - hook, UI

- Notification
    - 

- games 진입부

- games 진행부


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

