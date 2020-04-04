import "regenerator-runtime/runtime";

// Help function to generate an IAM policy
const generatePolicy = function (principalId, effect, resource) {
  // Required output:
  const authResponse = {};
  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument = {};
    policyDocument.Version = "2012-10-17"; // default version
    policyDocument.Statement = [];
    const statementOne = {};
    statementOne.Action = "execute-api:Invoke"; // default action
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
};

const generateAllow = function (principalId, resource) {
  return generatePolicy(principalId, "Allow", resource);
};

module.exports.index = function (event, context, callback) {
  console.log("Received event:", JSON.stringify(event, null, 2));

  // A simple request-based authorizer example to demonstrate how to use request
  // parameters to allow or deny a request. In this example, a request is
  // authorized if the client-supplied HeaderAuth1 header, QueryString1
  // query parameter, and stage variable of StageVar1 all match
  // specified values of 'headerValue1', 'queryValue1', and 'stageValue1',
  // respectively.

  // Retrieve request parameters from the Lambda function input:
  const { queryStringParameters, methodArn } = event;
  // Parse the input for the parameter values
  if (queryStringParameters.allow === "yes") {
    callback(null, generateAllow("me", methodArn));
  } else {
    callback("Unauthorized");
  }
};
