import React from 'react'
import GlobalLayout from './GlobalLayout'

export const wrapRootElement = ({ element }) => {
  return <GlobalLayout>{element}</GlobalLayout>
}
