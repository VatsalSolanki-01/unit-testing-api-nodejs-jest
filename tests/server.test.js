const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../server");
const Post = require("../models/Post");

const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/JestDB";

jest.setTimeout(60000); // Increase Jest timeout to 60 seconds

beforeAll(async () => {
  // Try connecting to MongoDB with retries
  const maxRetries = 10;
  let connected = false;

  for (let i = 0; i < maxRetries; i++) {
    try {
      await mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
      });
      console.log("✅ Connected to MongoDB for tests");
      connected = true;
      break;
    } catch (err) {
      console.log(`❌ Mongo not ready (attempt ${i + 1}/${maxRetries}) — retrying in 5s`);
      await new Promise((res) => setTimeout(res, 5000));
    }
  }

  if (!connected) {
    throw new Error("Failed to connect to MongoDB after multiple attempts");
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  }
});

beforeEach(async () => {
  if (mongoose.connection.readyState === 1) {
    await Post.deleteMany({});
  }
});

test("GET /api/posts", async () => {
  const post = await Post.create({ title: "Post 1", content: "Lorem ipsum" });

  const response = await supertest(app).get("/api/posts").expect(200);

  expect(Array.isArray(response.body)).toBeTruthy();
  expect(response.body.length).toBe(1);
  expect(response.body[0].title).toBe(post.title);
  expect(response.body[0].content).toBe(post.content);
});

test("POST /api/posts", async () => {
  const data = { title: "Post 2", content: "Dolor sit amet" };

  const response = await supertest(app)
    .post("/api/posts")
    .send(data)
    .expect(200);

  expect(response.body._id).toBeTruthy();
  expect(response.body.title).toBe(data.title);
  expect(response.body.content).toBe(data.content);

  const post = await Post.findById(response.body._id);
  expect(post).toBeTruthy();
  expect(post.title).toBe(data.title);
  expect(post.content).toBe(data.content);
});

test("PATCH /api/posts/:id", async () => {
  const post = await Post.create({ title: "Old", content: "Old content" });

  const update = { title: "Updated", content: "Updated content" };

  const response = await supertest(app)
    .patch(`/api/posts/${post._id}`)
    .send(update)
    .expect(200);

  expect(response.body.title).toBe(update.title);
  expect(response.body.content).toBe(update.content);

  const updatedPost = await Post.findById(post._id);
  expect(updatedPost.title).toBe(update.title);
});

test("DELETE /api/posts/:id", async () => {
  const post = await Post.create({ title: "To Delete", content: "Remove me" });

  await supertest(app).delete(`/api/posts/${post._id}`).expect(200);

  const found = await Post.findById(post._id);
  expect(found).toBeNull();
});
