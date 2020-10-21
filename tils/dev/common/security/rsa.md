##### RS256 방식으로 private/public key Generation

[RFC7518](https://tools.ietf.org/html/rfc7518#page-8)이 서술한 대로 key 사이즈는 2048보다 같거나 커야 한다.
그러나 2048은 15년 내에 무쓸모해진다고 고려되고 있으므로 4096을 쓰는게 더 낫겠다.

```bash
ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key
openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
```

Javascript 진영에서는 [Jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)라이브러리를 통해 아주 손쉽게
verifyToken/signToken 처리가 가능하다. 다만 RSA를 사용하려면 PEM encoded 되어 있는 secret key를 사용해야 한다는 것에
주의해야 한다.

또, 만약 passphrase 를 입력해주었다면, token verification하는 시점에 해당 passphrase가 필요하므로 웬만하면 편의 상 passphrase를 입력하지 않고 사용하는 게 좋아보인다.
