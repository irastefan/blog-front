import React, { useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';

import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, fetchTags, fetchPostsByTag, fetchPostsOnPage } from '../redux/slices/posts';

import { useParams } from "react-router-dom";

export const Home = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const {posts, tags} = useSelector(state => state.posts);
  let isPostLoading = posts.status === 'loading';
  let isTagsLoading = tags.status === 'loading';

  const { tag, page } = useParams();
  console.log(tag, page, posts)

  useEffect(() => {
    if (tag) {
      dispatch(fetchPostsByTag(tag));
    } else if (page) {
      dispatch(fetchPostsOnPage(page));
    } else {
      dispatch(fetchPosts());
    }
    dispatch(fetchTags());
  }, [tag, page]);

  return (
    <>
      <Tabs style={{ marginBottom: 15 }} value={0} aria-label="basic tabs example">
        <Tab label="New" />
        <Tab label="Popular" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostLoading ? [...Array(5)] : posts.items).map((obj, index) => 
            isPostLoading ? (
              <Post key={index} isLoading={true} />
            ) : (
              <Post
              _id={obj._id}
              key={obj._id}
              title={obj.title} 
              imageUrl={
                obj.imageUrl ? 
                `http://localhost:4444${obj.imageUrl}` : 
                "https://res.cloudinary.com/practicaldev/image/fetch/s--UnAfrEG8--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/icohm5g0axh9wjmu4oc3.png"
              }
              user={obj.user}
              createdAt={obj.createdAt}
              viewsCount={obj.viewsCount}
              commentsCount={3}
              tags={obj.tags} 
              isEditable={userData?._id === obj.user._id}
            />
            )
            
          )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock
            items={[
              {
                user: {
                  fullName: 'FullName',
                  avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
                },
                text: 'desc',
              },
            ]}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};
