import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import makeStyles from '@material-ui/core/styles/makeStyles'
import _ from 'lodash'
import React from 'react'

const useStyles = makeStyles((theme) => ({
  root: {
    maxHeight: 800,
    overflowY: 'auto',
    color: 'gray',
    '&::-webkit-scrollbar': {
      width: 0
    }
  },
  link: {
    textDecoration: 'none',
    color: theme.palette._dark[200],
    '& :hover': {
      fontWeight: 'bold'
    }
  },
  title: {
    fontSize: '11px'
  }
}))

interface TableOfContents {
  url: string
  title: string
  items?: TableOfContents[]
}

export interface TableOfContentsProps {
  items: TableOfContents
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ items }) => {
  const classes = useStyles()
  const tableOfContent = items[0]
  if (_.isEmpty(tableOfContent.items)) {
    return null
  }

  const renderNestedToc = (tocItems, depth = 1): React.ReactNode => {
    return _.map(tocItems, (item: TableOfContents) => {
      if (_.isEmpty(item.items)) {
        return (
          <a className={classes.link} href={item.url} key={item.url}>
            <Box pl={depth}>
              <Typography variant="caption" className={classes.title}>{item.title}</Typography>
            </Box>
          </a>
        )
      }

      return (
        <div key={item.url}>
          <a className={classes.link} href={item.url}>
            <Box pl={depth}>
              <Typography variant="caption" className={classes.title}>{item.title}</Typography>
            </Box>
          </a>
          {renderNestedToc(item.items, depth + 1)}
        </div>
      )
    })
  }

  return (
    <Box className={classes.root}>
      <Typography variant="body2">목차</Typography>
      <Box mt={1}>
        {renderNestedToc(tableOfContent.items)}
      </Box>
    </Box>
  )
}

export default TableOfContents
