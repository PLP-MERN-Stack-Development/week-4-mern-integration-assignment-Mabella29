import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSinglePost, createPost, updatePost, fetchCategories } from '../services/api';
import { Box, TextField, Button, Select, MenuItem, Typography } from '@mui/material';

export default function PostForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        const { data: cats } = await fetchCategories();
        setCategories(cats);

        if (id) {
          const { data: post } = await fetchSinglePost(id);
          setTitle(post.title);
          setContent(post.content);
          setCategory(post.category?._id || '');
        }
      } catch (err) {
        console.error('Failed to load data:', err);
      }
    };
    getData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postData = { title, content, category };

    try {
      if (id) {
        await updatePost(id, postData);
      } else {
        await createPost(postData);
      }
      navigate('/');
    } catch (err) {
      console.error('Failed to save post:', err);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h5">{id ? 'Edit' : 'Create'} Post</Typography>
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        fullWidth
        multiline
        rows={4}
        margin="normal"
        required
      />
      <Select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        fullWidth
        displayEmpty
        margin="dense"
      >
        <MenuItem value="">Select Category</MenuItem>
        {categories.map(cat => (
          <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
        ))}
      </Select>
      <Button type="submit" variant="contained" sx={{ mt: 2 }}>
        {id ? 'Update' : 'Create'} Post
      </Button>
    </Box>
  );
}