# Package.json

## Dependencies Version

```typescript
"dependencies": {

    "lerna": "3.16.4"  // 딱 이 버전만 쓰겠다는 이야기
    
    "lerna": "~3.16.4"  // 틸드(tilde): 3.16 버전을 넘어가지만 않으면 됨, 맨 뒷자리는 자동 업데이트

    "lerna": "^3.16.4"  // 캐럿(caret): 3 버전을 넘어가지만 않으면 됨, 나머지 자리는 자동 업데이트
                        // 그러나 0 버전대인 경우에는 틸드처럼 동작한다.
}
```

## Prefix versioning
`~/.yarnrc`에 다음을 추가하여 특정 prefix를 쓰도록 설정할 수 있다.
```bash
save-prefix "~"
```

## Dependencies

Dependencies에는 3가지 종류가 있다.

- dependencies: 나의 모듈과 함께 빌드되어야 하는 의존성들, 내 모듈에서만 사용될 것 같은 의존성들
- peerDependencies: 사용자들에게 일임하고 싶은 의존성들
- devDependencies: 개발단계에서만 필요한 의존성들