/* eslint-disable @typescript-eslint/explicit-function-return-type */

import React from 'react'

export const onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    // TimelineJS: There is no npm package supported for this lib.
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
}
