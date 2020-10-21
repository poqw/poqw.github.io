# JWT(Json Web Token)

## JWT 특징

JWT는 토큰에 포함된 내용들이 암호화되지 않아서 **누구나 확인** 할 수 있다. 이게 가장 중요한 특징이다(JWS인 경우만 해당).

따라서 아무나 믿고 싶지 않은 우리들은 메시지가 신뢰할 수 있는 녀석으로부터 왔다는 것을 보장받기 위해 서명을 해야하고, 또 받아내야 한다.

## Signature

서명 방식에는 대칭키 방식(e.g. HS256)과 비대칭키 방식(e.g. RS256)이 있다.

대칭키 방식은 client와의 직접적인 통신에서 사용되고, 비대칭키 방식은 API나 3rd party client와의 통신에서 주로 사용된다.

### 대칭키 방식

대칭키 방식이라는 것은 키를 하나를 두고 둘이서 대칭되는 똑같은 키를 사용한다는 뜻이다.

키가 같다는 말은 수신자도 같은 키로 서명할 수 있다는 의미도 되며, 따라서 네트워크 상에 돌아다니는 토큰을 붙잡았을 때 우리는 수신자/송신자 중 누가 서명한 건지 알 수 없다.

#### HS256 (HMAC with SHA-256)

대칭키를 사전에 공유해야 한다는 게 특징이고, 미리 공유해서 알고 있는 주체들만 유효성 검증이 가능하다.

### 비대칭키 방식

비대칭키 방식이라는 것은 쌍방의 키가 비대칭하므로 서로 다른 키를 사용한다는 뜻이다. 서명은 반드시 개인키로만 이루어진다.

#### RS256 (RSA Signature with SHA-256)

개인키로 암호화를 해서 서명해고, 공개키를 가진 모든 주체들은 받은 토큰을 공개키로 verification하여 신뢰할 수 있는 녀석으로부터 온 것이라는 걸 알 수 있다. 

공개키는 말 그대로 공개되는 키인데, 보통 공개하는 방식으로 JWK 방식을 많이 사용한다. **공개키로는 토큰 서명이 불가능하다.**
이 과정에서 일반적으로 Private key는 단 하나의 서버만 가지고 있고, public key는 한 개 혹은, 여러 서버가 가진다.
이 때, 클라이언트는 token verification를 해야할 의무를 가지지 않으므로 public key를 보유할 필요가 없다. 

RSA는 계산량이 많기 때문에, 성능 면에서 HS256에 비해 손해를 본다.

##### [JWK](https://tools.ietf.org/html/rfc7517)

JWK(Json Web Key)는 JWT의 키에 대한 정보를 담고 있는 URL을 외부에 공개하여 원한다면 어느 누구나 공개키를 얻을 수 있도록 하는 방법이다.
(표준은 공개 방법에 대한 표준이 아니고, 만약 어떻게든 키를 공개하고 싶다면 이런 식으로 표현해라와 관련된 표준이다)

즉, [JWK 안에 있는 필드](https://tools.ietf.org/html/rfc7517#section-4)를 짜집기 하면 공개키를 얻어낼 수 있게끔 해놓았다.
한 가지 특이한 점은 키 교체 가능성을 염두에 두고 설계되었기 때문인지 json object 하나에 여러 개의 key를 담을 array를 선언하도록 해놓았다.
이렇게 여러 개 들어 있는 키를 `JWKs`혹은 `JWKS`(JWK set) 라고 일반적으로 표현한다.

보안을 위해 기존에 사용하던 키를 주기적으로 폐기해야 한다면 JWK를 사용해야 하겠다. 

## JWT, JWK, JWS, JWE, JWA

헷갈림 5형제를 모셔봤다. 각 약자와 뜻을 알아보자.

- JWT: [Json Web Token](https://tools.ietf.org/html/rfc7519)
    양방 통신을 위해 사용되는 토큰이다. JWS 나 JWE 의 형태로 표현된다.
- JWK: [Json Web Key](https://tools.ietf.org/html/rfc7517)
    Json으로 키를 표현한 것을 말한다. JWT의 공개키를 공개할때 쓰인다.
- JWS: [Json Web Signature](https://tools.ietf.org/html/rfc7515)
    서명(Signing)된 JWT다.
- JWE: [Json Web Encryption](https://tools.ietf.org/html/rfc7516)
    암호화(Encrypt)된 JWT다. 제 3자에게 데이터가 노출되지 않도록 한다.
- JWA: [Json Web Algorithm](https://tools.ietf.org/html/rfc7518)
    JWE, JWS, JWK 에서 사용될 알고리즘을 나타낸다.
