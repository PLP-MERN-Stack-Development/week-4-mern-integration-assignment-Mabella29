const express = require("express");
const Post = require("../models/Post");
const router = express.Router();
const { postSchema } = require("../utils/validation");

// GET all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("category");
    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err.message);
    res.status(500).json({ message: "Server error fetching posts" });
  }
});

// SEARCH posts by title or content
router.get("/search", async (req, res) => {
  try {
    const query = req.query.q || "";
    const posts = await Post.find({
      $or: [
        { title: new RegExp(query, "i") },
        { content: new RegExp(query, "i") }
      ]
    }).populate("category");

    res.json(posts);
  } catch (err) {
    console.error("Error searching posts:", err.message);
    res.status(500).json({ message: "Server error searching posts" });
  }
});

// GET single post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("category");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    console.error("Error fetching post:", err.message);
    res.status(500).json({ message: "Server error fetching post" });
  }
});

// CREATE a post
router.post("/", async (req, res) => {
  const { error } = postSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const newPost = new Post({
      title: req.body.title,
      content: req.body.content,
      category: req.body.category || null,
      comments: [] // Start with no comments
    });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    console.error("Error creating post:", err.message);
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid category ID" });
    }
    res.status(500).json({ message: "Server error creating post" });
  }
});

// UPDATE a post
router.put("/:id", async (req, res) => {
  const { error } = postSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        content: req.body.content,
        category: req.body.category || null
      },
      { new: true }
    ).populate("category");

    if (!updatedPost) return res.status(404).json({ message: "Post not found" });
    res.json(updatedPost);
  } catch (err) {
    console.error("Error updating post:", err.message);
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid post or category ID" });
    }
    res.status(500).json({ message: "Server error updating post" });
  }
});

// DELETE a post
router.delete("/:id", async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) return res.status(404).json({ message: "Post not found" });
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err.message);
    res.status(500).json({ message: "Server error deleting post" });
  }
});

// ADD a comment to a post
router.post("/:id/comments", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = {
      author: req.body.author || "Anonymous",
      text: req.body.text || ""
    };

    post.comments.push(comment);
    await post.save();

    res.status(201).json(post);
  } catch (err) {
    console.error("Error adding comment:", err.message);
    res.status(500).json({ message: "Server error adding comment" });
  }
});

module.exports = router;
