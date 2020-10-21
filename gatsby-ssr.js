import React from 'react'

export const onRenderBody = ({ setHeadComponents, setPreBodyComponents, setPostBodyComponents }) => {
  setHeadComponents([
    <link
      key="timeline-css"
      title="timeline-styles"
      rel="stylesheet"
      href="https://cdn.knightlab.com/libs/timeline3/latest/css/timeline.css"
    />,
    <script
      key="timeline"
      src="https://cdn.knightlab.com/libs/timeline3/latest/js/timeline.js"
      type="text/javascript"
      async
    />
  ])
  // setPreBodyComponents([
  //   <script
  //     key="timeline"
  //     src="https://cdn.knightlab.com/libs/timeline3/latest/js/timeline.js"
  //     type="text/javascript"
  //     async
  //   />
  // ])
  // setPostBodyComponents([
  //   <script
  //     key="timeline"
  //     src="https://cdn.knightlab.com/libs/timeline3/latest/js/timeline.js"
  //     type="text/javascript"
  //     async
  //   />
  // ])
}
