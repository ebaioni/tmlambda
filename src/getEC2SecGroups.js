import "regenerator-runtime/runtime";
// aws-sdk will be available in the cloud
// eslint-disable-next-line import/no-extraneous-dependencies
import AWS from "aws-sdk";
import ApiResponseHelper from "./ApiResponseHelper";
import JSONAPICompatibilityHelper from "./JSONAPICompatibilityHelper";
import securityGroupsSchema from "./schemas/SecurityGroups/securityGroupsSchema";
import ipPermissionsSchema from "./schemas/SecurityGroups/ipPermissionsSchema";
import ipPermissionsEgressSchema from "./schemas/SecurityGroups/ipPermissionsEgressSchema";
import tagSchema from "./schemas/SecurityGroups/tagSchema";

const JSONAPISerializer = require("json-api-serializer");

/**
 * Entry point for NON JSON-API-Compatible call
 * @returns {Promise<>}
 */
module.exports.index = async () => {
  const ec2 = new AWS.EC2();
  return new Promise((resolve) => {
    ec2
      .describeSecurityGroups()
      .promise()
      .then((secGroups) => {
        const response = ApiResponseHelper.getOkResponse(secGroups);
        resolve(response);
      })
      .catch((e) => {
        const response = ApiResponseHelper.getServerErrorResponse(e);
        resolve(response);
      });
  });
};
/**
 * Entry point for JSON-API-Compatible call
 * @returns {Promise<>}
 */
module.exports.indexJSONApi = async (event) => {
  const ec2 = new AWS.EC2();
  const Serializer = new JSONAPISerializer();
  return new Promise((resolve) => {
    const errorInHeader = JSONAPICompatibilityHelper.errorsInHeaders(
      event.headers
    );
    if (errorInHeader) {
      console.log(JSON.stringify(errorInHeader, null, 2));
      resolve(
        ApiResponseHelper.getCustomErrorCodeResponse(
          parseInt(errorInHeader.errors[0].status, 10),
          errorInHeader,
          true
        )
      );
      return;
    }
    ec2
      .describeSecurityGroups()
      .promise()
      .then((secGroups) => {
        Serializer.register("securityGroups", securityGroupsSchema);
        // Register 'tag' type
        Serializer.register("ipPermissions", ipPermissionsSchema);
        Serializer.register("ipPermissionsEgress", ipPermissionsEgressSchema);
        Serializer.register("tag", tagSchema);
        const serialisedData = Serializer.serialize(
          "securityGroups",
          secGroups.SecurityGroups
        );

        const response = ApiResponseHelper.getOkResponse(serialisedData, true);
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
        resolve(response);
      });
  });
};
