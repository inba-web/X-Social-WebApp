import React, { useEffect } from 'react'
import Post from '../common/Post'
import PostSkeleton from '../skeletons/PostSkeleton'
import { useQuery } from '@tanstack/react-query'
import { fetchWithAuth } from '../../utils/api'

const Posts = ({ feedType, username, userId }) => {

  const getPostEndPoint = () => {
    switch (feedType) {
      case "forYou":
        return `api/posts/all`;
      case "following":
        return `api/posts/following`;
      case "posts":
        return `api/posts/user/${username}`;
      case "likes":
        return `api/posts/likes/${userId}`;
      default:
        return `api/posts/all`;
    }
  }

  const POST_ENDPOINT = getPostEndPoint();

  const { data: posts, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await fetchWithAuth(POST_ENDPOINT, {
        method: "GET"
      })
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      return data;
    }
  });

  useEffect(() => {
    refetch();
  }, [feedType, refetch])


  return (
    <>
      {
        (isLoading || isRefetching) && (
          <div className='flex flex-col justify-center'>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </div>
        )
      }
      {!isLoading && posts.length === 0 && <p className='my-4 text-center'>No posts in this tab</p>}
      {!isLoading && posts && (
        <div>
          {
            posts.map((post) => <Post key={post._id} post={post} />)
          }
        </div>
      )}
    </>
  )
}

export default Posts