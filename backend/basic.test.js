const request = require("supertest");
const express = require("express");

const app = express();
const token = "";

describe("GET /account/:accountId", function () {
  it("should return a test acc", function (done) {
    request(app)
      .get("/account/12345")
      .set("Authorization", "Bearer " + token)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, done)
      .then((response) => {
        expect(response.body.accountId).toEqual("12345");
      });
  });
});
