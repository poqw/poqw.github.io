# Tips

![](https://subicura.com/assets/article_images/2019-05-19-kubernetes-basic-1/kubernetes-logo.png)

## dry-run

새로 프로젝트를 시작하는 경우 `yaml` 파일을 구글링을 통해 일일이 찾아다녀야 하는 불편함이 있는데, `dry-run`을 이용해서
k8s가 템플릿을 만들어 버리도록 할 수 있다. `dry-run`은 실제로는 영향을 주는 건 없으면서도 해당 명령어가 동작하는지만
검사하는 옵션이다.

예를 들어 이름이 `office`인 네임스페이스를 만들기 위해 다음과 같이 명령어를 실행시켰다고 하자.

```bash
k create ns office --dry-run=client -o yaml
```

실행 결과는 다음과 같다.
```yaml
apiVersion: v1
kind: Namespace
metadata:
  creationTimestamp: null
  name: office
spec: {}
status: {}
```

redirect 시켜서 파일에 써주기만 하면 템플릿을 얻게 된다.

```bash
k create ns office --dry-run=client -o yaml > office2-ns.yaml
```
