# Kubernetes auth

![](https://subicura.com/assets/article_images/2019-05-19-kubernetes-basic-1/kubernetes-logo.png)

## TLS 인증서를 활용하여 유저 생성하기

### CA를 이용하여 직접 CSR 승인하기

1. 개인키 생성

   ```bash
   openssl genrsa -out happynut.key 2048
   ```
2. 개인키로 인증서 서명 요청서 만들기

   ```bash
   openssl req -new -key happynut.key -out happynut.csr -subj "/CN=happynut/O=test"
   ```
   csr는 맽 끝의 r이 request로 공개키(자물쇠)를 만들어 달라는 요청서이다.
   CN은 Common Name, O 는 Organization 이다.

3. (인증기관에서) 요청서를 받아오고, 공개키 만들어 주기
   
   요청서 확인하려면:

   ```bash
   openssl req -in happynut.csr -text
   ```
   
   쿠버네티스 CA 를 이용해서 CSR 승인:

   ```bash
   openssl x509 -req -in happynut.csr -CA /etc/kubernetes/pki/ca.crt -CAkey /etc/kubernetes/pki/ca.key -CAcreateserial -out happynut.crt -days 365
   rm -rf happynut.csr # 요청서는 더이상 쓰이지 않기 때문에 삭제
   kubectl config set-credentials happynut --client-certificate=happynut.crt --client-key=happynut.key
   kubectl config set-context happynut@kuebernetes --cluster=kubernetes --user=happynut --namespace=office
   kubectl config use-context happynut@kuebernetes
   ```

## RBAC (Role-based access control)

유저에게 역할을 부여하여 리소스에 대한 엑세스를 관리하는 방법이다. 역할과 관련된 리소스의 종류에는 다음 4가지가 있다.

- [Role](https://kubernetes.io/docs/reference/kubernetes-api/authorization-resources/role-v1/)
- [RoleBinding](https://kubernetes.io/docs/reference/kubernetes-api/authorization-resources/role-binding-v1/)
- [ClusterRole](https://kubernetes.io/docs/reference/kubernetes-api/authorization-resources/cluster-role-v1/)
- [ClusterRoleBinding](https://kubernetes.io/docs/reference/kubernetes-api/authorization-resources/cluster-role-binding-v1/)

Binding으로 끝나는 녀석들은 Role, 혹은 ClusterRole을 유저에게 묶어주는 역할이다. RoleBinding 하나가 둘 다 처리할 수 있도로 안하는 이유는 RoleBinding역시 namespace에 종속되기 때문이다.

Role과 ClusterRole의 차이는 namespace에 종속되는지의 여부다. Role은 namespace에 종속되기 때문에 ClusterRole이 더 막강한
권한을 가지고 있다고 볼 수 있다.

### Role & RoleBinding

아래는 간단한 Role 예제다. Pod를 읽는 역할만 주었다.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: pod-reader
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "watch", "list"]
```

특이하게도 apiGroups 에 `""`를 넣어주고 있는데, 이건 core API 를 의미한다.
apiGroups 목록은 [여기서](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#-strong-api-groups-strong-) 확인이 가능하다.
apiGroups는 뭘 주어야 하는 걸까? 리소스에 넣는 녀석들이 포함된 API 그룹을 찾아서 넣어주면 된다. 예를 들어 `pods`는 core API 안에 있기 때문에 apiGroups에 `""`이 들어가는 것이다. 
그럼 거기에 들어가는 verbs 는 어떻게 확인을 할까? [여기서](https://kubernetes.io/docs/reference/access-authn-authz/authorization/#determine-the-request-verb) 확인이 가능하다.

가장 빠른 방법은, 유저와 namespace를 이용해 직접 허용하고자 하는 커맨드를 날려보는 것이다. 그럼 에러메시지로 어떤 API group에 있는 어떤 리소스에 대한 권한이 없다고
에러가 표시되므로, 그걸 이용해서 위 필드를 세팅할 수 있다.

위의 Role을 유저 happynut에게 묶어주려면 아래처럼 RoleBinding을 만들어준다.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-pods
  namespace: default
subjects:
- kind: User
  name: happynut
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io
```

ClusterRole도 별반 다르지 않으므로 예제는 생략한다. namespace를 따로 지정해주지 않으며, 주로 node 관련된 권한같은 걸 줄 때 사용한다고 이해하면 되겠다.
아래 명령어로 이미 존재하는 ClusterRole에 대한 조회가 가능하다.

```bash
k get clusterrole
```