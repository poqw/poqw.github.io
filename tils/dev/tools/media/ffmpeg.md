# FFmpeg

![](https://www.dacast.com/wp-content/uploads/2020/02/FFmpeg_logo1.jpeg)

## Overview

[ffmpeg](https://ffmpeg.org/) 는 거의 대부분의 미디어 데이터(비디오, 오디오 등)의 디코딩과 인코딩을 지원하는 대표적인 툴이다.
단순하게는 아래와 같이 다른 포맷으로 인코딩하는 용도로 쓸 수 있겠다. 

```bash
ffmpeg -i input.mp4 output.avi
```

그러나 `ffmpeg` 는 이외에 엄청나게 많은 기능들을 제공하고 있기 때문에 단순 인코딩/디코딩용 프로그램이라고 생각하면 곤란하다. 거의 대부분 미디어 관련된 작업에
쓰인다고 보아도 무방하다. 그 예로, 동영상 파일 하나로 다음과 같이 스트리밍 서빙이 가능하다.

```bash
ffmpeg -i video.mp4 -b:v 1M -g 60 -hls_time 11 -hls_list_size 5 output.m3u8
```

위와 같이 [hls](../../network/hls.md) 로 스트리밍을 서빙하게 되면 세그먼트 파일들이 무한히 생성되어 이를 관리를 해주어야 하는데, 
`ffmpeg`는 심지어 이런 관리 작업까지 처리해준다.
 
### 동작 원리

`ffmpeg`는 다음과 같은 구조를 가진다.

```
_______              ______________
|       |            |              |
| input |  demuxer   | encoded data |   decoder
| file  | ---------> | packets      | -----+
|_______|            |______________|      |
                                           v
                                       _________
                                      |         |
                                      | decoded |
                                      | frames  |
                                      |_________|
 ________             ______________       |
|        |           |              |      |
| output | <-------- | encoded data | <----+
| file   |   muxer   | packets      |   encoder
|________|           |______________|
```

`ffmpeg` 가 무서운 점은, 저기에 나와 있는 `demuxer`, `decoder`, `encoder`, `muxer` 이 전부 세세하게 옵션을 주어 컨트롤이 가능하다는 점이다.
그 말은 즉, `demuxer`를 통해 한 줄기의 인풋이 두 갈래로 뻗어나가도록 할 수 있을 뿐만 아니라, 스트림 매핑이나 여러 인풋을 동시에 처리하는 것도 가능하다는 이야기다.

각 역할을 살펴보면 다음과 같다.

* `demuxer`: 디멀티플렉서다. 인풋을 여러 스트림으로 쪼개는 역할을 한다.
* `decoder`: frame 단위로 미디어 데이터를 디코딩하는 역할을 한다.
* `encoder`: 디코딩된 미디어 데이터를 원하는 포맷으로 인코딩하는 역할을 한다.
* `muxer`: 멀티플렉서다. 아웃풋을 선택하는 역할을 한다. 각각의 아웃풋에 스트림을 매핑할 수도 있다.
