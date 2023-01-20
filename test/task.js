/* eslint-disable no-undef */
let app = require("../server");
let chai = require("chai");
let chaiHttp = require("chai-http");

// Assertion
chai.should();
chai.use(chaiHttp);
describe("Task APIs", () => {
  describe("Test POST route user/signup", () => {
    it("Create new user", (done) => {
      const task = {
        name: "task",
        email: "test@yopmail.com",
        password: "12345",
      };
      chai
        .request(app)
        .post("user/signup")
        .send(task)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property("name")
          res.body.should.have.property("email")
          done();
          console.log(err)
        });
    });
  });

  describe("Test POST route user/login", () => {
    it("login User", (done) => {
      const loginRequest = {
        email: "test@yopmail.com",
        password: "12345",
      };
      chai
        .request(app)
        .post("user/login")
        .send(loginRequest)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property("name")
          res.body.should.have.property("email")
          done();
          console.log(err)
        });
    });
  });
});
