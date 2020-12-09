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

### 실시간 자막

라이브 스트림에 실시간으로 방송이 달리는 경우가 있다. 그 원리를 파악하기 전에, 위에서 여러 개의 ts 파일 목록을 가진 인덱스 파일을 먼저 살펴보자.

```
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-MEDIA-SEQUENCE:2
#EXT-X-TARGETDURATION:10
#EXTINF:10,
fileSequence2.ts
#EXTINF:10,
fileSequence3.ts
#EXTINF:10,
fileSequence4.ts
#EXTINF:10,
fileSequence5.ts
#EXTINF:10,
fileSequence6.ts
```

이 목록에서 알 수 있는 건 현재 5개의 엔트리가 존재하고, 각 엔트리는 10초 간격이라는 것이다.
이는 `EXT-X-TARGETDURATION` 에 정의된 것을 따르는데, 이 값은 클라이언트가 얼마만큼의 시간간격을 가지고 서버에 데이터 청크를 요청해야 하는지를 의미한다.
만약 이 상태에서 10초가 지나게 되면 `EXT-X-MEDIA-SEQUENCE`는 `3`으로 증가할 것이고, 리스트의 맨 위가 빠지고 맨 아래에는 새로은
엔트가 추가될 것이다.

실시간 자막의 원리도 이와 별반 다르지 않다.

```
#EXTM3U
#EXT-X-TARGETDURATION:10
#EXT-X-VERSION:3
#EXT-X-MEDIA-SEQUENCE:1
#EXTINF:10,
subtitleSegment1.webvtt
#EXTINF:10,
subtitleSegment2.webvtt
#EXTINF:10,
subtitleSegment3.webvtt
```

위에서 설명했던 index 파일과 매우 유사하다. 여기서 10초가 지난다면 파일은 아래와 같이 업데이트 된다.

```
#EXTM3U
#EXT-X-TARGETDURATION:10
#EXT-X-VERSION:3
#EXT-X-MEDIA-SEQUENCE:2
#EXTINF:10,
subtitleSegment2.webvtt
#EXTINF:10,
subtitleSegment3.webvtt
#EXTINF:10,
subtitleSegment4.webvtt
```

> **NOTE**: 자막 인덱스 파일과 스트림 인덱스 파일의 `EXT-X-TARGETDURATION`가 같아야 한다.

실시간 스트리밍을 자막과 함께 내려주고 싶다면, master 인덱스 파일을 만들어 자막 인덱스 파일과 스트리밍 인덱스 파일을 참조해야 한다.

```
#EXTM3U
#EXT-X-MEDIA:TYPE=SUBTITLES,GROUP-ID="subs",NAME="English",DEFAULT=NO,FORCED=NO,URI="subtitles.m3u8",LANGUAGE="en"
#EXT-X-STREAM-INF:BANDWIDTH=1118592,CODECS="mp4a.40.2, avc1.64001f",RESOLUTION=640x360,SUBTITLES="subs"
prog_index.m3u8
```

위 파일에서는 `EXT-X-MEDIA`를 통해 자막 인덱스 파일을, `EXT-X-STREAM-INF` 를 통해 스트리밍 인덱스 파일을 참조했다.
`SUBTITLES="subs"` 부분에 자막 인덱스 파일의 아이디를 넣었다는 걸 눈여겨 보자.

#### 자막 이해하기

잠깐 이야기를 새서 자막 이야기를 해보려 한다. 자막은 WEBVTT(Web Video Text Tracks) 텍스트 포맷을 통해 스트림에 입힐 수 있다.
원래는 HTML5 비디오에 사용될 목적으로 개발되었다. WEBVTT 파일은 아래와 같은 형식이다.

```
WEBVTT
X-TIMESTAMP-MAP=MPEGTS:900000,LOCAL:00:00:00.000
00:00:01.000 --> 00:00:03.500
Have you had the opportunity to be in Columbia
00:00:04.000 --> 00:00:06.000
Belgium, Denmark, France
00:00:06.000 --> 00:00:10.200
United States, Spain, Holland, Poland, Germany, Sweden
00:00:10.300 --> 00:00:11.300
in the same week.
```

위에서 알 수 있다시피, 모든 자막은 시작과 끝 시간, 그리고 표시할 텍스트을 속성으로 가진다.

