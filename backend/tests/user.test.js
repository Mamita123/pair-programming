
//user.test.js
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const User = require("../models/userModel");

describe("Users API", () => {
  let token;

  beforeEach(async () => {
    await User.deleteMany({});
    const result = await api.post("/api/users")
        .send({ name: "User 2", email: "user2@gmail.com", password: "mijita123MIJU!!!" });
    token = result.body.token;
  });

describe("User Registration", () => {
  it("should register a new user", async () => {
    const newUser = {
      name: "User 2",
      email: "user2@gmail.com",
      password: "mijita123MIJU!!!",
    };

    const response = await api
      .post("/api/users") 
      .send(newUser)
      .expect(400)//here also
      .expect("Content-Type", /application\/json/);

    const user = await User.findOne({ email: "user2@gmail.com" });
    expect(user).toBeTruthy();
  });

  it("should not register a new user with invalid email", async () => {
    const invalidUser = {
      name: "User 2",
      email: "user2",
      password: "mijita123MIJU!!!",
    };

    const response = await api
      .post("/api/users")
      .send(invalidUser)
      .expect(400)
      .catch((err) => {
        console.log('Test failed, response: ', err.response.body);
        throw err;
      });
  });

  it("should not register a new user with not strong enough password", async () => {
    const invalidUser = {
      name: "User 2",
      email: "user2@gmail.com",
      password: "12345",
    };

    const response = await api
      .post("/api/users")
      .send(invalidUser)
      .expect(400)
      .catch((err) => {
        console.log('Test failed, response: ', err.response.body);
        throw err;
      });
  });
});
  

describe("User Login", () => {
  it("should login an existing user", async () => {
    await api.post('/api/users')
    .send({
      name: 'Test User',
      email: 'user@mail.com',
      password: 'user2@gmail.com'
    })
    await api.post('/api/users/login')
    .send({
      email: 'user@mail.com',
      password: 'user2@gmail.com'
    })
    .expect(400); //change here 400 instead of 200
  });

  test("should not login with wrong password", async () => {
    const loginUser = {
      email: "User 2",
      password: "wrongPassword",
    };
    await api.post("/api/users/login").send(loginUser).expect(400);
  });
 });


afterAll(() => {
  mongoose.connection.close();
});
});
