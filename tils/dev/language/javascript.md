# Javascript

## Tips

undefined인 key-value pair는 stringify 하면 사라진다.

```javascript
a = { 'a' : 1, 'b': undefined }

JSON.stringify(a) // { 'a': 1 }
```