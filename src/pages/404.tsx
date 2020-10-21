import { RouteComponentProps } from '@reach/router'
import { navigate } from 'gatsby'
import React, { useEffect } from 'react'

const NotFoundPage: React.FC<RouteComponentProps> = () => {
  useEffect(() => {
    const redirect = async (): Promise<void> => await navigate('/')

    redirect()
  })

  return null
}

export default NotFoundPage
