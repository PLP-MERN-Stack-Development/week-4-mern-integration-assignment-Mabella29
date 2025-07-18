import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchPosts, deletePost } from '../services/api';
import { Box, List, ListItem, Button, Typography } from '@mui/material';

export default function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const { data } = await fetchPosts();
        setPosts(data);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
      }
    };
    getPosts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deletePost(id);
      setPosts(posts.filter(post => post._id !== id));
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Blog Posts</Typography>
      <Button component={Link} to="/create" variant="contained">
        Create New Post
      </Button>
      <List>
        {posts.map(post => (
          <ListItem key={post._id}>
            <Link to={`/posts/${post._id}`}>{post.title}</Link>
            <Button onClick={() => handleDelete(post._id)}>Delete</Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}