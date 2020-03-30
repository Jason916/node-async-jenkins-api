/**
 * Created by jasonxu on 2020/3/30.
 */
const request = require('./request')
const SUCCESS_STATUS_CODE = 200

async function doRequest(options) {
  try {
    const result = await request(options);
    return { status: result.statusCode || SUCCESS_STATUS_CODE, result: result || '' };
  } catch(error) {
    return { status: error.statusCode, error: error.message || '' };
  }
}

module.exports = doRequest
