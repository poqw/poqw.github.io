# Kubernetes monitoring

![](https://subicura.com/assets/article_images/2019-05-19-kubernetes-basic-1/kubernetes-logo.png)

## DaemonSet

데몬 셋은 ReplicaSet과는 달리, 노드마다 pod가 설치되는 것을 보장한다. 따라서 노드를 모니터링할 때 자주 쓰인다.

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: fluentd-elasticsearch
  namespace: kube-system
  labels:
    k8s-app: fluentd-logging
spec:
  selector:
    matchLabels:
      name: fluentd-elasticsearch
  template:
    metadata:
      labels:
        name: fluentd-elasticsearch
    spec:
      tolerations:
      # this toleration is to have the daemonset runnable on master nodes
      # remove it if your masters can't run pods
      - key: node-role.kubernetes.io/master
        effect: NoSchedule
      containers:
      - name: fluentd-elasticsearch
        image: quay.io/fluentd_elasticsearch/fluentd:v2.5.2
        volumeMounts:
        - name: varlog
          mountPath: /var/log
        - name: varlibdockercontainers
          mountPath: /var/lib/docker/containers
          readOnly: true
      volumes:
      - name: varlog
        hostPath:
          path: /var/log
      - name: varlibdockercontainers
        hostPath:
          path: /var/lib/docker/containers
```

`tolerations` 옵션을 이용하면 일반적으로 Pod가 올라가지 않는 master node에도 `pod`를 올릴 수 있다.
