# Kubernetes scheduling

![](https://subicura.com/assets/article_images/2019-05-19-kubernetes-basic-1/kubernetes-logo.png)

## 수동 Scheduling

Deployment를 이용하면 알아서 리소스에 맞게 노드마다 Pod 를 적절하게 배치해준다. 하지만 특정 노드에 GPU를 비싼 걸 달았고,
머신러닝과 관련된 서비스를 해당 노드에다가 적재하고 싶다면 어쩔 수 없이 수동 스케쥴링을 해야하는 경우가 있다.

하는 방법은 별로 어렵지 않다. 

* `nodeName`을 이용하는 경우

   Pod 설정할 떄, `spec.nodeName` 에다가 원하는 노드의 이름을 적으면 된다.
  
* Label을 이용하는 경우

  아래와 같이 노드에다가 라벨링을 할 수 있는데,
  
  ```bash
  k label node {node name} gpu=true
  ```
  
  확인은 다음 명령어로 한다.
  
  ```bash
  k get nodes --show-labels -L gpu
  ```

  `spec.nodeSelector` 에다가 `gpu: "true"` 를 입력하면 라벨링이 된 노드에 배치된다.

## HPA(Horizontal Pod Autoscaler)

HPA는 포드 자체를 복제하여 처리할 수 있는 Pod의 개수를 늘리는 방법이다. 이와는 대비되게 VPA(Vertical Pod Autoscaler)도 있는데,
리소스의 양을 증가시켜서 Pod의 사용가능한 리소스를 늘리는 방법이다.

Autoscale 이라는 건 `replaicas` 를 직접 손보면서 스케일링을 할 필요가 없다는 뜻이다. 대신 `HorizontalPodAutoscaler`를
선언해야 한다.

```yaml
apiVersion: autoscaling/v2beta2
kind: HorizontalPodAutoscaler
metadata:
  name: php-apache
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: php-apache
  minReplicas: 1
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 50
```

`scaleTargetRef`로 모니터링할 타깃을 설정한다.

yaml 로 만들지 않고, 아래 명령어로도 가능하다.

```bash
kubectl autoscale deployment php-apache --cpu-percent=50 --min=1 --max=10
```

확인은 다음 명령어를 통해 한다.

```
+ kubectl get hpa
NAME         REFERENCE               TARGETS   MINPODS   MAXPODS   REPLICAS   AGE
php-apache   Deployment/php-apache   0%/50%    1         10        1          4m20s
```