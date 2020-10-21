import { Router } from '@reach/router'
import { withPrefix } from 'gatsby-link'
import React from 'react'

import PostPage from '../../app/pages/PostPage'
import { SidebarStoreProvider } from '../../app/store/sidebarStore'
import NotFoundPage from '../404'

const App: React.FC = () => (
  <SidebarStoreProvider>
    <Router basepath={withPrefix('/posts')}>
      <PostPage path="/:postName" />
      <NotFoundPage default />
    </Router>
  </SidebarStoreProvider>
)

export default App
