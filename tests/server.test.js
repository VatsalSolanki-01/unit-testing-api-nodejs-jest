const app = require("../server");
const supertest = require("supertest");
const mockingoose = require("mockingoose");
const Post = require("../models/Post");

describe("Mocked API Tests", () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  test("GET /api/posts", async () => {
    const mockPosts = [{ _id: "507f1f77bcf86cd799439011", title: "Post 1", content: "Lorem ipsum" }];

    mockingoose(Post).toReturn(mockPosts, "find");

    const response = await supertest(app).get("/api/posts").expect(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0].title).toBe("Post 1");
  });

  test("POST /api/posts", async () => {
    const data = { title: "New Post", content: "Hello world" };
    const mockPost = { _id: "507f1f77bcf86cd799439012", ...data };

    mockingoose(Post).toReturn(mockPost, "save");

    const response = await supertest(app).post("/api/posts").send(data).expect(200);
    expect(response.body.title).toBe(data.title);
    expect(response.body.content).toBe(data.content);
  });
});
