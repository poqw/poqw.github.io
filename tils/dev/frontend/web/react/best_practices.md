# Best practices
이 글에서는 React로 개발을 할 때 익혀두면 좋을 best practices에 대해 정리한다.

## Rest props
Rest props는 앞에 있는 props를 덮어 쓸 요량이 아니라면 앞에 배치하는 게 좋다.

```typescript jsx
// ✗ avoid
<MainBenefitSectionColumn
  {...benefit}
  descriptionAlignment={descriptionAlignment}
  titleAlignment={titleAlignment}
/>
 
// ✓ ok
<MainBenefitSectionColumn
  descriptionAlignment={descriptionAlignment}
  titleAlignment={titleAlignment}
  {...benefit}
/>
```
