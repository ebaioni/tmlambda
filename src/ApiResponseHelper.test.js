import ApiResponseHelper from "./ApiResponseHelper";

describe("ApiResponseHelper - response format", () => {
  test("200 - with response body", async () => {
    const testData = ["test"];
    const expectedResponse = {
      statusCode: 200,
      body: JSON.stringify(testData),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
      },
    };
    expect(ApiResponseHelper.getOkResponse(testData)).toMatchObject(
      expectedResponse
    );
  });
  test("200 - with default response body", async () => {
    const expectedResponse = {
      statusCode: 200,
      body: JSON.stringify({ message: "Ok" }),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
      },
    };
    expect(ApiResponseHelper.getOkResponse()).toMatchObject(expectedResponse);
  });
  test("500 - with response body", async () => {
    const testData = ["test"];
    const expectedResponse = {
      statusCode: 500,
      body: JSON.stringify(testData),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
      },
    };
    expect(ApiResponseHelper.getServerErrorResponse(testData)).toMatchObject(
      expectedResponse
    );
  });
  test("500 - with default response body", async () => {
    const expectedResponse = {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
      },
    };
    expect(ApiResponseHelper.getServerErrorResponse()).toMatchObject(
      expectedResponse
    );
  });
});
