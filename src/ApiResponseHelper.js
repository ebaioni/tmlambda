/**
 * APIResponseHelper
 */
import { JSON_API_MEDIA_HEADER } from "./JSONAPICompatibilityHelper";

export const defaultHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": "true",
};

export default class ApiResponseHelper {
  /**
   * Returns skeleton for a 500 response
   * @param {Object|String|Array} message
   * @param {boolean} includeJsonAPIHeader
   * @returns {{statusCode: number, body: string, headers: {}}}
   */
  static getServerErrorResponse(message, includeJsonAPIHeader = false) {
    return ApiResponseHelper.getCustomErrorCodeResponse(
      500,
      message || { message: "Internal server error" },
      includeJsonAPIHeader
    );
  }

  /**
   * Returns skeleton for a 200 response
   * @param {Object|String|Array} message
   * @param {boolean} includeJsonAPIHeader
   * @returns {{statusCode: number, body: string, headers: {}}}
   */
  static getOkResponse(message, includeJsonAPIHeader = false) {
    return ApiResponseHelper.getCustomErrorCodeResponse(
      200,
      message || { message: "Ok" },
      includeJsonAPIHeader
    );
  }

  /**
   * @param {number} code
   * @param {Object|String|Array} message
   * @param {boolean} includeJsonAPIHeader
   * @returns {{headers: Object, body: string, statusCode: *}}
   */
  static getCustomErrorCodeResponse(
    code,
    message,
    includeJsonAPIHeader = false
  ) {
    const headers = defaultHeaders;
    if (includeJsonAPIHeader) {
      headers["Content-Type"] = JSON_API_MEDIA_HEADER;
    }
    return {
      statusCode: code,
      body: JSON.stringify(message),
      headers,
    };
  }
}
