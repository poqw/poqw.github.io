import Box from '@material-ui/core/Box'
import React from 'react'

import { TilHeaderContentProps } from './TilHeaderContentProps'

const TilHeaderDesktop: React.FC<TilHeaderContentProps> = () => {
  // TODO(poqw): Introduce search bar in the Box.
  return (
    <Box height={80} />
  )
}

export default TilHeaderDesktop
