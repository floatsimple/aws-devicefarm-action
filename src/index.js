const core = require('@actions/core')
const AWS = require('aws-sdk')

const getInputWithDefault = (args) => {
    const { name, defaultValue, required } = args
    let value = core.getInput(name)
    if (!value && defaultValue) {
        core.debug(`Info: No value provided for input ${name}. Defaulting to ${defaultValue}`)
        value = defaultValue
    }
    if (!value && required) {
        throw `Error: No value provided for required input ${name}`
    }
    return value
}

const configAWS = () => {
    const accessKeyId = getInputWithDefault({ name: 'accessKeyId', required: true })
    const secretAccessKeyId = getInputWithDefault({ name: 'secretAccessKeyId', required: true })
    const region = getInputWithDefault({ name: 'region', defaultValue: 'us-west-2' })
    const apiVersion = '2015-06-23'

    AWS.config.accessKeyId = accessKeyId
    AWS.config.secretAccessKey = secretAccessKeyId
    AWS.config.region = region
    AWS.apiVersion = apiVersion
}

try {
    configAWS()

    const deviceFarm = AWS.DeviceFarm()

    deviceFarm.listProjects({}, (err, data) => {
        if (err) {
            core.debug(err)
            throw err
        } else {
            core.debug(`projects: ${data}`)
            core.setOutput('projects', data)
        }
    })
} catch (error) {
    core.setFailed(error.message)
}
