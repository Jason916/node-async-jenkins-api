/**
 * Created by jasonxu on 2020/3/30.
 */
const moment = require('moment')
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
    if (!this.jenkinsUrl) throw new Error('missing jenkins login address')
  }

  async build(jobName) {
    let data = {}
    if (!jobName) throw new Error('missing job name')
    let options = {
      method: 'POST',
      uri: `${this.jenkinsUrl}/job/${jobName}/build/api/json`,
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
    const options = {
      method: 'POST',
      uri: `${this.jenkinsUrl}/job/${jobName}/buildWithParameters?${queryString.stringify(params)}`,
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
    if (data.statusCode !== 404) {
      data.body = JSON.parse(response.result.body) || {}
    } else {
      data.message = 'Not Found'
    }
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
    if (data.statusCode !== 404) {
      data.body = JSON.parse(response.result.body) || {}
    } else {
      data.message = 'Not Found'
    }
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
    if (data.statusCode !== 404) {
      data.body = JSON.parse(response.result.body) || {}
    } else {
      data.message = 'Not Found'
    }
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
    if (data.statusCode !== 404) {
      data.body = JSON.parse(response.result.body) || {}
    } else {
      data.message = 'Not Found'
    }
    return {data}
  }

  async getJobInfo(jobName) {
    let data = {}
    if (!jobName) throw new Error('missing job name')
    let options = {
      uri: `${this.jenkinsUrl}/job/${jobName}/api/json`,
      followAllRedirects: true,
      auth: {user: this.username, pass: this.password}
    }
    let response = await doRequest(options)
    if (response.error) {
      return {code: response.status, data: response.error}
    }
    data.statusCode = response.status || 404
    if (data.statusCode !== 404) {
      data.body = JSON.parse(response.result.body) || {}
    } else {
      data.message = 'Not Found'
    }
    return {data}
  }

  async stopBuild(jobName, buildNumber) {
    let data = {}
    if (!jobName) throw new Error('missing job name')
    if (!buildNumber) throw new Error('missing build number')
    const options = {
      method: 'POST',
      uri: `${this.jenkinsUrl}/job/${jobName}/${buildNumber}/stop`,
      followAllRedirects: true,
      auth: {user: this.username, pass: this.password}
    }
    let response = await doRequest(options)
    if (response.error) {
      return {code: response.status, data: response.error}
    }
    data.statusCode = response.status || 404
    if (data.statusCode !== 404) {
      data.body = response.result.body || {}
    } else {
      data.message = 'Not Found'
    }
    return {data}
  }

  async buildInfo(jobName, buildNumber) {
    let data = {}
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
    data.statusCode = response.status || 404
    if (data.statusCode !== 404) {
      data.body = JSON.parse(response.result.body) || {}
    } else {
      data.message = 'Not Found'
    }
    return {data}
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
    if (data.statusCode !== 404) {
      data.body = JSON.parse(response.result.body) || {}
    } else {
      data.message = 'Not Found'
    }
    return {data}
  }

  async getBuildingProcess(jobName) {
    let data = {}
    let buildingProcess = 0
    let job = await this.getLastBuildInfo(jobName)
    let jobInfo = job.data.body
    if (jobInfo) {
      let buildInfo = await this.buildInfo(jobName, jobInfo.number)
      let buildInfoBody = buildInfo.data.body
      if (!buildInfoBody) {
        data.statusCode = 400
        data.message = '获取构建信息失败'
        return {data}
      }
      let currentTimeStamp = moment().format('x')
      let estimatedDuration = buildInfoBody.estimatedDuration
      // 单位:ms
      let jobStartTime = buildInfoBody.timestamp
      let status = buildInfoBody.result

      if (estimatedDuration > -1) {
        buildingProcess = Math.floor(((currentTimeStamp - jobStartTime) / estimatedDuration) * 100)
      }
      if (buildingProcess >= 100 && (status === "SUCCESS" || status === "ABORTED" || status === "FAILURE")) {
        buildingProcess = 100
      } else if (buildingProcess >= 100) {
        buildingProcess = 99
      }
    }
    data.statusCode = 200
    data.body = {'process': buildingProcess}
    data.message = '获取构建进度成功'
    return {data}
  }

}

module.exports = Jenkins
