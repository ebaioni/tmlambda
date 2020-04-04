/**
 * APIResponseHelper
 */
export const defaultHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": "true",
};

export default class ApiResponseHelper {
  /**
   * Returns skeleton for a 500 response
   * @param {Object|String|Array} message
   * @returns {{statusCode: number, body: string, headers: {}}}
   */
  static getServerErrorResponse(message) {
    return {
      statusCode: 500,
      body: JSON.stringify(
        message || {
          message: "Internal server error",
        }
      ),
      headers: defaultHeaders,
    };
  }

  /**
   * Returns skeleton for a 200 response
   * @param {Object|String|Array} message
   * @returns {{statusCode: number, body: string, headers: {}}}
   */
  static getOkResponse(message) {
    return {
      statusCode: 200,
      body: JSON.stringify(
        message || {
          message: "Ok",
        }
      ),
      headers: defaultHeaders,
    };
  }
}
