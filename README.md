# node-async-jenkins-api
Call Jenkins API with JavaScript

## Install
npm install node-async-jenkins-api

## Usage

#### Setup
```javascript
const Jenkins = require('node-async-jenkins-api');
const jenkins = new Jenkins({
  url: 'jenkinsUrl',
  username: 'jenkinsUsername',
  password: 'jenkinsPassword',
  token:  'jenkinsToken'
});
```

#### build
``` 
const result = await jenkins.build(jobName)
```

#### buildWithParams
```
const result = await jenkins.buildWithParams(jobName, params)
```

#### getQueueItemInfo
```
const result = await jenkins.getQueueItemInfo(queueId)
```

#### cancelQueueItem
```
const result = await jenkins.cancelQueueItem(queueId)
```

#### getQueueInfo
```
const result = await jenkins.getQueueInfo()
```

#### getLastBuildInfo
```
const result = await jenkins.getLastBuildInfo(jobName)
```

#### stopBuild
```
const result = await jenkins.stopBuild(jobName, buildNumber)
```

#### allJobsInView
```
const result = await jenkins.allJobsInView(viewName)
```
