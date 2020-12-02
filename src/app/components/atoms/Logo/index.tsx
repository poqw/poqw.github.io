import Box, { BoxProps } from '@material-ui/core/Box'
import { Link } from 'gatsby'
import React from 'react'

import LogoIcon from '../../../../../assets/images/logo.svg'

interface Props extends BoxProps {
  to?: string
}

const Logo: React.FC<Props> = ({ to, ...boxProps }) => (
  <Box {...boxProps}>
    {to &&
      <Link to="/">
        <LogoIcon />
      </Link>
    }
    {!to &&
      <LogoIcon />
    }
  </Box>
)

export default Logo
