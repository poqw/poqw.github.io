import { RouteComponentProps } from '@reach/router'
import { navigate } from 'gatsby'
import _ from 'lodash'
import React, { useMemo } from 'react'

import SEO from '../../components/atoms/SEO'
import Post, { PostProps } from '../../components/organisms/Post'
import { useAllPosts } from '../../hooks/useAllPosts'
import PostTemplate from './template'

interface Props extends RouteComponentProps {
  postName?: string
}

const PostPage: React.FC<Props> = ({ postName }) => {
  const allPosts = useAllPosts()
  const currentPost: PostProps = useMemo(() => {
    const post = _.find(allPosts, { name: postName })
    if (_.isNil(post)) {
      navigate('/')
    }

    return _.find(allPosts, { name: postName })
  }, [allPosts, postName])

  return (
    <PostTemplate>
      <SEO title={currentPost.name} />
      { currentPost &&
        <Post {...currentPost} />
      }
    </PostTemplate>
  )
}

export default PostPage
