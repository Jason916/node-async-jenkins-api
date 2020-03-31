/**
 * Created by jasonxu on 2020/3/30.
 */
const typeCheck = require('../util/typeStrict')
const doRequest = require('../util/doRequest')
const queryString = require('querystring')


function getQueueId(data) {
  let queueIdRe = /\/queue\/item\/(\d+)/
  let queueId = +queueIdRe.exec(data.location)[1] || ''
  return queueId
}


class Jenkins {
  constructor(loginOption) {
    this.jenkinsUrl = loginOption.url || ''
    this.username = loginOption.username || ''
    this.password = loginOption.password || ''
    this.token = loginOption.token || ''
    if (!this.jenkinsUrl) throw new Error('missing jenkins login address')
  }

  async build(jobName) {
    let data = {}
    if (!jobName) throw new Error('missing job name')
    let options = {
      method: 'POST',
      uri: `${this.jenkinsUrl}/job/${jobName}/build/api/json?token=${this.token}`,
      auth: {user: this.username, pass: this.password},
      resolveWithFullResponse: true
    }
    let response = await doRequest(options)
    if (response.error) {
      return {code: response.status, data: response.error}
    }
    if (response.result.headers) {
      data.queueId = getQueueId(response.result.headers)
    }
    data.statusCode = response.status || 404
    data.location = response.result.headers.location || ''
    return {data}
  }

  async buildWithParams(jobName, params) {
    let data = {}
    if (!jobName) throw new Error('miss job name')
    let tc = await typeCheck([Object], [params])
    if (!tc.status || Object.keys(params).length < 1) throw new Error('missing job params')
    const query = Object.assign({token: this.token}, params)
    const options = {
      method: 'POST',
      uri: `${this.jenkinsUrl}/job/${jobName}/buildWithParameters?${queryString.stringify(query)}`,
      auth: {user: this.username, pass: this.password},
      resolveWithFullResponse: true
    }
    let response = await doRequest(options)
    if (response.error) {
      return {code: response.status, data: response.error}
    }
    if (response.result.headers) {
      data.queueId = getQueueId(response.result.headers)
    }
    data.statusCode = response.status || 404
    data.location = response.result.headers.location || ''
    return {data}
  }

  async getQueueItemInfo(queueId) {
    let data = {}
    if (!queueId) throw new Error('missing queueId')
    let options = {
      uri: `${this.jenkinsUrl}/queue/item/${queueId}/api/json`,
      followAllRedirects: true,
      auth: {user: this.username, pass: this.password}
    }
    let response = await doRequest(options)
    if (response.error) {
      return {code: response.status, data: response.error}
    }
    data.statusCode = response.status || 404
    data.body = JSON.parse(response.result.body) || {}
    return {data}
  }

  async cancelQueueItem(queueId) {
    let data = {}
    if (!queueId) throw new Error('missing queueId')
    const options = {
      method: 'POST',
      uri: `${this.jenkinsUrl}/queue/cancelItem?id=${queueId}`,
      auth: {user: this.username, pass: this.password},
      resolveWithFullResponse: true
    }
    let response = await doRequest(options)
    if (response.error) {
      return {code: response.status, data: response.error}
    }
    data.statusCode = response.status || 404
    return {data}
  }

  async getQueueInfo() {
    let data = {}
    let options = {
      uri: `${this.jenkinsUrl}/queue/api/json`,
      followAllRedirects: true,
      auth: {user: this.username, pass: this.password}
    }
    let response = await doRequest(options)
    if (response.error) {
      return {code: response.status, data: response.error}
    }
    data.statusCode = response.status || 404
    data.body = JSON.parse(response.result.body) || {}
    return {data}
  }

  async getLastBuildInfo(jobName) {
    let data = {}
    if (!jobName) throw new Error('missing job name')
    let options = {
      uri: `${this.jenkinsUrl}/job/${jobName}/lastBuild/api/json`,
      followAllRedirects: true,
      auth: {user: this.username, pass: this.password}
    }
    let response = await doRequest(options)
    if (response.error) {
      return {code: response.status, data: response.error}
    }
    data.statusCode = response.status || 404
    data.body = JSON.parse(response.result.body) || {}
    return {data}
  }

  async stopBuild(jobName, buildNumber) {
    let data = {}
    if (!jobName) throw new Error('missing job name')
    if (!buildNumber) throw new Error('missing build number')
    const options = {
      method: 'POST',
      uri: `${this.jenkinsUrl}/job/${jobName}/${buildNumber}/stop?token=${this.token}`,
      followAllRedirects: true,
      auth: {user: this.username, pass: this.password}
    }
    let response = await doRequest(options)
    if (response.error) {
      return {code: response.status, data: response.error}
    }
    data.statusCode = response.status || 404
    data.body = response.result.body || {}
    return {data}
  }

  async buildInfo(jobName, buildNumber) {
    if (!jobName) throw new Error('missing job name')
    if (!buildNumber) throw new Error('missing build number')
    const options = {
      uri: `${this.jenkinsUrl}/job/${jobName}/${buildNumber}/api/json`,
      followAllRedirects: true,
      auth: {user: this.username, pass: this.password}
    }
    let response = await doRequest(options)
    if (response.error) {
      return {code: response.status, data: response.error}
    }
    return response
  }

  async allJobsInView(viewName) {
    let data = {}
    if (!viewName) throw new Error('missing view name')
    const options = {
      uri: `${this.jenkinsUrl}/view/${viewName}/api/json`,
      followAllRedirects: true,
      auth: {user: this.username, pass: this.password}
    }
    let response = await doRequest(options)
    if (response.error) {
      return {code: response.status, data: response.error}
    }
    data.statusCode = response.status || 404
    data.body = JSON.parse(response.result.body) || {}
    return {data}
  }

}

module.exports = Jenkins
