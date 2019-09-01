import LocalStore from 'licia/LocalStore'
import logger from './logger'

const configs = {}

const config = {
  create(name) {
    logger.warn('createCfg is deprecated')

    if (!configs[name]) configs[name] = new LocalStore(name)

    return configs[name]
  }
}

export default config
