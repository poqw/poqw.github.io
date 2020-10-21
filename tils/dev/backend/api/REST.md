# REST

## URI

Restful API의 URI은 spinal-case 를 쓰자. [RFC3986](https://tools.ietf.org/html/rfc3986)의 권고사항이다.

```typescript
router.post('/idtokenlogin', ...) // ✗ avoid
router.post('/google/login/id-token', ...) // ✓ ok
```

### URI 설계

[RFC3986](http://www.ietf.org/rfc/rfc3986)에 따르면 URI은 다음 규칙을 따른다.
```
http://api.example.restapi.org/my-folder/my-doc
HTTP://API.EXAMPLE.RESTAPI.ORG/my-folder/my-doc

위의 두 URI는 같은 URI이다. 호스트에서는 대소문자를 구별하지 않기 때문이다.

http://api.example.restapi.org/my-folder/my-doc
http://api.example.restapi.org/My-Folder/my-doc

하지만 위의 두 URI는 다른 URI이다. 뒤에 붙는 path가 대소문자로 구분되기 때문이다.
```

## Query & Parameter

ㅎㅎ바보같이 Query와 Parameter를 자꾸 헷갈려해서 결국 적는다.

- Parameter: https://myserver.com/projects/{project_id}
- Query: https://myserver.com/projects?project_id={project_id}

Query는 질의하는 느낌이 강하니 `?` 뒤에 붙는다고 이해하면 외우기 쉽겠다.

## Response Code

### 501 Unimplemented

사실 구현이 안된 채로 서버가 배포되는 일은 거의 없지만, 그래도 습관적으로 TODO가 있는 부분에서는 501 error를 내려주는 것이 좋다.
```typescript
export async function login (_googleIdToken: string): Promise<{ ... }> {
  // TODO: Implement this.
  return undefined // ✗ avoid
}

export async function login (_googleIdToken: string): Promise<{ ... }> {
  // TODO: Implement this.
  throw createError('501', 'Not implemented') // ✓ ok
}
``` 
