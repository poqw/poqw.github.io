# Jest

[Jest](https://jestjs.io/) 는 Javascript testing framework다.

## CLI options

내가 써봤던 CLI 옵션들이다.

- `--runInBand`: 테스트를 돌리는 워커 풀을 생성하지 않고, 현재 프로세스에서 시리얼하게 테스트를 돌린다. 주로 디버깅용으로 쓰인다.
- `--silent`: 콘솔에 덕지 덕지 찍히는 로깅을 막는다.
- `--watch`: 현재 변경사항과 연관된 파일들만 테스트를 돌려준다.
- `--clearCache`: 캐시를 비운다. 가끔 불필요하게 남아있는 캐시 데이터 때문에 테스트가 실패하곤 하는데, 그럴때 쓰면 된다.
- `--color`: 결과를 이쁘게 하이라이팅 해준다.

### Example

캐시를 지우고 싶다면:
```bash
jest --clearCache
```

글로벌하게 깔려있지 않은 상태라면:

```bash
node_modules/jest/bin/jest.js --clearCache
```
