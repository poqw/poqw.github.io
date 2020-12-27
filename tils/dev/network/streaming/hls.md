# HLS

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

#### Playlist

위에서 클라이언트가 서버에 단순히 요청하는 것처럼 설명되어 있는데, 이 부분을 좀 더 자세히 살펴보면 다음과 같다.

스트리밍 영상을 재생하기 시작하면 클라이언트에서 playlist 파일(.m3u8)을 요청하는데, 모양새가 다음과 같다.

```
#EXTM3U
#EXT-X-TARGETDURATION:10
#EXT-X-VERSION:4
#EXT-X-MEDIA-SEQUENCE:0
#EXTINF:10.0,
fileSequenceA.ts
#EXTINF:10.0,
fileSequenceB.ts
```

이 파일의 각 라인에 대한 의미는 다음과 같다.

* `#EXTM3U` 로 이 파일의 확장자가 m3u 라는 것을 알린다(m3u8에 뒤에 8이 붙는 이유는 utf8 형식이기 때문이다).
* `#EXT-X-TARGETDURATION` 로 세그먼트들이 몇 초로 쪼개졌는지 명시한다. 각 세그먼트는 재생시간을 정수로 반올림 했을 때 여기 명시된 숫자와 같아야 한다.
* `#EXT-X-VERSION` 으로 HLS 명세에 대한 버전을 명시한다(버전마다 문법이 조금씩 차이가 있다).
* `#EXT-X-MEDIA-SEQUENCE` 로 첫번째 재생 목록(`#EXTINF`)이 몇번째 시퀀스인지를 나타낸다.
* `#EXTINF` 재생목록에 대한 마커 태그로 아래 세그먼트의 재생 기간이 어느 정도인지 표시한다.

이 파일을 읽어들인 클라이언트는 받아놓은 파일이 재생 시간이 다 되어가기 전에 미리 다음 목록을 받아와 미디어 파일의 재생이 끊어지지 않도록 한다. 

#### VOD streaming 과 Live streaming

HLS 에는 VOD(Video on Demand), Live(Sliding window)두 가지 방식으로 스트리밍이 가능하다.

##### VOD streaming

VOD 방식부터 살펴보면, 완전한 미디어 파일을 segmenter가 잘게 쪼개놓고, 스트리밍 요청을 받으면 세그먼트 playlist 를 통으로 보내 스트리밍을 하는 방식이다.
클라이언트에서는 playlist 를 보고 재생에 필요한 파일 조각들만 시간을 두고 차례 차례 요청하여 미디어 파일을 재생한다. 이로써 거대한 파일을 한 꺼번에 요청함으로써
발생하는 네트워크 과부하를 피할 수 있다.

playlist 파일 예시는 다음과 같다.

```
#EXTM3U
#EXT-X-PLAYLIST-TYPE:VOD
#EXT-X-TARGETDURATION:10
#EXT-X-VERSION:4
#EXT-X-MEDIA-SEQUENCE:0
#EXTINF:10.0,
fileSequenceA.ts
#EXTINF:10.0,
fileSequenceB.ts
#EXTINF:10.0,
fileSequenceC.ts
#EXTINF:9.0,
fileSequenceD.ts
#EXT-X-ENDLIST
```

`EXT-X-PLAYLIST-TYPE`를 통해 스트리밍 타입을 알린다. 제공하는 파일이 완전하기 때문에 어느 시점에 이 미디어가 끝나는지 서버 역시 알고 있고,
어디가 끝인 지 클라이언트에게 알려주기 위해 끝나는 지점에 `#EXT-X-ENDLIST` 테그를 붙여 알린다.

즉, 클라이언트는 어느 시점에 접속하든 미디어 파일의 처음 지점부터 접근이 가능하다.

##### Live streaming

처음부터 완전한 미디어 파일을 얻지 못하는 경우가 있다. 가령, 녹화본을 그대로 생중계를 해야 하는 경우다. Live(Sliding Window) 방식의 스트리밍은 이러한
경우에 사용한다. 클라이언트 입장에서 VOD 방식과의 가장 큰 차이점은 미디어 파일의 처음 부분에 접근할 수 없고 서버가 내려주는 부분부터 재생이 가능하다는 것이다.
서버 입장에서의 가장 큰 차이점은 이 m3u8 파일을 주기적으로 업데이트(슬라이딩) 해주어야 한다는 것이다.

아래는 playlist 파일 예시다.

```
#EXTM3U
#EXT-X-TARGETDURATION:10
#EXT-X-VERSION:4
#EXT-X-MEDIA-SEQUENCE:1
#EXTINF:10.0,
fileSequence1.ts
#EXTINF:10.0,
fileSequence2.ts
#EXTINF:10.0,
fileSequence3.ts
#EXTINF:10.0,
fileSequence4.ts
#EXTINF:10.0,
fileSequence5.ts
```

`EXT-X-MEDIA-SEQUENCE` 이 시퀀스가 현재 서버가 제공하는 세그먼트가 어떤 것인지 알려주는데, 이 파일이 업데이트 되면 클라이언트는 시퀀스를 참고하여 다음
파일을 요청한다. 즉, 10초가 지난 후 이 파일은 다음과 같이 업데이트 된다.

```
#EXTM3U
#EXT-X-TARGETDURATION:10
#EXT-X-VERSION:4
#EXT-X-MEDIA-SEQUENCE:2
#EXTINF:10.0,
fileSequence2.ts
#EXTINF:10.0,
fileSequence3.ts
#EXTINF:10.0,
fileSequence4.ts
#EXTINF:10.0,
fileSequence5.ts
#EXTINF:10.0,
fileSequence6.ts
```

서버 입장에서 주의할 점은, 이 **시퀀스가 반드시 1씩만 증가해야 한다**는 것이다. 클라이언트가 이 파일을 주기적으로 관찰하는데 시퀀스가 2 이상 증가 하게 되면
다음 세그먼트를 찾지 못해 스트리밍이 정지하고, 시퀀스가 0인채로 유지되면 클라이언트는 현재 재생파일이 매우매우 길다고 생각하고 다음 재생 목록을 요청하지 않는다
(이 때 클라이언트는 `#EXTINF` 테그에 적힌 재생 시간은 참고하지 않는다).

`#EXT-X-PLAYLIST-TYPE`이 명시되어 있지 않으면 기본적으로 Live 방식이라고 가정한다. 또, 언제 미디어가 끝날지 알 수 없기 때문에
 `#EXT-X-ENDLIST` 테그는 이 방식에서는 쓰이지 않는다.

