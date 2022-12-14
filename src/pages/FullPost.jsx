import React, { useState } from "react";
import ReactMarkdown from 'react-markdown';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {okaidia} from 'react-syntax-highlighter/dist/esm/styles/prism';

import { useParams } from "react-router-dom";
import axios from "../axios";
import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";

export const FullPost = () => {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const { id } = useParams();
  
  React.useEffect(() => {
    axios.get(`/post/${id}`)
      .then(
          res => {
            setData(res.data);
            setLoading(false);
          }
      )
      .catch(
        err => console.warn(err)
      );
  } ,[id]);

  if (isLoading) 
    return <Post isLoading={isLoading} isFullPost />

  return (
    <>
      <Post
        id={data._id}
        title={data.title} 
        imageUrl={
          data.imageUrl ? `http://localhost:4444${data.imageUrl}` : ""
        }
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={3}
        tags={data.tags}
        isFullPost
      >
        <ReactMarkdown
          children={data.text}
          components={{
            code({node, inline, className, children, ...props}) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <SyntaxHighlighter
                  children={String(children).replace(/\n$/, '')}
                  style={okaidia}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                />
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            }
          }}
        />
      </Post>
      <CommentsBlock
        items={[
          {
            user: {
              fullName: "???????? ????????????",
              avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
            },
            text: "?????? ???????????????? ?????????????????????? 555555",
          },
          {
            user: {
              fullName: "???????? ????????????",
              avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
            },
            text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
          },
        ]}
        isLoading={false}
      >
        <Index />
      </CommentsBlock>
    </>
  );
};
