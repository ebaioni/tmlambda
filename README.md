# tmlambda  
  
## Project Structure
The project comprises of multiple folders:

 - **coverage**: it contains the code coverage report
 - **e2e-test**: it contains postman collections that should be run by the CI/CD pipeline 
 - **local-invoke**: it contains the payloads to run lambda functions locally via `sls invoke local` command
 - **mock-data**: it contains the mock data for unit tests
 - **scripts**: it contains useful scripts such a pre-push hook so that tests & lint are run on the local machine before being pushed remotely.
	 - *postinstall.sh* automatically replaces the githook/pre-push file after node modules are installed
 - **src**: it contains the source code
 - **lib** (not versioned): this is where babel will compile the files into

## How to run the project locally 
Run the following commands:

 - `git clone git@github.com:ebaioni/tmlambda.git`
 - `cd tmlambda`
 - `npm install`
 - `npm run build`

In order to run the  getEC2SecGroups function:

 - `sls invoke local -f getEC2SecGroups`

Authorizer:

 - `sls invoke local -f customAuthorizer -p local-invoke/authorizerSuccess.json`
 - `sls invoke local -f customAuthorizer -p local-invoke/authorizerFailure.json`

Remote Invoker

 - `curl "https://3zgq358hrg.execute-api.ap-southeast-2.amazonaws.com/staging/ec2/secgroups?allow=yes"`
 - `curl "https://3zgq358hrg.execute-api.ap-southeast-2.amazonaws.com/staging/ec2/secgroups?allow=no"`

## How to run tests
- `npm run test` <- will run jest unit tests
- `npm run e2e:staging` <- will run e2e tests. **Note** the should be run by the CI/CD pipeline after the code is deployed, otherwise we would be testing that the old code. I put it in here for a lack of alternative

## Comments & possible improvements
- Authorizer: 
    - Generally we would rather authenticate via header instead of a querystring. I assumed the point of the exercise was to show that is was possible to secure the endpoint and I chose a query parameter which should make it easier for you to verify the correctness.
    - An alternate solution would be to have a login/authorization endpoint that returns temporary AWS credentials (so that scope and permissions can be as granular as IAM allows) and ask the client(s) the sign the requests before calling any endpoint which would require AWS_IAM authentication 
    - Unless very specific to this microservice, I would suggest authoriser to be in a different repo.
- ApiResponseHelper:
    - this class help formatting the response in a way that is processable by APIGW. To avoid repeating this class across different microservices, it should be moved into its own package (for example a private npm package) and pulled in by various microservices or added to a shared lambda layer
- General CORS Headers:
    - When developing a API we need to keep into consideration where it is going to be called from. Browsers automatically block requests that do not satisfy CORS restrictions. 
    Depending on where the API is called from, we could replace the generic * with the whitelisted domain
- In the serverless file you'll find few options that are not explicity required in the test but help the general ongoing maintenance of the API such as enabling X-RAY tracing, rotate the logs after 30days  
- A pre-push hook (with some ASCII art) is included. This helps making sure that there are no lint errors and no unit tests failing before pushing the code remotely. This does NOT mean that the CI should not run when a PR is opened, but it aims to not push code that we already know it is not up to standard
    - To see it in action, make a small change, then commit and push.
- Postman was used for e2e tests and the following cases have been taken into account
    - Test on appropriate response code
    - Test on appropriate response headers
    - Test on api response time. This could fail when the request requires a lambda cold start.
    - Both for success and failure responses, the payload is verified against a JSON schema so that consistency is ensured.

## Project Requirements
- Create a Serverless application. ✅
    - More info: https://serverless.com/framework/docs/providers/aws/events/apigateway#configuring-endpoint-types
- Create a Lambda to list all EC2 security groups in an AWS Account. ✅
- Make the Lambda function available via an AWS API Gateway endpoint. ✅
- Write unit tests for your code by mocking AWS EC2 API. ✅
    - Hint: You can use the aws-sdk-mock npm module
- Produce a code coverage report for your test suite. ✅
- Secure the endpoint using a custom API Gateway Lambda Authoriser. ✅
    - More info: https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html
- Write an end-to-end API test for the endpoint. ✅
- Make response JSON:API 1.0 (https://jsonapi.org/format/1.0/) compatible. [Pending]
