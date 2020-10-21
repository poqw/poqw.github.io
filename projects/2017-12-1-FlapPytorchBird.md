---
layout: post
title: FlapPytorchBird
featured: true
category: [deep-learning, dqn, flappy-bird, python, visdom, pytorch, my-project]
author: hyungsun
image: assets/images/flapPytorchBird_0.png
timelineText: Reinforcement learning project using DQN
startDate: 2017.11.6
endDate: 2017.12.1
asset_media: https://youtu.be/A68EScjP8-I
asset_caption: 
asset_credit: 
---
  
## Overview
구글 아타리 강화학습 논문을 읽고 비슷한 걸 한 번 만들어 보고 싶은 생각에 [Flappy Bird](http://flappybird.io/){:target="_blank"} 라는 게임을 찾아 강화학습을 시켰던 프로젝트다. 인간 유저들끼리 실력을 겨루는 [랭킹보드](http://flappybird.io/leaderboard/){:target="_blank"}의 최고 점수를 넘는 게 목표였으나, 결과적으로 인간 최고점의 2배에 해당하는 점수를 따냈다([Github 링크](https://github.com/poqw/FlapPytorchBird)).

## Duration
2017.11.6 ~ 2017.12.1

## Development environment
- Language
  - Python
- Library
  - Pytorch, Visdom, Etc.
- Tools
  - PyCharm

## Contribution
내가 이 [프로젝트](https://github.com/poqw/FlapPytorchBird)에 기여한 부분은 다음과 같다.

- ML
  - Research DQN
  - Development DQN network
  - Hyper parameter tuning & reinforcement learning
  - Network backup module
- UI
  - Flappy bird game integration
  - Visualization using visdom

## Result
학습 도중 집에 정전이 나는 바람에 그래프가 둘로 쪼개졌다.
![]({{ site.url }}/assets/images/flapPytorchBird_2.png)
![]({{ site.url }}/assets/images/flapPytorchBird_4.png)

정전으로 인해 `Replay Memory`가 날아갔음에도 불구하고 성과가 좋아서 그대로 학습을 진행시켰다. 학습이 어느 정도 되고 난 이후에는 판당 평균 250점을 돌파했다.

### Demonstration video link
<a href="https://youtu.be/A68EScjP8-I" align="center" target="blank">
  <img src="{{ site.url }}/assets/images/flapPytorchBird_1.png">
</a>
