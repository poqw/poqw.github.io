# Streaming

![](https://restream.io/blog/content/images/2020/10/video-streaming-protocols-comparison-tw-fb.png)

## Steaming Overview

스트리밍은 네트워크 사용자들에게 멀티미디어(비디오, 오디오 등) 디지털 정보를 다운로드 없이 실시간으로 제공하는 기술이다.
이걸 가능케 하려면 단순하게 생각하더라도 서버, 클라이언트 사이에는 어떠한 약속이 있어야 함을 이해해야 한다. 서버가 얼만큼의 영상 조각을
어떤 포맷으로 준비할지, 클라이언트는 서버에서 얼마만큼의 영상 조각을 읽어야 하고 어떤 포맷으로 읽어들여야 하는지 서로가 알아야 하기 때문이다.

그렇게 해서 설계된 네트워크 프로토콜들이 있는데, 전통적으로 쓰이던 프로토콜 목록은 다음과 같다.

- RTSP(Real-Time Streaming Protocol)
- RTP(Real-Time Transport Protocol)
- RTMP(Real-Time Transport Messaging Protocol)

이 프로토콜들은 현제에도 많이 사용되고 있기는 하나, 전송 규격이 빡세서 도입 비용이 크다는 단점이 있다. 특히 RTST/RTP 는
RTSP와 RTP가 서로 다른 네트워크 연결을 통해 데이터를 교환하기 때문에 방화벽이나 NAT를 많이 쓰는 환경에서는 서비스가 원활하지
않는다는 치명적인 문제가 있다.

이에 대한 대안으로, HTTP를 이용한 스트리밍 프로토콜이 탄생하게 된다. HTTP 프로토콜은 굉장히 자주 사용하는 프로토콜이라
또 다른 프로토콜의 규격 명세에 맞춰 서버를 개조할 필요가 없이 쉽게 도입이 가능하기 때문이다. 대표적으로 HLS(Http Live Streaming) 방식이 있다.

### HLS

표준 HTTP 기반 스트리밍 프로토콜로, 스트리밍 데이터를 m3u8 확장자를 가진 재생목록 파일과 잘게 쪼개놓은 다수의 ts 파일(동영상)들을
HTTP를 통해 전송하는 방식이다.

용어를 잠깐 살펴보자면 다음과 같다.

- m3u8: m3u 파일인데, UTF-8로 인코딩 되었다는 의미다.
- m3u: 멀티미디어 파일의 재생목록을 관리하는 파일이다.
- ts: MPEG-2의 Transport Stream 포맷이다.

아래 그림에서 동작방식에 대해 잘 설명해 주고 있다.

![](https://blog.kollus.com/wp-content/uploads/2014/05/Apple-Inc-HTTP-Live-Streaming-Overview-.jpg)

Audio/Video 인풋이 들어오면, 서버는 이를 즉시 스트리밍을 위한 ts 파일로 인코딩(인코딩 과정에서 주로 [ffmpeg](http://ffmpeg.org/)를 쓴다)하고 stream segmenter 에게 넘긴다.
stream segmenter는 일정한 시간 간격마다 입력받은 파일을 분할하여 파일로 만들고, 그 파일에 접근할 수 있는 m3u8 파일을 만드는 역할을 한다.
이렇게 스트리밍이 시작되고 나면, 클라이언트가 서버에 접속하여 스트리밍 서비스를 받아 볼 수 있다.

HLS가 확작성이 높고 도입 비용이 낮다는 장점이 있긴 하지만, 전송 구조상 위와 같이 파일들을 먼저 분할하여 준비해놓고 스트리밍을 시작하는 방식이기
때문에 전통적인 RT* 프로토콜들에 비해 딜레이 문제가 발생할 수 있다.
