import "regenerator-runtime/runtime";
// aws-sdk will be available in the cloud
// eslint-disable-next-line import/no-extraneous-dependencies
import AWS from "aws-sdk";
import ApiResponseHelper from "../ApiResponseHelper";

const getSecGroupMultiPage = (ec2, nextToken = null, results = []) => {
  const params = {
    MaxResults: 10,
  };
  if (nextToken) {
    params.NextToken = nextToken;
  }
  return ec2
    .describeSecurityGroups(params)
    .promise()
    .then((data) => {
      const consolidatedResult = [...results, ...data.SecurityGroups];
      if (data.NextToken) {
        return getSecGroupMultiPage(ec2, data.NextToken, consolidatedResult);
      }
      return consolidatedResult;
    })
    .catch((e) => {
      console.error(e);
      return [];
    });
};

module.exports.index = (event, context, callback) => {
  const ec2 = new AWS.EC2();
  getSecGroupMultiPage(ec2)
    .then((secGroups) => {
      const response = ApiResponseHelper.getOkResponse(secGroups);
      callback(null, response);
    })
    .catch((e) => {
      console.log("error", e);
      const response = ApiResponseHelper.getServerErrorResponse(e);
      callback(null, response);
    });
};
