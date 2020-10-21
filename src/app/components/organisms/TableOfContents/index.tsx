import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import makeStyles from '@material-ui/core/styles/makeStyles'
import _ from 'lodash'
import React from 'react'

const useStyles = makeStyles((theme) => ({
  root: {
    borderLeft: `4px solid ${theme.palette._green[300]}`
  },
  link: {
    textDecoration: 'none',
    color: theme.palette._dark[500]
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

  const renderNestedToc = (tocItems, depth = 1): React.ReactNode => {
    return _.map(tocItems, (item: TableOfContents) => {
      if (_.isEmpty(item.items)) {
        return (
          <a className={classes.link} href={item.url} key={item.url}>
            <Box pl={depth * 2}>
              <Typography variant="caption">{item.title}</Typography>
            </Box>
          </a>
        )
      }

      return (
        <>
          <a className={classes.link} href={item.url} key={item.url}>
            <Box pl={depth * 2}>
              <Typography variant="caption">{item.title}</Typography>
            </Box>
          </a>
          {renderNestedToc(item.items, depth + 1)}
        </>
      )
    })
  }

  return (
    <>
      <Typography variant="body2">목차</Typography>
      <Box mt={1} className={classes.root}>
        {renderNestedToc(tableOfContent.items)}
      </Box>
    </>
  )
}

export default TableOfContents
