import { Router } from '@reach/router'
import { withPrefix } from 'gatsby-link'
import React from 'react'

import TilPage from '../../app/pages/TilPage'
import { SidebarStoreProvider } from '../../app/store/sidebarStore'
import NotFoundPage from '../404'

const App: React.FC = () => (
  <SidebarStoreProvider>
    <Router basepath={withPrefix('/til')}>
      <TilPage path="/:postName" />
      <NotFoundPage default />
    </Router>
  </SidebarStoreProvider>
)

export default App
