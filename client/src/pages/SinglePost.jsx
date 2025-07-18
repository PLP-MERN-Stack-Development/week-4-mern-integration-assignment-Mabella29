import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchSinglePost } from '../services/api';
import { Box, Typography, Button } from '@mui/material';

export default function SinglePost() {
  const [post, setPost] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const getPost = async () => {
      try {
        const { data } = await fetchSinglePost(id);
        setPost(data);
      } catch (err) {
        console.error('Failed to fetch post:', err);
      }
    };
    getPost();
  }, [id]);

  if (!post) return <div>Loading...</div>;

  return (
    <Box>
      <Typography variant="h3">{post.title}</Typography>
      <Typography variant="subtitle1">Category: {post.category?.name}</Typography>
      <Typography paragraph>{post.content}</Typography>
      <Button component={Link} to={`/edit/${post._id}`} variant="contained">
        Edit Post
      </Button>
    </Box>
  );
}