# Learning test

![](https://s31450.pcdn.co/wp-content/uploads/2015/09/test-taking.151008.jpg)

말 그대로 학습을 위한 테스트다. 주로 서드파티 라이브러리를 테스트 & 학습을 해보려고 할 때 작성하게 된다.
Learning test는 다음 3가지 장점을 가진다는 점에서 의미가 있다.

- 프로덕션 코드에 곧바로 테스트해보기 부담스러워 새로운 테스트 워크스페이스를 만드는 것보다 학습이 더 빠르다.
게다가 새로이 만들었던 테스트 워크스페이스는 관리를 안하거나 느슨해져 녹슬기 일쑤다.
- 테스트 대상 코드 & 라이브러리의 버전이 변경되었을 경우 인터페이스 변경을 쉽게 감지할 수 있다.
- 테스트 대상 코드 & 라이브러리를 처음 써보는 다른 개발자에게 좋은 학습자료가 된다.

## 작성 예시

다음은 `@kubernetes/client-node`를 테스트하기 위해 내가 직접 작성했던 코드다.

```typescript
import { AppsV1Api, CoreV1Api, KubeConfig } from '@kubernetes/client-node'
import config from 'config'

import { K8sClientTestHelper } from '../support/k8s'

const KUBE_CONTEXT = config.get<string>('k8s.context')

describe('@kubernetes/client-node', () => {
  const NAMESPACE = 'client-node-learning-test-namespace'
  const kubeConfig = new KubeConfig()

  let coreV1Api: CoreV1Api

  beforeAll(async () => {
    kubeConfig.loadFromDefault()
    kubeConfig.setCurrentContext(KUBE_CONTEXT)
    coreV1Api = kubeConfig.makeApiClient(CoreV1Api)
    await coreV1Api.createNamespace({
      metadata: {
        name: NAMESPACE
      }
    })

    // NOTE: Wait for creating API token of the newly created service account in `NAMESPACE`.
    await new Promise((resolve) => setTimeout(resolve, 1000))
  })

  afterAll(async () => {
    // NOTE: Clean up whole resources in the namespace.
    await coreV1Api.deleteNamespace(NAMESPACE)
  })

  describe('Core V1 API', () => {
    const VERSION = 'test-v1'

    let uut: CoreV1Api

    beforeEach(() => {
      uut = kubeConfig.makeApiClient(CoreV1Api)
    })

    it('creates namespaced pod', async () => {
      const podName = 'test-pod'
      const pod = K8sClientTestHelper.createV1Pod({
        name: podName,
        version: VERSION,
        namespace: NAMESPACE
      })

      const result = await uut.createNamespacedPod(NAMESPACE, pod)

      expect(result.body?.metadata?.name).toBe(podName)
    })

    it('lists pods with namespace and labels', async () => {
      const podName = 'test-pod-2'
      const pod = K8sClientTestHelper.createV1Pod({
        name: podName,
        version: VERSION,
        namespace: NAMESPACE
      })
      await uut.createNamespacedPod(NAMESPACE, pod)

      const result = await uut.listNamespacedPod(
        NAMESPACE,
        'true',
        undefined,
        undefined,
        undefined,
        `app=${podName},version=${VERSION}`
      )
      expect(result.body?.items[0]?.metadata?.name).toBe(podName)
    })
  })

  describe('Apps V1 API', () => {
    const VERSION = 'test-v1'

    let uut: AppsV1Api

    beforeEach(() => {
      uut = kubeConfig.makeApiClient(AppsV1Api)
    })

    it('creates namespaced deployment', async () => {
      const deploymentName = 'test-deployment'
      const deployment = K8sClientTestHelper.createV1Deployment({
        name: deploymentName,
        version: VERSION,
        namespace: NAMESPACE
      })

      const result = await uut.createNamespacedDeployment(NAMESPACE, deployment)

      expect(result.body?.metadata?.name).toBe(deploymentName)
    })

    it('lists deployments with namespace and labels', async () => {
      const deploymentName = 'test-deployment-2'
      const deployment = K8sClientTestHelper.createV1Deployment({
        name: deploymentName,
        version: VERSION,
        namespace: NAMESPACE
      })
      await uut.createNamespacedDeployment(NAMESPACE, deployment)

      const result = await uut.listNamespacedDeployment(
        NAMESPACE,
        'true',
        undefined,
        undefined,
        undefined,
        `app=${deploymentName},version=${VERSION}`
      )
      expect(result.body?.items[0]?.metadata?.name).toBe(deploymentName)
    })
  })
})

```