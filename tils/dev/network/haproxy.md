# HAProxy

![HAProxy](https://findstar.pe.kr/images/posts/haproxy/haproxy-logo.png)

## 오픈소스 로드밸런서

HAProxy는 기존 하드웨어 스위치를 대신할 수 있는 소프트웨어 로드 밸런서다. 네트워크 스위치에서 제공하는 L4, L7 기능도 제공한다.
무엇보다 설치나 환경설정이 쉬워 서버 이중화에 적합하다.

### 로드 밸런싱

로드 밸런싱이란 부하 분산을 위햇 가상 IP 를 통해 여러 서버에 접속하도록 분배하는 기능이다.
로드 밸런싱에서 사용하는 주요 기술은 다음과 같다.

- NAT(Network Address Translation): 사설 IP 주소를 공인 IP 주소로 바꾸는 데 사용하는 주소 변조기
- DSR(Dynamic Source Routing Protocol): 로드 밸런서 사용 시 서버에서 클라이언트로 되돌아 가는 경우 목적지 주소를
스위치의 IP주소가 아닌 클라이언트의 IP 주소로 전달해서 네트워크 스위치를 거치지 않고 바로 클라이언트를 찾아가게끔 하는 프로토콜이다.
- Tunneling: 인터넷 상에서 눈에 보이지 않는 통로를 만들어 통신할 수 있게 하는 개념으로, 데이터를 캡슐화 해서 연결된 상호 간에만
캡슐화된 패킷을 구별해 캡슐화를 해제할 수 있다.

## 출처

https://d2.naver.com/helloworld/284659