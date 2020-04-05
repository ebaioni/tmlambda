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
   * @returns {{meta: {}, errors: [{code: null, id: *, title: *}]}}
   */
  static formatError(id, title, code = null, status = null) {
    return {
      errors: [
        {
          id,
          code,
          title,
          status,
        },
      ],
      meta: {},
    };
  }
}
