import { Request } from "../../framework/request";
import { expect } from "chai";
import * as faker from "faker";

describe("User", function() {
  it("Receiving information about user by Token should be successful", async function() {
    // Generating random email
    const email = faker.internet.email(undefined, undefined, "ukr.net");

    // Register new user
    let respUser = await new Request(
      "http://ip-5236.sunline.net.ua:30020/users/register"
    )
      .method("POST")
      .body({
        username: email,
        email: email,
        password: "123456"
      })
      .send();

    // Get information about New logged-in user with his auth token
    let userLoggedInResp = await new Request(
      "http://ip-5236.sunline.net.ua:30020/api/user"
    )
      .headers({
        Authorization: `Bearer ${respUser.body.token}`
      })
      .send();

    expect(userLoggedInResp.body, JSON.stringify(userLoggedInResp.body))
      .to.be.an("object")
      .to.include.keys("username");

    expect(
      typeof userLoggedInResp.body._id,
      userLoggedInResp.body._id
    ).to.not.equal("number");
  });

  it("Receiving information about user by Id should be successful", async function() {
    // Generating random email
    const email = faker.internet.email(undefined, undefined, "ukr.net");

    // log in Admin
    let respAdmin = await new Request(
      "http://ip-5236.sunline.net.ua:30020/users/login"
    )
      .method("POST")
      .body({
        email: "Kaelyn.Adams44@ukr.net",
        password: "123456"
      })
      .send();

    // Register new user
    let respUser = await new Request(
      "http://ip-5236.sunline.net.ua:30020/users/register"
    )
      .method("POST")
      .body({
        username: email,
        email: email,
        password: "123456"
      })
      .send();

    // Get detail info about New user
    let userInfo = await new Request(
      `http://ip-5236.sunline.net.ua:30020/api/users/${respUser.body.id}`
    )
      .auth(respAdmin.body.token)
      .send();

    expect(userInfo.body, JSON.stringify(userInfo.body))
      .to.be.an("object")
      .to.include.keys("_id", "profile");

    expect(typeof userInfo.body._id, userInfo.body._id).to.not.equal("number");
  });

  it("Receiving information about all users should be successful", async function() {
    // log in Admin
    let respAdmin = await new Request(
      "http://ip-5236.sunline.net.ua:30020/users/login"
    )
      .method("POST")
      .body({
        email: "Kaelyn.Adams44@ukr.net",
        password: "123456"
      })
      .send();

    // Get info about all users
    let userList = await new Request(
      `http://ip-5236.sunline.net.ua:30020/api/users`
    )
      .auth(respAdmin.body.token)
      .send();

    expect(userList.body, JSON.stringify(userList.body)).to.be.an("array");

    expect(userList.body[0], JSON.stringify(userList.body[0])).to.include.keys(
      "_id",
      "username"
    );

    expect(userList.body[0], userList.body[0]).to.not.include.keys(
      "token"
    );
  });

  it("Deleting user by id should be successful", async function() {
    // Generating random email
    const email = faker.internet.email(undefined, undefined, "ukr.net");

    // log in Admin
    let respAdmin = await new Request(
      "http://ip-5236.sunline.net.ua:30020/users/login"
    )
      .method("POST")
      .body({
        email: "Kaelyn.Adams44@ukr.net",
        password: "123456"
      })
      .send();

    // Register new user
    let respUser = await new Request(
      "http://ip-5236.sunline.net.ua:30020/users/register"
    )
      .method("POST")
      .body({
        username: email,
        email: email,
        password: "123456"
      })
      .send();

    // Delete New user
    let deletedUserId = await new Request(
      `http://ip-5236.sunline.net.ua:30020/api/users/${respUser.body.id}`
    )
      .method("DELETE")
      .auth(respAdmin.body.token)
      .send();

    expect(deletedUserId.body, JSON.stringify(deletedUserId.body)).to.be.an(
      "object"
    );

    expect(deletedUserId.body._id, deletedUserId.body._id).to.equal(
      respUser.body.id
    );

    expect(deletedUserId.body._id, deletedUserId.body._id).to.not.equal(
      respAdmin.body.id
    );
  });
});
