import "regenerator-runtime/runtime";
// aws-sdk will be available in the cloud
// eslint-disable-next-line import/no-extraneous-dependencies
import AWS from "aws-sdk";
import ApiResponseHelper from "./ApiResponseHelper";
import JSONAPICompatibilityHelper from "./JSONAPICompatibilityHelper";

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

module.exports.indexJSONApi = async (event) => {
  const ec2 = new AWS.EC2();
  return new Promise((resolve, reject) => {
    if (!JSONAPICompatibilityHelper.isValidContentTypeHeader(event.headers)) {
      const response = JSONAPICompatibilityHelper.formatError(
        1,
        "Unsupported Media Type",
        null,
        415
      );

      reject(ApiResponseHelper.getCustomErrorCodeResponse(415, response, true));
      return;
    }
    if (!JSONAPICompatibilityHelper.isValidAcceptHeader(event.headers)) {
      const response = JSONAPICompatibilityHelper.formatError(
        2,
        "Not Acceptable",
        null,
        406
      );
      reject(ApiResponseHelper.getCustomErrorCodeResponse(406, response, true));
      return;
    }
    ec2
      .describeSecurityGroups()
      .promise()
      .then((secGroups) => {
        const smallSubset = secGroups.SecurityGroups.map((sg) => {
          return {
            groupName: sg.GroupName,
            groupDescription: sg.Description,
            groupId: sg.GroupId,
          };
        });
        const jsonCompatible = {
          data: [],
          meta: {
            count: smallSubset.length,
          },
        };
        smallSubset.forEach((sg) => {
          const tmp = {
            type: "securityGroups",
            id: sg.groupId,
            attributes: {
              groupName: sg.groupName,
              groupDescription: sg.groupDescription,
              groupId: sg.groupId,
            },
          };
          jsonCompatible.data.push(tmp);
        });
        console.log(JSON.stringify(jsonCompatible, null, 2));

        const response = ApiResponseHelper.getOkResponse(jsonCompatible, true);
        resolve(response);
      })
      .catch((e) => {
        const response = ApiResponseHelper.getServerErrorResponse(
          JSONAPICompatibilityHelper.formatError(
            3,
            "getEc2SecGroup error",
            e.toString(),
            500
          ),
          true
        );
        reject(response);
      });
  });
};
