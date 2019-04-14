import * as request from "request-promise-native";
import { expect } from "chai";
import * as faker from "faker";

describe("User", function() {

  it("Receiving information about user by Token should be successful", async function() {
    // Generating random email
    const email = faker.internet.email(undefined, undefined, "ukr.net");

    // Register new user
    let respUser = await request.post(
      "http://ip-5236.sunline.net.ua:30020/users/register",
      {
        json: true,
        body: {
          username: email,
          email: email,
          password: "123456"
        }
      }
    );

    // Get information about New logged-in user with his auth token
    let userLoggedInResp = await request.get(
      "http://ip-5236.sunline.net.ua:30020/api/user",
      {
        json: true,
        headers: {
          Authorization: `Bearer ${respUser.token}`
        }
      }
    );

    expect(userLoggedInResp, JSON.stringify(userLoggedInResp))
      .to.be.an("object")
      .to.include.keys("username");

    expect(typeof userLoggedInResp._id, userLoggedInResp._id).to.not.equal(
      "number"
    );
  });

  it("Receiving information about user by Id should be successful", async function() {
    // Generating random email
    const email = faker.internet.email(undefined, undefined, "ukr.net");

    // log in Admin
    let respAdmin = await request.post(
      "http://ip-5236.sunline.net.ua:30020/users/login",
      {
        json: true,
        body: {
          email: "Kaelyn.Adams44@ukr.net",
          password: "123456"
        }
      }
    );

    // Register new user
    let respUser = await request.post(
      "http://ip-5236.sunline.net.ua:30020/users/register",
      {
        json: true,
        body: {
          username: email,
          email: email,
          password: "123456"
        }
      }
    );

    // Get detail info about New user
    let userInfo = await request.get(
      `http://ip-5236.sunline.net.ua:30020/api/users/${respUser.id}`,
      {
        json: true,
        headers: {
          Authorization: `Bearer ${respAdmin.token}`
        }
      }
    );

    expect(userInfo, JSON.stringify(userInfo))
      .to.be.an("object")
      .to.include.keys("_id", "profile");

    expect(typeof userInfo._id, userInfo._id).to.not.equal("number");
  });

  it("Receiving information about all users should be successful", async function() {
    // log in Admin
    let respAdmin = await request.post(
      "http://ip-5236.sunline.net.ua:30020/users/login",
      {
        json: true,
        body: {
          email: "Kaelyn.Adams44@ukr.net",
          password: "123456"
        }
      }
    );

    // Get info about all users
    let userList = await request.get(
      `http://ip-5236.sunline.net.ua:30020/api/users`,
      {
        json: true,
        headers: {
          Authorization: `Bearer ${respAdmin.token}`
        }
      }
    );

    expect(userList, JSON.stringify(userList)).to.be.an("array");

    expect(userList[0], JSON.stringify(userList[0])).to.include.keys(
      "_id",
      "username"
    );

    expect(typeof userList[0], userList[0]).to.not.include.keys("token");
  });

  it("Deleting user by id should be successful", async function() {
    // Generating random email
    const email = faker.internet.email(undefined, undefined, "ukr.net");

    // log in Admin
    let respAdmin = await request.post(
      "http://ip-5236.sunline.net.ua:30020/users/login",
      {
        json: true,
        body: {
          email: "Kaelyn.Adams44@ukr.net",
          password: "123456"
        }
      }
    );

    // Register new user
    let respUser = await request.post(
      "http://ip-5236.sunline.net.ua:30020/users/register",
      {
        json: true,
        body: {
          username: email,
          email: email,
          password: "123456"
        }
      }
    );

    // Delete New user
    let deletedUserId = await request.del(
      `http://ip-5236.sunline.net.ua:30020/api/users/${respUser.id}`,
      {
        json: true,
        headers: {
          Authorization: `Bearer ${respAdmin.token}`
        }
      }
    );

    expect(deletedUserId, JSON.stringify(deletedUserId)).to.be.an("object");

    expect(deletedUserId._id, deletedUserId._id).to.equal(respUser.id);

    expect(deletedUserId._id, deletedUserId._id).to.not.equal(respAdmin.id);
  });
});
