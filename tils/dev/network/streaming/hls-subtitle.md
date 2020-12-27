# HLS Streaming with subtitle

![](https://user-images.githubusercontent.com/31282181/86788148-1fbe8c00-c066-11ea-82ee-adf24f4a2ced.png)

## Overview

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

실시간 스트리밍을 자막과 함께 내려주고 싶다면, **master 인덱스 파일**을 만들어 자막 인덱스 파일과 스트리밍 인덱스 파일을 참조해야 한다.

```
#EXTM3U
#EXT-X-MEDIA:TYPE=SUBTITLES,GROUP-ID="subs",NAME="English",DEFAULT=NO,FORCED=NO,URI="subtitles.m3u8",LANGUAGE="en"
#EXT-X-STREAM-INF:BANDWIDTH=1118592,CODECS="mp4a.40.2, avc1.64001f",RESOLUTION=640x360,SUBTITLES="subs"
prog_index.m3u8
```

위 파일에서는 `EXT-X-MEDIA`를 통해 자막 인덱스 파일을, `EXT-X-STREAM-INF` 를 통해 스트리밍 인덱스 파일을 참조했다.
`SUBTITLES="subs"` 부분에 자막 인덱스 파일의 아이디를 넣었다는 걸 눈여겨 보자.

## 자막 이해하기

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

### 자막 싱크

클라이언트가 미디어에 처음 접속하는 시점이 다 다를 것인데, 항상 00:00:01.000 부터 자막을 줄 수는 없다. 그렇다면 모든 클라이언트가 자막이 다 따로 놀 것이기
때문이다. 따라서 절대적인 기준이 필요한다, VTT에서는 미디어의 재생 시작 시간이 그 기준이다. 

만약 미디어의 재생 시작 시간을 알고 있다면 `X-TIMESTAMP-MAP` 를 조정하여 자막의 싱크를 맞출 수 있다.
`MPEGTS`는 스케일이 90000: 1 인데, 이는 90000이 10초에 대응된다는 의미다.
지금과 같이 `MPEGTS:900000,LOCAL:00:00:00.000` 이렇게 설정되었다면, Local 시간인 00:00:00.000 에 대해 자막이 10초 밀려야 한다는 뜻이다.
즉, 아래 나와 있는 자막의 시간이 `00:00:01.000 --> 00:00:03.500` 라면, 10초씩 밀려 `00:00:11.000 --> 00:00:13.500` 이렇게 되는 것과 같은
효과를 낸다.

그렇다면 영상 재생 시간은 어떻게 알 수 있을까? `ffmpeg` 패키지에 같이 포함되어 있는 `ffprobe`를 이용하면 된다.

```bash
ffprobe -show_frames seg.ts
```

이는 심지어 마스터 플레이리스트를 대상으로도 조회가 가능하다.

```bash
ffprobe -show_frames http://hls-example.com/v1/unsecured/media/hls/master.m3u8
```
