# 작성요령

![Design doc](https://images.sampletemplates.com/wp-content/uploads/2017/01/27171355/Sample-Software-Design-Document.jpg)

디자인 독을 작성할 때 가장 중요한 것은 아무리 사소한 것일지라도 설계 상 결정사항을 명세할 경우 왜 그런 결정을 했는지에 대한 이유가 근거로서 반드시 뒷받침되어져야 한다는 것이다.

형식은 사실상 정해져 있지 않고 자유로우나, 주로 다음과 같은 순서대로 작성된다.

- Abstract
- Goals / Non-Goals
- Future Works (Optional)
- High Level Design
- Implementation Details
- Known Issues (Optional)
- Design Alternatives (Optional)
- Appendix (Optional)
- Contacts (Optional)

## Abstract

문서를 처음 보거나, 아예 이 프로젝트에 처음 발을 담굴 사람을 생각해 배경지식을 설명하는 공간이다. 왜 이 문서가 기술되어야 하는지를 적는데,
이는 곧 이 프로젝트가 왜 필요한지를 의미한다. 문서만 보고도 대략적인 Overall과 감을 잡을 수 있도록 도와야 한다.
Context & scope 관련된 내용을 추가할 수도, 따로 나눌 수도 있다.

## Goals / Non-Goals

Goals 에는 이 디자인 독이 어떤 목표를 위해 서술되어야 하는지를 적는다. Non-Goals 에는 반대로 목표가 아닌 것들을 적는다.
이는 합리적인 목표가 될 수 있으나, 목표가 되지 않도록 명시적으로 선택된 것이다. 미래에는 고려되어야 할 내용이나, 현재는 모종의 이유로 목표에서 제외되어야 하는 경우 등을 예로 들 수 있다.

## Future works

Optional한 파트다. 미래에 반드시 진행되어야 하나 이 문서의 범위를 벗어나는 작업에 대하여 적는다.

## High Level Design

![](https://online.visual-paradigm.com/repository/images/34b14c69-a7c0-4081-aa4d-b8428c225539.png)

반드시 [System context diagram](https://en.wikipedia.org/wiki/System_context_diagram) 을 추가하자. 현재 프로젝트에 어떠한 모듈들이 있고, 이 문서에서 서술하는 모듈은
어느 위치에 들어가게 되는지에 대한 개략적인 다이어그램이다.

이 섹션 안에서 설명하는 방식은 자유롭다. 주로 다음과 같은 내용들을 서술한다.

- APIs
- Data storage
- Expected workflow

선택적으로 Alternative designs 에 대해서도 서술할 수 있다(이 부분은 항목을 따로 나누어도 좋다).
이 때, 반드시 다른 좋은 대안이 있음에도 현재 디자인이 선택된 이유에 대해 확실한 근거가 뒷받침되어야 한다. 

## Implementation Details

구현 상세에 대하여 서술한다. 여러 구현 단계에 따라 어떻게 구현해야 하는지와, 각 단계에서 신경써야 할 부분들을 적는다.

문서에 따라 개발이 진행됨에 따라 문서를 유지보수 하면서 Known issues 항목이 추가될 수 있다.

