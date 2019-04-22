import * as faker from "faker";
import * as chai from "chai";
import { Users } from "../../framework2/service/controllers/users_controller";
import { Request } from "../../framework/request";
chai.use(require("chai-json-schema-ajv"));

const expect = chai.expect;

const boardSchema = require('../../raml/boardSchema.json');
const swimlaneSchema = require('../../raml/swimlaneSchema.json');
const cardSchema = require('../../raml/cardSchema.json');
const cardsDetailsSchema = require('../../raml/cardsDetailsSchema.json');


describe("Board", function () {
    it("Creating new board should be successful", async function () {

        const loggedInModel = await new Users().login(
            "sasha.lz@ukr.net",
            "123456"
        );

        // Generating random board name
        const boardName = faker.name.jobTitle();

        let respBoard = await new Request(
            "http://ip-5236.sunline.net.ua:30020/api/boards"
        )
            .method("POST")
            .auth(loggedInModel.token)
            .body({
                "title": `Board ${boardName}`,
                "owner": loggedInModel.id
            })
            .send();

        expect(respBoard.body).to.be.jsonSchema(boardSchema);
    });


    it("Creating new swimlane should be successful", async function () {

        const loggedInModel = await new Users().login(
            "sasha.lz@ukr.net",
            "123456"
        );

        // Generating random board name
        const boardName = faker.name.jobTitle();

        let respBoard = await new Request(
            "http://ip-5236.sunline.net.ua:30020/api/boards"
        )
            .method("POST")
            .auth(loggedInModel.token)
            .body({
                "title": `Test ${boardName}`,
                "owner": loggedInModel.id
            })
            .send();

        // Generating random swimlane name
        const swimlaneName = faker.name.jobTitle();

        let respSwimlane = await new Request(
            `http://ip-5236.sunline.net.ua:30020/api/boards/${respBoard.body._id}/swimlanes`
        )
            .method("POST")
            .auth(loggedInModel.token)
            .body({
                "title": swimlaneName
            })
            .send();

        expect(respSwimlane.body).to.be.jsonSchema(swimlaneSchema);
    });

    it("Creating new card in list board swimlane should be successful", async function () {

        const loggedInModel = await new Users().login(
            "sasha.lz@ukr.net",
            "123456"
        );

        // Generating random board name
        const boardName = faker.name.jobTitle();

        let respBoard = await new Request(
            "http://ip-5236.sunline.net.ua:30020/api/boards"
        )
            .method("POST")
            .auth(loggedInModel.token)
            .body({
                "title": `Test card ${boardName}`,
                "owner": loggedInModel.id
            })
            .send();

        // Generating random swimlane name
        const swimlaneName = faker.name.jobTitle();

        let respSwimlane = await new Request(
            `http://ip-5236.sunline.net.ua:30020/api/boards/${respBoard.body._id}/swimlanes`
        )
            .method("POST")
            .auth(loggedInModel.token)
            .body({
                "title": swimlaneName
            })
            .send();

        let respCard = await new Request(
            `http://ip-5236.sunline.net.ua:30020/api/boards/${respBoard.body._id}/lists/${respSwimlane.body._id}/cards`
        )
            .method("POST")
            .auth(loggedInModel.token)
            .body({
                "title": "Card title text",
                "description": "Card description",
                "authorId": loggedInModel.id,
                "swimlaneId": respSwimlane.body._id
            })
            .send();

        expect(respSwimlane.body).to.be.jsonSchema(cardSchema);
    });

    it("Retrieve cards by swimlane id should be successful", async function () {

        const loggedInModel = await new Users().login(
            "sasha.lz@ukr.net",
            "123456"
        );

        // Generating random board name
        const boardName = faker.name.jobTitle();

        let respBoard = await new Request(
            "http://ip-5236.sunline.net.ua:30020/api/boards"
        )
            .method("POST")
            .auth(loggedInModel.token)
            .body({
                "title": `Board: ${boardName}`,
                "owner": loggedInModel.id
            })
            .send();

        // Generating random swimlane name
        const swimlaneName = faker.name.jobTitle();

        let respSwimlane = await new Request(
            `http://ip-5236.sunline.net.ua:30020/api/boards/${respBoard.body._id}/swimlanes`
        )
            .method("POST")
            .auth(loggedInModel.token)
            .body({
                "title": swimlaneName
            })
            .send();

        let respCard = await new Request(
            `http://ip-5236.sunline.net.ua:30020/api/boards/${respBoard.body._id}/lists/${respSwimlane.body._id}/cards`
        )
            .method("POST")
            .auth(loggedInModel.token)
            .body({
                "title": "Card title text",
                "description": "Card description",
                "authorId": loggedInModel.id,
                "swimlaneId": respSwimlane.body._id
            })
            .send();


        let cardsDetails = await new Request(
            `http://ip-5236.sunline.net.ua:30020/api/boards/${respBoard.body._id}/swimlanes/${respSwimlane.body._id}/cards`
        )
            .method("GET")
            .auth(loggedInModel.token)
            .send();

        expect(cardsDetails.body).to.be.jsonSchema(cardsDetailsSchema);
    });
});