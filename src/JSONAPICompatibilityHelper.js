export const JSON_API_MEDIA_HEADER = "application/vnd.api+json";
const ALL_MEDIA_TYPES = "*/*";
const CONTENT_TYPE_HEADER_KEY = "Content-Type";

export default class JSONAPICompatibilityHelper {
  /**
   * Validates Accept Header from client
   * @param headers
   * @returns {boolean}
   */
  static isValidAcceptHeader(headers) {
    const acceptHeader = headers.Accept;
    return (
      !acceptHeader ||
      acceptHeader === ALL_MEDIA_TYPES ||
      acceptHeader === JSON_API_MEDIA_HEADER
    );
  }

  /**
   * Validates Content-Type Header
   * @param headers
   * @returns {boolean}
   */
  static isValidContentTypeHeader(headers) {
    return headers[CONTENT_TYPE_HEADER_KEY] === JSON_API_MEDIA_HEADER;
  }

  /**
   * Formats errors
   * @param {number} id
   * @param {string} title
   * @param {String} code
   * @param {Number} status
   * @returns {{meta: Object, errors: [{code: string, id: string, title: string, status: string}]}}
   */
  static formatError(id, title, code = "", status = null) {
    return {
      errors: [
        {
          id: id.toString(),
          code: code ? code.toString() : "",
          title: title ? title.toString() : "",
          status: status ? status.toString() : "",
        },
      ],
      meta: {},
    };
  }

  /**
   * Check whether request headers are valid for a JSON API 1.0 request
   * @param {Object} headers - Request headers present in the AWS Event Object
   * @returns {{meta: Object, errors: {code: string, id: string, title: string, status: string}[]}|null}
   */
  static errorsInHeaders(headers) {
    if (!JSONAPICompatibilityHelper.isValidContentTypeHeader(headers)) {
      return JSONAPICompatibilityHelper.formatError(
        1,
        "Unsupported Media Type",
        null,
        415
      );
    }
    if (!JSONAPICompatibilityHelper.isValidAcceptHeader(headers)) {
      return JSONAPICompatibilityHelper.formatError(
        2,
        "Not Acceptable",
        null,
        406
      );
    }
    return null;
  }
}
