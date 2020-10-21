# gRPC

## Overview

RPC는 Remote Procedure Call의 약자로, 원격 머신에 있는 함수(Procedure)를 마치 로컬에 있는 객체의 메소드를 쓰듯 호출하는 기능이다.
원격에 있는 함수를 호출하기 위해서는 그 함수가 받아야 하는 request parameter 와 그 함수가 반환하는 response parameter 가
함수를 호출하는 쪽과 호출당하는 곳이 서로 통일되게 구현되어져야 한다. 이를 위해 IDL(Interface Description Language)로 해당 함수의
인터페이스 규약을 정의하고, 보통은 IDL을 기반으로 Caller와 Callee의 구현부(코드)를 생성한다. 이를 각각 Skeleton과 Stub스(Client라고 부르기도 한다) 이라 한다.

## REST vs RCP

RPC는 REST와 많이 비교된다. 주목해야 할 부분은 다음과 같다:

- 속도가 빠르다(HTTP를 사용하는 REST에 비해 성능이 좋다).
- 원격에 있는 함수임에도 불구하고 타입 체킹이 된다.
- 단방향인 REST와는 달리, 양방향 통신이 가능하다.
- Streaming 이 지원된다.

## gRPC

[gRPC](https://grpc.io/) 는 이러한 RPC를 google protobuf를 IDL로 사용하여 구현한 것이다. 

![gRPC overview](https://grpc.io/img/landing-2.svg)

서버 사이드는 .proto 파일에 명시된 서비스의 인터페이스를 구현(Skeleton)하고, gRPC 서버를 열어 대기한다.
이 때, gRPC의 내부적인 인프라 레이어에서는 들어오는 요청은 디코딩하고 나가는 응답은 인코딩한다.

클라이언트 사이드는 마찬가지로 서비스의 인터페이스를 구현(Stub)하고, 해당 객체의 메소드를 호출하여 gRPC 서비스를 사용한다.
이 때 요청하는 메시지는 protobuf Message 타입이어야 한다. 응답 역시 마찬가지로 protobuf Message 타입이다.


## gRPCurl

우리는 curl이라는 HTTP에 유용한 CLI를 알고 있다. [gRPCurl](https://github.com/fullstorydev/grpcurl) 은 gRPC용 curl이라고 보면 된다.

