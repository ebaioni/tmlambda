import { defaultHeaders } from "./ApiResponseHelper";

const AWS = require("aws-sdk-mock");
const { index } = require("./getEC2SecGroups");
const describeSecurityGroupsSuccessResponse = require("../mock-data/describeSecurityGroupsSuccessResponse");

describe("EC2 Describe Security Groups", () => {
  afterEach(() => {
    AWS.restore();
  });
  test("success", async () => {
    const expectedResponse = {
      statusCode: 200,
      body: JSON.stringify(describeSecurityGroupsSuccessResponse),
      headers: defaultHeaders,
    };
    AWS.mock("EC2", "describeSecurityGroups", function (callback) {
      callback(null, describeSecurityGroupsSuccessResponse);
    });
    await expect(index()).resolves.toMatchObject(expectedResponse);
  });
  test("failure", async () => {
    const expectedResponse = {
      statusCode: 500,
      body: JSON.stringify({ error: "some AWS Error" }),
      headers: defaultHeaders,
    };
    AWS.mock("EC2", "describeSecurityGroups", function (callback) {
      callback({ error: "some AWS Error" });
    });
    await expect(index()).rejects.toMatchObject(expectedResponse);
  });
});
