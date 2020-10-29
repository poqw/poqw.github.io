import { Router } from '@reach/router'
import { withPrefix } from 'gatsby-link'
import React from 'react'

import MainPage from '../app/pages/MainPage'
import NotFoundPage from './404'

const App: React.FC = () => (
  <Router>
    <MainPage path={withPrefix('/')} />
    <NotFoundPage default />
  </Router>
)

export default App
