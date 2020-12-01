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

### 삽질 기록

아래 함수 `givenK8sClientListDeploymentsRejected` 에서 `mockRejectedValueOnce` 가 `Error`를 resolve 하는 경우
결과적으로 mocked function이 에러를 뱉었으므로(성공적으로 실행되었다 볼 수 없으므로) `called` function에 잡히지 않는다.

따라서 `Error` 외의 타입을 리턴해 주어야 테스트가 통과한다.

```typescript
function givenK8sClientListDeploymentsRejected (): void {
  k8sClient.listDeployments.mockRejectedValueOnce('List k8s pods error!')
}

function expectK8sClientListDeploymentsCalled (request: ListDeploymentsRequest): void {
  expect(k8sClient.listDeployments).toHaveBeenCalledWith(request)
}

it('rejects and logs error when listing deployments rejected', async () => {
    givenK8sClientListDeploymentsRejected()

    await expect(uut.get())
      .toReject()
    expectK8sClientListDeploymentsCalled({ namespace: NAMESPACE })
    expect(logger.error)
      .toHaveBeenCalled()
  })
```

