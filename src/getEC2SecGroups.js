import "regenerator-runtime/runtime";
// aws-sdk will be available in the cloud
// eslint-disable-next-line import/no-extraneous-dependencies
import AWS from "aws-sdk";
import ApiResponseHelper from "./ApiResponseHelper";

module.exports.index = async () => {
  const ec2 = new AWS.EC2();
  return new Promise((resolve, reject) => {
    ec2
      .describeSecurityGroups()
      .promise()
      .then((secGroups) => {
        const response = ApiResponseHelper.getOkResponse(secGroups);
        resolve(response);
      })
      .catch((e) => {
        const response = ApiResponseHelper.getServerErrorResponse(e);
        reject(response);
      });
  });
};
