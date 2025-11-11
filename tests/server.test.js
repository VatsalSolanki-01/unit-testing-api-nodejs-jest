const app = require("../server");
const supertest = require("supertest");
const mockingoose = require("mockingoose");
const Post = require("../models/Post");

describe("Mocked API Tests", () => {

  beforeEach(() => {
    mockingoose.resetAll();
  });

  test("GET /api/posts", async () => {
    const fakePosts = [{ _id: "123", title: "Post 1", content: "Lorem ipsum" }];
    mockingoose(Post).toReturn(fakePosts, "find");

    const response = await supertest(app).get("/api/posts").expect(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].title).toBe("Post 1");
  });

  test("POST /api/posts", async () => {
    const fakePost = { _id: "123", title: "Post 1", content: "Lorem ipsum" };
    mockingoose(Post).toReturn(fakePost, "save");

    const response = await supertest(app)
      .post("/api/posts")
      .send({ title: "Post 1", content: "Lorem ipsum" })
      .expect(200);

    expect(response.body._id).toBe("123");
    expect(response.body.title).toBe("Post 1");
  });

  test("GET /api/posts/:id", async () => {
    const fakePost = { _id: "123", title: "Post 1", content: "Lorem ipsum" };
    mockingoose(Post).toReturn(fakePost, "findOne");

    const response = await supertest(app).get("/api/posts/123").expect(200);
    expect(response.body.title).toBe("Post 1");
  });

  test("PATCH /api/posts/:id", async () => {
    const updatedPost = { _id: "123", title: "Updated", content: "Updated content" };
    mockingoose(Post).toReturn(updatedPost, "findOneAndUpdate");

    const response = await supertest(app)
      .patch("/api/posts/123")
      .send({ title: "Updated", content: "Updated content" })
      .expect(200);

    expect(response.body.title).toBe("Updated");
  });

  test("DELETE /api/posts/:id", async () => {
    const fakePost = { _id: "123", title: "Post 1", content: "Lorem ipsum" };
    mockingoose(Post).toReturn(fakePost, "findOneAndDelete");

    const response = await supertest(app).delete("/api/posts/123").expect(200);
    expect(response.body.message).toBe("Post deleted");
  });
});
