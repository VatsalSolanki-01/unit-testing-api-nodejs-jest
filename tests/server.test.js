const app = require("../server");
const Post = require("../models/Post");
const mongoose = require("mongoose");
const supertest = require("supertest");

jest.setTimeout(30000); // increase timeout for slower Docker environment

const MONGO_URL = process.env.MONGO_URL || "mongodb://mongodb:27017/JestDB";

beforeAll(async () => {
  let connected = false;
  for (let i = 0; i < 10 && !connected; i++) {
    try {
      await mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      connected = true;
    } catch (err) {
      console.log("Waiting for MongoDB to be ready...");
      await new Promise((res) => setTimeout(res, 3000));
    }
  }

  if (!connected) throw new Error("Failed to connect to MongoDB");
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

test("POST /api/posts", async () => {
  const data = { title: "Post 1", content: "Lorem ipsum" };

  const response = await supertest(app).post("/api/posts").send(data).expect(200);

  expect(response.body.title).toBe(data.title);
  expect(response.body.content).toBe(data.content);
});

test("GET /api/posts", async () => {
  await Post.create({ title: "Post 1", content: "Lorem ipsum" });

  const response = await supertest(app).get("/api/posts").expect(200);
  expect(Array.isArray(response.body)).toBeTruthy();
  expect(response.body.length).toBeGreaterThan(0);
});
