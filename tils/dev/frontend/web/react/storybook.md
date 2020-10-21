# React Storybook

[Storybook](https://storybook.js.org/)은 내가 개발한 컴포넌트를 브라우저에서 딱 그 컴포넌트만 랜더링 시켜서 테스트 해볼 수 있게 해주는 무척 잘만든 툴이다.
Storybook코드는 UI의 테스트코드라고 보아도 무방하므로, TDD를 하는 중이라면 `MyComponent.stories.tsx`를 만들고 그 후에 `MyComponent.tsx`를 만드어 test가 나를 운전하도록 할 수도 있겠다.

Atomic design으로 리엑트 개발할 때 뿐만이 아니더라도 매우 유용하지만, Atomic design이 더해지면 더욱 빛을 발하는 것 같다.
특히 디자이너 진영과 유비쿼터스 랭귀지 싱크업을 한 이후라면 컴포넌트 네이밍틍 통일시켜 의사소통이 훨씬 수월해지므로 더욱 그렇다.

> 일정이 빡빡하더라도 스토리북만 따로 내부적으로 배포하여 디자이너와 피드백을 주고받도록 하자. 이건 정말 멋진 경험이었다.

## CSF format

스토리북을 작성할 때는 CSF 포맷을 따른다. 이게 가장 최신가이드에서 추천하는 방식이다.
([Component Story Format](https://storybook.js.org/docs/formats/component-story-format/))

아래와 같이 `storiesOf` API를 통하지 않고 `export default`를 사용한다. 

```tsx
export default {
  title: 'Molecule/ProjectList', // 스토리북 사이드바에 Molcules 밑에 ProjectList가 생긴다!
  component: ProjectCard
}

export const Basic = (): React.ReactNode => (
  <ProjectList
    projects={
      [
        {
          projectId: '1',
          title: '프로젝트 예제'
        }
      ]
    }
  />
)

```

## Addons

Storybook은 여러 [Addons](https://storybook.js.org/addons/) 들을 붙일 수 있다.

## Decorator

Decorator를 제대로 내려주지 않아 삽질한 적이 있다. Decorator는 쉽게 말해 컴포넌트 랜더링 하기 전에 감싸주는 Wrapper다.

만약 내가 Provider / Context 패턴을 사용 중이라면 스토리북 데코레티어로 잘 감싸지 않을 경우 에러를 만날 수도 있다.

아래와 같이 `.storybook/config.tsx` 에 전역적으로 데코레이터를 붙일 수도 있고,

```tsx
addDecorator(story => (<GlobalProvider>{story()}</GlobalProvider>))
```

또 아래와 같이 특정 컴포넌트에만 국소적으로 데코레이터를 붙일 수도 있다.

```tsx
export default {
  component: ProjectDetailSummaryPage,
  title: 'Page/ProjectDetailSummaryPage'
}

const createPath = (projectType: ProjectType): string =>
  `/console/${projectType}-project/my-projectId`

const SpeechMemoryRouter: React.ReactNode = (story: Function) => (
  <Router history={createMemoryHistory({ initialEntries: [createPath(ProjectType.Speech)] })}>
    <Route component={() => story()} path={`/console/${ProjectType.Speech}-project/:projectId`} />
  </Router>
)
export const SpeechSummaryPage = (): React.ReactNode => <ProjectDetailSummaryPage />
SpeechSummaryPage.story = {
  name: 'For speech projects',
  decorators: [SpeechMemoryRouter]
}

const ChatbotMemoryRouter: React.ReactNode = (story: Function) => (
  <Router history={createMemoryHistory({ initialEntries: [createPath(ProjectType.Chatbot)] })}>
    <Route component={() => story()} path={`/console/${ProjectType.Chatbot}-project/:projectId`} />
  </Router>
)
export const Chatbot = (): React.ReactNode => <ProjectDetailSummaryPage />
Chatbot.story = {
  name: 'For chatbot projects',
  decorators: [ChatbotMemoryRouter]
}
```

위 코드는 특정 라우팅 패스로 컴포넌트를 랜더링 시켰을 때 각각의 차이를 보여주기 위해서 데코레이터를 활용한 것이다.
