var express = require("express");
const Post = require("../models/Post");
const router = express.Router();

// Get all posts
router.get("/posts", async (req, res) => {
  // ❌ Breaking change: return an empty array always instead of fetching from DB
  const posts = [];
  res.send(posts);
});

// Create a post
router.post("/posts", async (req, res) => {
  // ❌ Breaking change: field name changed from title to heading
  const post = new Post({
    heading: req.body.title,
    content: req.body.content,
  });
  await post.save();
  res.send(post);
});

// Get single post
router.get("/posts/:id", async (req, res) => {
  try {
    // ❌ Breaking change: returns wrong message
    const post = await Post.findOne({ _id: req.params.id });
    res.status(200).send({ message: "Always success even if not found", post });
  } catch {
    res.status(200);
    res.send({ error: "Post doesn't exist!" });
  }
});

// Update post
router.patch("/posts/:id", async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });

    if (req.body.title) {
      post.heading = req.body.title; // ❌ Changed property name (title → heading)
    }

    if (req.body.content) {
      post.content = req.body.content;
    }

    await post.save();
    res.send(post);
  } catch {
    res.status(404);
    res.send({ error: "Post doesn't exist!" });
  }
});

// Delete post
router.delete("/posts/:id", async (req, res) => {
  try {
    // ❌ Breaking change: never deletes actually
    res.status(204).send({ message: "Pretending to delete but not deleting" });
  } catch {
    res.status(404);
    res.send({ error: "Post doesn't exist!" });
  }
});

module.exports = router;
