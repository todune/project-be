import logger from './common/logger'
import { Application } from './app'

Application.createApplication().then(() => {
     logger.info('API started!')
})
