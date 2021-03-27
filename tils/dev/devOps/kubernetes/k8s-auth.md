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
   openssl req -new -key happynut.key -out happynut.csr -subj "\CN=happynut\O=test"
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