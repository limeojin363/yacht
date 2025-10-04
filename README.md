# 작업 목록

## 게임 UI 개선사항

- myTurn false일 때 어떻게 노출되고 동작할지?

## room 관리 개선사항

- 게임 진행 중 나가기(방 소멸)
- 사용자가 방을 생성할 수 있도록 하기
- 사용자가 방을 삭제할 수 있도록 하기
- 끝난 게임 자동 삭제

## 게임 feature 개선사항

- 게임이 끝났음을 알리도록 하기

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

