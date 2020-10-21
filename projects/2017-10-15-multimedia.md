---
layout: post
title: 멀티미디어 공학 개론(1) (feat. KU.멀공개)
category: [multimedia]
author: hyungsun
image: assets/images/multimedia_1.png
---
# 1장. 멀티 미디어란?
> 여러 형식의 정보 콘텐츠와 정보 처리 (보기: 텍스트, 오디오, 그래픽, 애니메이션, 비디오, 상호 작용)를 사용하여 사용자에게 정보를 제공하고 즐거움을 주는 미디어를 뜻한다.  

출처 : [위키피디아](https://ko.wikipedia.org/wiki/%EB%A9%80%ED%8B%B0%EB%AF%B8%EB%94%94%EC%96%B4)

# 2장. 이미지
화소의 단위는 픽셀이다. 비트맵은 이 2차원 픽셀로 이루어져 있다.  
- resolution: 해상도, 단위 영역을 표현하는 픽셀 수가 많아질수록 화질이 좋아짐.
- Aspect ratio: 이미지의 가로 / 세로 비율

#### 화질이랑 해상도는 다르다.
1600 * 1800 모니터 2개가 있는데 하나는 13인치 모니터(A)고 다른 하나는 15인치 모니터(B)라고 하자.  
이 경우 A 모니터는 B모니터와 해상도는 같지만 화질은 더 좋다.

### Half-tone printing
하프톤은 망점이라고 하며, 크기와 간격에 따라 검은 점을 찍어 명암을 표현하는 방식이다.
아래에서 오른쪽 그림에 있는 명암을 하프톤으로 표현한 것이 왼쪽 그림이다.
![Half-tone]({{ site.url }}/assets/images/multimedia_1.png)
  

픽셀을 그대로 종이에 찍어버리면 아래에서 왼쪽 그림처럼 상당히 이상한 모양이 나오는데 한 번쯤 본 적이 있을 것이다.
그래서 하프톤으로 사람 눈에 맞게 변환을 해주는 것이다. 변환하면 오른쪽 그림과 같이 바뀌어 사람 눈으로 보기에 자연스러워 진다.

| --------: | :-------- |
| ![Half-tone]({{ site.url }}/assets/images/multimedia_2.png)  | ![Half-tone]({{ site.url }}/assets/images/multimedia_3.png) |
{: .table}

하프톤의 방식에는 디더링과 패터닝이 있으며, 보통 신문을 인쇄하는 데 사용된다.

### Gray Scale Image
회색이미지에는 2가지 방식이 있다.
- 1 bit image: 1픽셀을 표현하기 위해 1 bit를 사용하고 흑과 백 둘 중의 하나로 표현된다.
- 8 bit image: 1픽셀을 표현하기 위해 1 byte를 사용하고 픽셀에 명암이 표시된다. (0~255)

#### Patterning & Dithering
Patterning 과 Dithering 모두 8 bit image에 사용되는 하프톤 방식이다.
- Patterning은 각 픽셀의 값(0~255)를 사용하고자 하는 패턴의 개수(10)로 나눈 값(256/10)으로 픽셀의 값을 나누어서 얻은 정수(만약 100이라면 100/25.6 = 4)를 아래 패턴과 매칭시켜 대체한다.
![Patterning & Dithering]({{ site.url }}/assets/images/multimedia_4.png)

- Dithering은 휴리스틱하게 정해진 Dithering Matrix을 쓴다는 점을 제외하고는 Patterning과 똑같다. 만약 3*3 Matrix를 쓴다고 했을 때, 이 행렬 안에 있는 값 중 픽셀의 값보다 작은 값들을 모두 칠하게 되어, 실제로는 Patterning보다 훨씬 많은 패턴으로 프린팅하게 된다.

### Color Image
칼라 이미지에도 2가지 방식이 있다.
- 24 bit color image: RGB(0~255, 0~255, 0~255)로 표현되며, 실제로는 Alpha Channel(투명도, 1byte)를 더해 32 bit image로 표현 된다. true color image 라고도 한다.
- 8 bit color image: LUT(Color Lookup Table)를 사용하여 색상을 표현하는 데 필요한 용량을 줄였다. 1바이트로 LUT의 인덱스를 조회한다. LUT는 각 인덱스마다 3byte로 색상을 표현한 테이블이며, 최대 256개의 색상을 담는다. 따라서 이미지에 따라 LUT가 담고있는 색상은 달라진다.
![LUT]({{ site.url }}/assets/images/multimedia_5.png)

#### LUT를 만드는 방법
1. R, G, B 3차원 좌표 공간에 이미지에 쓰이는 모든 색을 뿌려놓고, 그 점을 모두 담는 경계직육면체를 그린다.
2. 그 직육면체에 대해 각 축으로 점들을 sort한다.
3. 가장 크게 분포한 축(RGB 중 하나)을 찾아 나누었을 때 같은 점의 개수를 가지도록 자른다. 이 방식을 반복하여 직육면체를 256등분한다. (2등분 할 때마다 가장 긴 축을 비교한다)
![LUT]({{ site.url }}/assets/images/multimedia_6.png)
4. 이렇게 등분된 조각들의 대표값을 취해 그 조각에 있는 점들의 값을 대표값으로 할당하고 총 256개의 인덱스를 가진 LUT를 만든다.
5. image information header에 LUT 인덱스 정보를 추가한다.


### BMP
비트맵 이미지는 2가지 방식이 있다.
- DDB: 디바이스에 종속적인 방식.
- DIB: 디바이스에 독립적인 방식. 디바이스가 바뀌어도 항상 같은 모양이다.  
비트맵 이미지는 보통 DIB format을 취하는데, 
파일 구조는 다음과 같다.

![BMP]({{ site.url }}/assets/images/multimedia_7.png)

### Bitmap File Header
비트멥 파일 헤더의 총 사이즈는 `14 byte`이다.

| :--------: | :--------: | :--------: |
| **필드 이름** | **사이즈** | **설명** |
| Type | 2 Byte | 0x42 0x4D (BM) | 
| Size | 4 Byte |BMP file 사이즈 (in byte) | 
| Reserved 1 | 2 Byte | 예약된 공간, 보통은 0 으로 채워짐 | 
| Reserved 2 | 2 Byte | 예약된 공간, 보통은 0 으로 채워짐 | 
| Offset | 4 Byte | bitmap data가 시작되는 오프셋 (in byte) | 
{: .table}

### Bitmap Info Header (DIB Header)
비트멥 Info 헤더의 총 사이즈는 `40 byte`이다.

| :--------: | :--------: | :--------: |
| **필드 이름** | **사이즈** | **설명** |
| Size | 4 Byte | info header의 사이즈 (in byte, default 40) |
| Width | 4 Byte | 이미지 가로의 픽셀 개수 |
| Height | 4 Byte | 이미지 세로의 픽셀 개수 |
| Plane | 2 Byte | Color 평면 수, 항상 1. |
| BitCount | 2 Byte | 한 픽셀을 표현하는 데 몇 비트가 필요한가. |
| Compression | 4 Byte | 압축방식. 0 이면 압축하지 않은 것. |
| ImageSize | 4 Byte | bitmap data의 사이즈. |
| XPelsPerMeter | 4 Byte | 미터 당 픽셀이 몇개인가. |
| YPelsPerMeter | 4 Byte | 미터 당 픽셀이 몇개인가. |
| NumColors | 4 Byte | palette 안에 있는 색상 수. 만약 0 이면 BitCount 필드에 색상 수를 저장 |
| NumImportant | 4 Byte | important colors 의 수. 보통은 무시된다. |
{: .table}

### Color Pallete
위에서 등장한 Color Pallete는 BGR 순서로 색상정보가 저장되어 있다.
![Color Pallete]({{ site.url }}/assets/images/multimedia_8.png)  
reservced는 항상 0으로 세팅되어 있고, 위에서 다룬 alpha 채널과는 별개이다.
참고로 Color Pallete는 LUT의 한 종류이고, 8 bit gray scale image 와 8 bit color image 에만 사용된다.  
true image(24 bit image)는 Color Pallete를 거치지 않아 데이터 필드에 인덱스 대신 3 byte RGB 데이터를 집어넣는다.

#### Pixel Data (Bitmap data)
Grayscale bitmap / 8 bit color bitmap : Color Pallete 사용.
Truecolor bitmap(=24 bit color bitmap) : 색상들은 BGR 순서대로 데이터 필드에 저장된다. 
픽셀데이터는 bottom-up방식으로 저장되고, 오른쪽 끝에 더미 바이트를 채워넣어 이미지의 사로가 항상 4 byte의 배수가 되도록 해준다.

### 24 bit Bitmap true color image
아래와 같은 이미지를 직접 byte data로 나타내보자. byte order는 리틀 엔디안이다.
![24 bit Bitmap true color image]({{ site.url }}/assets/images/multimedia_9.png) 
true color 이므로 color pallete는 사용하지 않는 다는 점에 주의해야 한다.

#### 결과
![24 bit Bitmap true color image]({{ site.url }}/assets/images/multimedia_10.png) 

#### file header
`42 4d` : BM, BITMAP이미지 임을 표기  
`66 00 00 00` : 파일 전체 사이즈 = 14 + 40 + 16*3 = 102 = 0x66  
`00 00` : reserved 1  
`00 00` : reserved 2  
`36 00 00 00` : BITMAP 데이터가 시작되는 오프셋 = 헤더의 총 길이 = 14 + 40 = 54 = 0x36  

#### info header
`28 00 00 00` : info header 사이즈는 40 = 0x28  
`04 00 00 00` : 가로 픽셀 개수  
`04 00 00 00` : 세로 픽셀 개수  
`01 00` : Plane, 항상 1  
`18 00` : BitCount, 한 픽셀에 몇 비트가 드는가? 24 bit 이미지 이므로 24 = 0x18  
`00 00 00 00` : Compression  
`30 00 00 00` : bitmap data 사이즈 = file 사이즈 - offset = 0x66 - 0x36 = 0x30  
`13 0b 00 00` : 가로 1 m 에 픽셀이 몇 개 들어가나? 0xB13 = 2835 개  
`13 0b 00 00` : 세로 1 m 에 픽셀이 몇 개 들어가나? 0xB13 = 2835 개  
`00 00 00 00` : 팔레트 쓰지 않으므로 0  
`00 00 00 00` : 항상 0  

#### Bitmap data
bottom up 방식으로 데이터가 씌여진 것에 주의한다.  
`ff 00 00`
`ff 00 00`
`80 80 80`
`80 80 80`
`ff 00 00`
`ff 00 00`
`80 80 80`
`80 80 80`  
`00 00 ff`
`00 00 ff`
`00 ff 00`
`00 ff 00`
`00 00 ff`
`00 00 ff`
`00 ff 00`
`00 ff 00`

### Grayscale 8 bit Bitmap image
아래와 같은 이미지를 직접 byte data로 나타내보자. byte order는 역시 리틀 엔디안이다.
![Grayscale 8 bit Bitmap image]({{ site.url }}/assets/images/multimedia_11.png) 
8 bit image 이므로 color Pallete를 사용해야 한다.

#### 결과
![Grayscale 8 bit Bitmap image]({{ site.url }}/assets/images/multimedia_12.png) 

#### file header
`42 4d` : BM, BITMAP이미지 임을 표기  
`46 04 00 00` : 파일 전체 사이즈 = 14 + 40 + 4\*256(팔레트 크기) + 16\*1 = 1094 =  0x446  
`00 00` : reserved 1  
`00 00` : reserved 2  
`36 04 00 00` : BITMAP 데이터가 시작되는 오프셋 = 헤더의 총 길이 = 14 + 40 + 4*256(팔레트 크기) = 1078 = 0x436  

#### info header
`28 00 00 00` : info header 사이즈는 40 = 0x28  
`04 00 00 00` : 가로 픽셀 개수  
`04 00 00 00` : 세로 픽셀 개수  
`01 00` : Plane, 항상 1  
`08 00` : BitCount, 한 픽셀에 몇 비트가 드는가? 8 bit 이미지 이므로 8 = 0x8  
`00 00 00 00` : Compression  
`10 00 00 00` : bitmap data 사이즈 = file 사이즈 - offset = 0x446 - 0x436 = 0x10  
`23 0b 00 00` : 가로 1 m 에 픽셀이 몇 개 들어가나? 0xB23 = 2851 개  
`23 0b 00 00` : 세로 1 m 에 픽셀이 몇 개 들어가나? 0xB23 = 2851 개  
`00 01 00 00` : 팔레트에 들어가는 색 수 = 256 = 0x100  
`00 01 00 00` : 중요한 색상의 수 = 256 = 0x100

#### color palette
gray scale image 이므로 256*4 사이즈 palette를 가진다.  
color image의 경우 color palette는 모두 다르지만, gray scale은 color palette는 이미지와 상관없이 모두 같다.  
`00 00 00 00`   
`01 01 01 00`   
...  
`fe fe fe 00`   
`ff ff ff 00`   

#### Bitmap data
bottom up 방식으로 데이터가 씌여진 것에 주의한다. 또, 한 픽셀은 1 byte로 표현된다.  
`c0 c0 ff ff`
`c0 c0 ff ff`  
`40 40 80 80`
`40 40 80 80`

### GIF
여기서 살펴보는 GIF는 GIF87a이다.

#### 헤더구조
![GIF Header]({{ site.url }}/assets/images/multimedia_13.png)   

GIF 전체에 대한 포괄정인 정보를 담는 헤더  
- Header(GIF Signature) : 6 byte
- Logical Screen Descriptor : 7 byte
- Global Color Table : 전역 칼라 테이블

아래 3개는 애니메이션의 프레임(이미지 수) 만큼 반복 된다. 결국 각 이미지를 표현한다.
- Local Image Descriptor
- Local Color Table
- Image Data(Raster Area)  

GIF 의 Terminator
- Trailer

#### GIF Signature
GIF87a 를 각각 한 글자식 나타내어 `6 byte` 를 차지한다.

#### Screen Descriptor
Screen Descriptor의 사이즈는 `7 byte`이다.
![GIF Header]({{ site.url }}/assets/images/multimedia_14.png)  

| :--------: | :--------: | :--------: |
| **필드 이름** | **사이즈** | **설명** |
| Screen Width | 2 Byte | 가로 픽셀 수 | 
| Screen Height | 2 Byte | 세로 픽셀 수 | 
| m | 1 bit | 1 이면 파일에 Global Color Table이 포함된다는 의미 | 
| cr | 3 bit | 색을 `cr+1` bit로 표현하겠다  | 
| 0 | 1 bit | 안 쓰임, 0 으로 채워짐 | 
| pixel | 3 bit | 픽셀을 `pixel+1` bit로 표현하겠다 | 
| Background | 1 byte | 배경 색상의 인덱스 | 
| Padding | 1 byte | 0으로 채움 | 
{: .table}

#### Color map
cr이나 pixel에는 보통 같은 값이 들어간다. 같은 값이 들어가므로 pixel에 111이 들어갔다는 가정하에 설명을 하면, 
이는 곧 Color map의 인덱스가 총 256개라는 것이다. 
이 때 R, G, B 가 각각 3 개의 색을 표현해야 하므로 실제로 테이블 사이즈는 \\({3} * {2}^{8}\\) byte 이다.  

-R- -G- -B-  
`00 00 00` : 배열 인덱스 0  (각 3바이트)
`00 30 20` : 배열 인덱스 1  
`01 2f 38` : 배열 인덱스 2  
...  
`f2 30 28` : 배열 인덱스 254  
`e2 3f 24` : 배열 인덱스 255  


#### Image Descriptor
Image Descriptor의 사이즈는 `10 byte`이다.
![Image Descriptor]({{ site.url }}/assets/images/multimedia_15.png)  

| :--------: | :--------: | :--------: |
| **필드 이름** | **사이즈** | **설명** |
| Comma | 1 Byte | 가로 픽셀 수 | 
| Image left | 2 Byte | 이미지의 X 좌표 | 
| Image top | 2 byte | 이미지의 Y 좌표 | 
| Image width | 2 byte | 이미지 가로 길이  | 
| Image height | 2 byte | 이미지 세로 길이 | 
| m | 1 bit | 0 이면 Global, 1 이면 Local Color Table 사용 | 
| i | 1 bit | 0 이면 Sequential, 1 이면 Interlaced 방식 | 
| Padding | 3 bit | 0으로 채움 | 
| Pixel | 3 bit | 픽셀을 `pixel+1` bit로 표현하겠다 | 
{: .table}

#### Sequential, Interlaced ?
Sequential은 위부터 아래로 순서대로 화면에 출력하는 방식이고, (1 2 3 4 5 6 7 8)  
Interlaced는 화면 전반적으로 듬성 듬성 출력하는 방식이다. (1 4 8 3 6 2 5 7)  
four-pass interlaced의 경우 4번의 phase에 걸쳐서 한 이미지가 완성된다.   
만약 이미지 로딩이 느린 경우 Interlaced 방식은 좀 더 이미지가 빨리 로딩되는 것처럼 보인다.

# 3장. 칼라 모델, Color Model 

> 사람의 눈은 R, G, B에 각각 40, 20, 1 의 비율로 민감하다.

### Gamma Correction
모니터에서 방출되는 빛 (\\({\gamma}\\)) 은 상식적으로 생각하면 전압에 비례해야 한다. 하지만 실제로 출력 시켜보면 \\({R}^{\gamma}\\) 지수 승이 되어 밝기가 표현 된다.
따라서 우리는 모니터로 출력하기 전에 출력 전압에 \\({R}^{\frac{1}{\gamma}}\\)를 해주어 이를 보정해주는데, 이를 `Gamma Correction` 이라고 한다.

### CIE (표준화 기구)
Color Matching은 사람의 눈이 색에 따라 민감한 정도가 다른 것을 나타낸 것이고, CIE는 Color Matching에 대한 표준이다.  
즉, 정확하게 누구나 색을 인식할 수 있도록 명확한 기준을 짓자는 것이 그 목적이다.
![CIE]({{ site.url }}/assets/images/multimedia_16.png)  
위 그림에서 왼쪽은 실제 사람 눈의 상대적인 민감도를 나타낸 것인데, 상대적인 수치이다 보니 음수 값이 측정되었다. 표준에서는 이를 보정하기 위해 오른쪽 그림과 같이 조정하였다.
CIE에서는 그래프를 적분하여 색을 특성화하는 X, Y, Z 를 뽑아냈는데, 이 때 Y는 휘도(luminance)라고 부른다.
그리고 이 X, Y, Z 를 합이 1이 되도록 X+Y+Z 로 나누어 주었는데, 이를 x, y, z라고 한다.
x, y 는 색도라고 부르고, z = 1 - x - y 로 구한다.

![CIE]({{ site.url }}/assets/images/multimedia_17.png)  
위 그림에서 NTSC, SMPTE, EBU 각각의 시스템에 대한 자기들만의 표준을 정의한 것이다.

![CIE]({{ site.url }}/assets/images/multimedia_18.png)  
위 그림에서 삼각형은 픽셀이 표현할 수 있는 색의 범위이고, 그것을 감싸는 도형은 실제 색의 범위를 나타낸 것이다. 만약 밖에 있는 도형에 있는 색을 출력해야 한다면, 삼각형 경계면에 있는 색으로 대체하여 출력한다.

### Color Model for Image
#### L\*a\*b\* Color Model
![Color Model]({{ site.url }}/assets/images/multimedia_19.png)
CIE에서 뽑아냈던 X, Y, Z를 변환하여 만든 색 모델이다. 
- *L : 밝기
- a* : Red-Green
- b* : Yellow-Blue

#### RGB Model
CRT 모니터에 출력하기 위해 고안된 모델이다. 빛의 삼원색이 기준이어서 R+G+B = W 가 성립한다.

#### CMY / CMYK Model 
색의 삼원색(자홍, 노랑, 청록)을 기준으로 만든 색이고, 프린터에서 잉크로 출력할 때 사용되는 모델이다. C+M+Y = B  

![Color Model]({{ site.url }}/assets/images/multimedia_20.png)

CMY와 RGB의 관계는 다음과 같다.  
C = 1 - R  
M = 1 - G  
Y = 1 - B  

### Color Model for Video
#### YUV Model
PAL Analog Video에서 색을 표현하기 위해 탄생한 것이 YUV이며, RGB를 변환하여 구한다.

#### YIQ Model
NTSC Anlog Video에서 색을 표현하기 위해 탄생한 것이 YIQ이고, YUV에서 Y를 기준으로 U와 V를 33도만큼 회전시킨 모델이다.

#### YCbCr Model
Digital Video에서 색을 표현하기 위한 국제 표준이다. YUV를 변형하여 만들었다.

# 4장. 비디오

### Scanning
Progressive와 Interlaced 두가지 방식이 있으며, 영상의 프레임을 표현하기 위해 가로 줄 단위로 주사하는 것을 의미한다. 스캐너가 스캔하는 방식을 떠올리면 이해하기 쉽다.
- Progressive Scanning : 왼쪽 위부터 순서대로 아래쪽으로 출력하는 방식
- Interlaced Scanning : 홀수 줄을 먼저 출력하고 난 뒤 짝수 줄을 출력하는 방식, 이 때 홀과 짝을 각각 필드라고 부른다. odd field + even field = frame
frame은 최소 50Hz로 주사해야 flickering(깜빡임)이 발생하지 않는데, 모니터가 25 fps / 30 fps 를 지원해 50Hz로 주사할 수 없는 경우 Interlaced Scanning을 사용하여 보정한다.
![Scanning]({{ site.url }}/assets/images/multimedia_21.png)
여기서 Horizontal Retrace(=Blanking Interval)라는 개념이 등장하는데, 한 줄을 주사하고 나서 다음 줄을 주사하기 위해 왼쪽으로 Scanner가 돌아가는 데 걸리는 시간을 의미한다.
한 줄을 주사하는 데 걸리는 시간은 Active line signal이라 한다.
![Scanning]({{ site.url }}/assets/images/multimedia_22.png)

### Analog Video
Analog Video에는 3 종류가 있다.
- NTSC Video
- PAL Video
- SECAM

#### NTSC Video
기본적으로 4:3의 Aspect 비율이며, frame 당 525 line을 가지고 있다.  
최소 29.97 frame/sec로 주사한다.  

그러므로 1초당 29.97 * 525 = 15734 line을 주사해야 한다. 이는 곧 1 line을 출력하는 데 63.6 마이크로초가 필요하다는 것을 의미하고, 
이 중 10.9 마이크로초는 Horizontal retrace이므로 active signal은 52.7 마이크로초이다.  

또 각 필드의 첫 20 line은 control information을 위해 예약되어 있어서 프레임 당 active line은 525 - 20 * 2 = 485(Non-Blanking Pixel) 이다.  

NTSC 비디오는 고정 된 수평 해상도가 없는 아날로그 신호이다(아날로그 신호가 고정된 픽셀수로 들어오지 않는다). 따라서 신호를 한 샘플당 같은 픽셀수를 가지도록 샘플링해서 입력을 받아야 한다. 모니터의 수평 길이는 알고 있는 정보이기 때문이다.
`Pixel Clock`은 비디오의 각 수평 라인을 샘플로 나누는 주파수를 의미하며 픽셀 클록의 주파수가 높을수록 line 당 더 많은 샘플이 추출된다.
비디오 포맷이 달라지면 라인 당 서로 다른 수의 샘플을 제공하게 된다.

  
NTSC는 YIQ Color Model을 사용한다.

NTSC의 비디오 채널은 6MHz의 대역폭을 가지고 있고 인간이 컬러의 고주파 성분에 덜 민감하다는 특성에 따라 Y에는 4.2MHz, I와 Q에는 각각 1.6MHz, 0.6MHz 의 대역폭을 할당한다. 
4.2 + 1.6 + 0.6 은 6 을 넘어가 버리므로 I와 Q를 결합해 싱글 색정보 C(Color Subcarrier)를 만들고 Y와 C에 대해 이산 푸리에 변환을 통해 3.58 MHz만 사용하고도 서로 분리될 수 있도록(Y,I,Q가 서로 붙어 있으면 간섭을 일으킨다) 보정한다.  
이것을 나타낸 것이 아래 그림이다.

![NTSC Video]({{ site.url }}/assets/images/multimedia_23.png)

따라서 Decoding과정에서는 Y와 C를 분리하고 C에서 I와 Q를 추출하는 방식으로 진행된다.
Color Subcarrier의 범위는 2.25 ~ 3.58 MHz
#### PAL Video
기본적으로 4:3의 Aspect 비율이며, frame 당 625 line을 가지고 있다.  
최소 25 frame/sec로 주사한다. 
PAL은 YUV Color Model을 사용한다.

#### SECAM
기본적으로 4:3의 Aspect 비율이며, frame 당 625 line을 가지고 있다.  
최소 25 frame/sec로 주사한다. 
SECAM은 YUV Color Model을 사용한다.
SECAM이 PAL과 다른 점은 Color coding scheme이 다르다. 그 외에 차이점은 없다.

#### 비교
![NTSC Video]({{ site.url }}/assets/images/multimedia_24.png)

### Digital Video
#### Digital Video 이점
- Digital device에 저장이 가능해 무제한 복사, 처리 및 합성이 가능하다.
- Digital 이므로 Direct Acess 가 가능하다.(갑자기 3분 30초 접근)
- 암호화에 용이하다.
- 채널 노이즈를 잘 견딘다.

처음에는 Composite video로 시작했으나, RGB / YUV / YCbCr을 사용하는 Component Video로 진화하였다.
Digital Video에는 3 종류가 있다.
- CCIR
- CIF / QCIF
- HDTV

#### Chroma Subsampling
인간의 눈은 색차 정보보다 밝기 정보에 훨씬 민감하다. 따라서 YCbCr에서 색정보에 해당하는 Cb와 Cr 정보를 줄이는 방식이 Chroma Subsampling 이며, 방식에는 3가지가 있다.  
- 4:2:2
- 4:1:1
- 4:2:0
![Chroma Subsampling]({{ site.url }}/assets/images/multimedia_25.png)

#### CCIR
- 디지털 비디오 표준이다.  
- 4:2:2 Chorma Subsampling을 사용한다. 따라서 두 픽셀당 4 byte로 표현되며 각각 Y + Cb, Y + Cr을 나타낸다.
- 4:3 Aspect 에 Interlaced 방식을 사용하여 주사한다. 
- 60 frame / sec
- 아날로그를 지원한다.(NTSC)

#### CIF / QCIF
- 4:2:0 Chorma Subsampling을 사용한다.
- 4:3 Aspect 에 Progressive 방식을 사용하여 주사한다.
- 30 frame / sec
- 아날로그를 지원한다.(NTSC의 frame rate를 쓰고 PAL의 Active line의 반절을 사용)

#### HD TV
- 요즘 나오는 제품들은 다운 샘플링을 하지 않는다.
- 16:9 Aspect 에 Progressive 방식을 사용하여 주사한다.
- 무려 한 frame 에 1125 line을 가지고 있다.

### Video Type Interface
기본적으로 물리적으로 독립된 3개의 라인(R, G, B)를 사용한다. 

아날로그 비디오 인터페이스는 다음 4가지이다.  
- Component
- Composite
- S-video
- VGA
  
디지털 비디오 인터페이스는 다음 2가지이다.
- DVI
- HDMI

#### Component
서로 간의 간섭이 없어서 화질이 좋다. 대신 라인 3개를 각각 보내야 하므로 대역폭을 많이써야 하며 동기화의 이슈가 있다.

#### Composite
TV에서 많이 사용한다. 인풋 라인을 하나만 꽂으므로 밝기 정보와 색상 정보 사이에 간섭이 발생한다. 즉 분리가 완벽하지 못하나 대역폭은 더 적게 사용한다.

#### S-video
선을 2개 꽂는데, 각각 색 정보와 명도 정보를 따로 보내 간섭을 피한다.

#### VGA
파란색 15pin 케이블, RGB를 지원한다.

#### DVI
아날로그와 디지털 모두 호환이 가능하다.
하얀색 케이블

#### HDMI
제일 작은 케이블
RGB, YCbCr 모두 지원하며 4:4:4 혹은 4:2:2 크로마 서브샘플링을 한다.

### 3D Display
#### Stereoscopic Imaging
좌안과 우안은 각각 보는 영상이 다르다. 양안 시차라고도 하는데, 두 눈의 위치 차이 때문에 발생한다.
즉, 좌안이 좀 더 왼쪽의 영상을 보고 우안이 좀 더 오른쪽의 영상을 본다.  
이 점을 이용해서 다음 3가지 방식으로 2D 화면을 3D처럼 보이게 할 수 있다.
- 적청 안경방식
좌안에는 적색 필터를 달고, 우안에는 청색 필터를 단 안경을 장착하고 보면, 좌안과 우안의 인풋이 달라져 3D로 보이게 된다.
- 편광 안경방식
빛을 편광 시켜 좌안과 우안의 영상을 다르게 만든다.
- 셔터 안경방식
셔터로 빛을 직접 차단하여 좌안과 우안의 영상을 다르게 만든다.


# 5장. 소리
소리는 음파라고도 하며 반사, 회절, 굴절과 같은 파동의 성질을 갖는다.
큰 소리는 진폭이 큰 것이며, 단위로 데시벨(dB)을 사용한다. 너무 작은 소리 같은 경우는 사람이 듣지 못하는데, 듣을 수 있는 소리를 가청영역이라 한다.

![Sound]({{ site.url }}/assets/images/multimedia_26.png)

위 그래프에서 x축은 주파수(음 높이), y축은 음압(음 강도)인데, 3~4 kHz영역에서 사람의 귀가 가장 민감한(작은 소리도 캐치하는) 것을 알 수 있다.

### Masking Effect
Masking Effect는 어떤 소리에 의해 다른 소리를 잘 듣지 못하는 효과를 말하며 다음 2가지 방식이 있다.

Temporal Masking : 어떤 소리를 들었을 때 특정한 시간이 지나야 다른 소리를 들을 수 있음
Frequency Masking : 낮은 톤이 높은 톤을 가려버려 높은 소리가 안들림

#### Temporal Masking
아래 그림처럼 60dB의 소리를 들었을 경우 10ms 가 지나서도 20dB의 소리는 듣지 못한다. 이런 경우를 Temporal Masking이라고 한다.
![Temporal Masking]({{ site.url }}/assets/images/multimedia_27.png)
만약 점점 줄어드는 소리를 계속 듣게 하고 싶다면 f(x) > Test tone 인 감소함수를 생각하면 된다.

#### Frequency Masking
아래 그림은 1KHz의 소리를 들었을 경우를 나타낸 것이다. 그림에서는 데시벨이 낮은 사운드로 테스트하긴 했지만, 실선 화살표가 들을 수 있는 주파수의 소리고 점선 화살표가 들을 수 없는 주파수의 소리를 뜻한다.
![Frequency Masking]({{ site.url }}/assets/images/multimedia_28.png)
다만 Frequency Masking 은 아래 그림처럼 특이한 성질을 지니는데, 주파수가 높아질수록 Masking하는 영역이 넓어진다. 또, 이 영역은 (당연한 것이긴 하지만)데시벨이 클수록 더 넓어진다.
![Frequency Masking]({{ site.url }}/assets/images/multimedia_29.png)
위 그림에서 만약 내가 1, 4, 8 을 동시에 들었다면 가청 영역은 1, 4, 8 을 모두 겹친 그래프보다 위의 영역으로 줄어들게 되고, 2dB의 음압을 가진 소리 중 주파수가 4kHz이상인 소리는 아무것도 들을 수가 없게 된다.

### Critical Band
Critical Band는 임계 대역폭이라고 하며, 음정에 대한 귀의 분해능력에 영향을 미치는 효과를 뜻한다.
즉 2 개 이상의 소리를 동시에 들었을 때 이 두 음을 구별하지 못하는 대역폭을 나눈 것이다.
이 Critical Band 는 마스킹 주파수가 500Hz미만의 경우에서는 100Hz크기로 일정하지만 그 이상의 주파수의 경우에는 점점 더 증가한다.
다시 말해 우리는 주파수가 낮을수록(음 높이가 낮을 수록) 더욱 구별을 못하고, 높을수록 구별을 잘 한다는 의미이다.

#### Bark Unit
여기서 Bark Unit이라는 개념이 등장하는데, 임의의 마스킹 주파수에 대한 하나의 임계 대역 폭을 의미한다.
음 높이가 낮을수록 구별을 잘 못한다는 특징과 별개로 모든 임계 대역폭이 Bark에 대해 아래 그림처럼 대략 비슷한 대역폭을 가지도록 만든 것이다.
![Bark Unit]({{ site.url }}/assets/images/multimedia_30.png)
즉 사람을 기준으로 만들기 위해 정해 놓은 단위인 것이다.

### 음악이란 무엇인가? 
지금까지 소리에 대해 알아봤다면, 소리들의 집합인 음악이 무엇인지도 궁금할 것이다.  
일단 소리에는 7가지 기본 요소가 있다. 
- Pitch (음높이) : 음의 높이
- Rhythm (리듬) : 비슷한 소리가 비슷한 간격을 두고 반복됨
- Tempo (템포) : 소리의 빠르기
- Contour (윤곽) : "up" 혹은 "down" 패턴만 고려한 멜로디의 모양
- Timbre (음색) : 같은 음을 내도 악기 마다 다르다(시간이 지남에 따라 음량이 변하는 것을 Envelope라고 하는데 이 특징이 음색을 결정짓는다)
- Loudness (음량) : 소리의 세기
- Reverberation (반향) : 듣는 사람으로부터 얼마나 떨어져 있는지에 대한 느낌, 노래의 공간감각

#### 음악의 고차원적 개념
위의 7가지 소리 기본요소를 결합하면, 그 때야 비로소 음악의 4개의 개념이 도출된다.
- Meter (박자) : tone 들 간의 그룹화 방식
- Key (조성) : 톤 사이에 존재하는 계층
- Melody (선율) : 음악의 테마
- Harmony (화음) : 다른 음정과의 관계

### 음악의 디지털 화
소리는 기본적으로 아날로그 시그널이다. 아날로그 시그널은 진폭과 시간 축 상에서 연속적이다.
- Discrete Time Signal (Sequence): 시간 축이 불연속적, 진폭은 상관 없는 경우 (샘플링을 거친 경우)
- Continuous Time Signal: 시간 축 상에서 연속적. 진폭은 불연속적이다. (양자화를 거친 경우)
- Digital Signal: 시간 축과 진폭이 불연속한 경우 표현 시 Sequence로 주어지게 된다. (디지털화 된 경우)

### Digitization
아날로그 시그널을 디지털화 할 때 시간과 진폭의 각 차원에서 숫자 시퀀스로 샘플링하는 과정을 거치는데 이러한 숫자는 효율성을 위해 정수로 뽑아낸다. 
샘플링은 일정한 시간 단위로 표본을 추출하는 과정을 의미한다.  
디지털화에는 3가지 요소가 작용한다.
- Sampling : 얼마나 자주 샘플링 할 것인가를 결정
- Quantization : 추출한 표본의 크기를 제한된 범위로 바꾸는 과정으로 범위의 크기를 결정
- Data format : 어떤 파일 포맷을 쓸 것인가를 결정(여기선 다루지 않는다)

#### Sampling 
Sampling rate가 다르면 소리 또한 다르다. 
더 높은 Sampling rate로 샘플링하면 표현되는 주파수 영역의 폭이 넓어지므로 음질이 더 좋아진다.
나이퀴스트 이론에 의해 Sampling frequency를 결정한다. 
나이퀴스트 이론은 Sampling rate의 최소값을 결정하는 이론으로, rate가 오디오 주파수 최대값의 최소 2배는 되어야 한다는 이론이다.

##### Alias Effect
헬리콥터의 프로펠러가 돌아가는 것을 사람눈으로 볼 때 오히려 천천히 돌아가는 것처럼 보인 적이 있을 것이다. 그것이 바로 Alias 효과이다.  
이것은 눈의 Sampling rate가 프로펠러의 rate의 2배를 넘지 못해서 발행한다. 

아래 그림은 눈의 Sampling rate가 8kHz라고 가정했을 때의 예시이다.
![Alias Effect]({{ site.url }}/assets/images/multimedia_31.png)

- 프로펠러의 rate가 4 kHz보다 같거나 작은 경우 : Sampling rate 가 2배보다 같거나 크므로 실제로 프로펠러가 어떻게 돌아가는지 잘 보인다.
- 프로펠러의 rate가 6 kHz인 경우 : 사람 눈에는 2 kHz로 프로펠러가 돌고 있는 것처럼 보인다. 
- 프로펠러의 rate가 8 kHz인 경우 : 사람 눈에는 프로펠러가 정지해있는 것처럼 보인다.
- 프로펠러의 rate가 10 kHz인 경우 : 사람 눈에는 2 kHz로 프로펠러가 돌고 있는 것처럼 보인다. (하지만 6kHz 때보다 프로펠러는 훨씬 더 빨리 돌고 있다)

위의 예시에서 2 kHz는 Alias rate이고 sampling rate - true rate 로 구해진다.

#### Quantization
양자화는 추출한 표본의 크기를 제한된 범위의 숫자로 바꾸는 과정이라 했다. 어떤 파동을 상상했을 때 이 파동에 가장 가까운 계단 모양 디지털 파형을 그린다고 생각하면 된다. 이 때 계단의 총 개수가 늘어날 수록 원본에 가깝게 표현되는데 이를 양자화 비트(정확히는 양자화 비트로 표현되는 수) 라고 한다.

이 때 다음과 같이 2가지 종류가 있다.
- Linear Quantization : 계단의 크기가 동일하다.
- Non-Linear Quantization : 인간의 청각에 맞추어 미세한 간격으로 계단을 조정한다.

웨버의 법칙에 따르면 인간은 큰소리가 커지는 것은 잘 못느끼지만 작은 소리가 커지는 것은 잘 느낀다. 이에 따라 u-law와 A-law(유럽 기준)에 맞추어 양자화를 시킨다. 이에 관한 그림이 있지만 사실 별 중요한 내용을 아니므로 생략하겠다.

#### Digitalization
사운드의 디지털화는 아래 그림과 같이 저역 통과필터 > 샘플링 > 양자화 > 부호화 의 과정을 거친다.  
Sampling rate가 높을 수록, 양자화 비트가 클수록 음질은 좋아지지만 데이터 량이 증가한다.  
데이터 량 = Sampling rate * 양자화 비트 * 채널 수 * 재생 시간  
![Alias Effect]({{ site.url }}/assets/images/multimedia_32.png)

### Audio Coding
데이터에 Quantization, Digiterization을 하는 과정을 Coding이라고 한다. 
양자화는 크기값의 분할점을 선정하는 작업과 각 구간의 값들을 대표하는 출력 레벨로 다시 매핑하는 작업으로 이루어진다. 즉 다시 말해 더 넓은 범위의 데이터를 더 적은 범위로 줄인다. 이렇게 양자화는 데이터의 범위를 줄여버리기 때문에 데이터 손실의 주된 요인이 된다.
Audio Coding의 종류로 `LPC`, `PCM`, `DPCM`, `DM`, `ADPCM`이 있다.

Audio Coding들을 밑에서 하나씩 설명할 예정인데, 그 전에 보고 이해하고 넘어가면 좋은 그래프가 있다.
![]({{ site.url }}/assets/images/multimedia_78.png)
가장 위에 있는 그래프는 오디오 데이터를 표현한 것이다. 사람들은 이 오디오 데이터를 어떻게 하면 적은 데이터로 전송할 수 있을까 고민을 하다가, 각 데이터에 대한 빈도를 구해봤는데, 그 것이 좌측 하단에 있는 그래프이다. 빈도 이야기가 나와서 호프만 인코딩을 떠올렸다면 당신은 매우 예리한 사람이다. 또, 현재 데이터에서 앞 데이터를 뺀 차이를 모두 모아서 빈도를 모은 그래프가 바로 우측 하단에 있는 그래프이다. 그래프만 봐도 차이를 모아놓은 그래프가 가장 심플하고 더 압축이 쉬워 보일텐데, 이런 개념이 들어간 코딩 방식은 D(Differential)이라는 꼬리표가 따라붙는다. `DPCM`, `ADPCM`이 바로 그것이다. 이제 `PCM`부터 차근차근 보자.

#### PCM (Pulse Code Modulation)
PCM은 정말 간단하다. 양자화된 데이터를 인풋으로 받아, 그것을 디코딩할 때 쓰일 코드 워드(code word)로 치환하는 게 전부이다. 굉장히 간단한 만큼 비효율적이다.

인풋 데이터가 `130, 150, 140, 200, 230` 이라고 하자.
`130`을 `A`로, `150`을 `B`로, `140`을 `C`로, ... 치환하고, 이 데이터와 `ABCDE`를 같이 전송한다.

복호화할 때는 코드워드 테이블을 참조하여 `130, 150, 140, 200, 230`로 디코딩한다. 결과적으로 얻어낸 복호화 값이 원본 데이터와 차이가 없다. 즉, 손실이 없는 코딩방식이다.

#### LPC (Lossless Predictive Coding)
Predictive라는 꼬리표는 앞서 그래프 이야기 할 때 설명한 Differential과는 조금 차이가 있다. 다음에 나올 값을 예측하여 공통된 부분을 제외한 나머지(차이)를 전송하는 방식이다.
무슨말인가 하면, 이번에도 원본 데이터가 `130, 150, 140, 200, 230` 이라고 하자.
첫 번째로 받아들인 인풋인 `130`은 비교할 대상이 없으므로 `130`이 전송할 값에 그대로 들어간다.

전송할 값: `130`

그 뒤로 `150` 부터는 차이를 구해서 전송한다.

전송할 값: `130, 20, -10, 60, 30`

이 때 LPC에서 주의할 점은 SU(Shifting Up)와 SD(Shifting Down)이라는 개념이 등장한다는 점이다. 양자화를 하게 되면 범위가 정해지는데, 차이 값이 범위를 벗어날 수도 있다. 그 벗어난 값을 커버하기 위해 사용하는 것이 SU, SD이다. 만약 양자화 범위가 -30부터 29까지 라면 SU를 하게 되면 범위가 30 ~ 89으로, SU를 한 번 더 하게 되면 90 ~ 149로 범위가 바뀐 걸로 디코더가 인식한다. 즉, 양자화 범위가 -30부터 29까지 라고 할 때 전송할 값을 다시 나타나게 되면, 

전송할 값: `SU, SU, 40, 20, -10, SU, 30, SU, 0` 이렇게 바뀌게 된다.

디코더에서는 이 값을 받아 `130, 150, 140, 200, 230`로 복호화 하게 되므로, `PCM`과 마찬가지로 무손실 코딩방식이다.


#### DPCM (Differential PCM)
드디어 D라는 꼬리표를 가진 코딩 방식이 나왔다. PCM에서 LPC의 개념과 양자화 단계까지 포함한 녀석이라고 보면 된다. 양자화 단계를 포함했으므로 당연히 손실이 발생한다. 이번에도 마찬가지로 원본 데이터가 `130, 150, 140, 200, 230` 이라고 하자. 예측하는 방식은 정하기 나름인데, 여기서는 앞의 두 값을 평균낸 것을 다음에 나올 값으로 예측하는 것으로 하자.

다음은 맨 처음 데이터를 받은 경우이다.  
받은 데이터: `130`  
예측 값: `130` // 예측할 근거가 없으므로 바로 들어감  
차이: `0`  
전송할 값: `0`  
복원한 값: `130`    // 복원한 값은 예측 값에 전송할 값을 더해서 구한다.  

다음은 `150`까지 받은 경우이다.  
받은 데이터: `130, 150`  
예측 값: `130, 130` // 예측할 근거가 없으므로 첫번째 값을 복사해서 집어넣음  
차이: `0, 20` // 150 - 130 = 20  
전송할 값: `0, 24`  // 20을 양자화 한 값이다.   
복원한 값: `130, 154`    // 130 + 24 = 154  

다음은 `140`까지 받은 경우이다.  
받은 데이터: `130, 150, 140`  
예측 값: `130, 130, 142` // 예측할 근거(130, 154)가 있으므로 142로 예측한다.  
차이: `0, 20, -2` // 140 - 142 = -2  
전송할 값: `0, 24, -8`  // -2을 양자화 한 값이다.   
복원한 값: `130, 154, 134`    // 142 -8 = 134  

다음은 `200`까지 받은 경우이다.  
받은 데이터: `130, 150, 140, 200`  
예측 값: `130, 130, 142, 144` // 예측할 근거(154, 134)가 있으므로 144로 예측한다.  
차이: `0, 20, -2, 56` // 200 - 144 = 56  
전송할 값: `0, 24, -8, 56`  // 56을 양자화 한 값이다.   
복원한 값: `130, 154, 134, 200`    // 144 + 56 = 200   

다음은 `230`까지 받은 경우이다.  
받은 데이터: `130, 150, 140, 200, 230`  
예측 값: `130, 130, 142, 144, 167` // 예측할 근거(134, 200)가 있으므로 167로 예측한다.  
차이: `0, 20, -2, 56, 63` // 230 - 167 = 63  
전송할 값: `0, 24, -8, 56, 56`  // 63을 양자화 한 값이다.  
복원한 값: `130, 154, 134, 200, 223`    // 167 + 56 = 223  

결과적으로 복원한 값인 `130, 154, 134, 200, 223`과 원본 데이터인 `130, 150, 140, 200, 230`사이에서 차이가 발생했다. 이는 양자화 단계를 포함하기 때문에 발생한 것이고, 따라서 손실 코딩방식이다. 각 단계에서 양자화 한 값이 왜 저렇게 나오는지 궁금했을 텐데, 양자화라는 것 자체가 범위를 쪼갠 뒤의 그 대표값을 취했기 때문에 저런 값이 나온다. 아래 테이블을 보자.

![]({{ site.url }}/assets/images/multimedia_79.png)

왼쪽이 양자화의 범위이고, 오른쪽이 대표값이다. 즉 왼쪽이 차이, 오른쪽이 전송할 값이 되는 것이다.


#### DM (Delta Modulation)
DM은 DPCM을 간략화한 버전이다. 스탭 사이즈 k라는 개념이 등장하는데, DPCM에서 차이(복원한 데이터 - 원본 데이터)를 구할 때 그 값이 양수라면 k를 전송하고, 그 값이 음수라면 -k를 전송한다. 이번에도 step size가 `30`이라고 가정하고 `130, 150, 140, 200, 230` 를 DM 해보자.

차이: `0, 20, -20, 70, 70`  
예측한 데이터: `0, 130, 160, 130, 160`  

보내는 데이터: `130, 30, -30, 30, 30`  
복원한 데이터: `130, 160, 130, 160, 190`  

결과가 알려주듯이 손실이 원본 데이터와 매우 크다. 즉 성능이 매우 구린 손실 코딩 방식이다.

#### ADPCM (Adaptive DPCM)
DM이 성능이 너무 구리다 보니 나온 녀석인데, 지속적으로 스탭사이즈인 k값을 바꿔준다. 방식에 따라서는 바뀌주는 부분이 Adaptive Quantizer가 될 수 있고 Predictor가 될 수도 있다. 그냥 Adaptive라는 단어가 들어가면 성능에 영향을 미치는 요인이 휴리스틱하게 결정된다고 보면 된다. 따라서 더 이상의 자세한 설명은 생략한다.

본문은 건국대학교 멀티미디어 공학개론 수업의 내용을 필기한 것입니다.

읽느라 고생하셨습니다.



