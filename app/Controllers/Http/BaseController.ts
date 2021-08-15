import ExceptionHandler from '../../Exceptions/Handler'
import Logger from '@ioc:Adonis/Core/Logger'

export default class BaseController {
  private exceptionHandler = new ExceptionHandler()
  private logger = Logger

  protected async logInfo(messages, request) {
    this.logger.info(messages)
  }

  protected async error(error, response) {
    this.exceptionHandler.errorHandle(error, response)
  }

  protected error422(error422: number, response) {
    switch (error422) {
      case 0:
        this.exceptionHandler.errorHandle('E_MISSING_PARAMETER', response)
        break
      case 1:
        this.exceptionHandler.errorHandle('E_INVALID_PARAMETER', response)
        break
      case 2:
        this.exceptionHandler.errorHandle('E_INVALID_PARAMETER', response)
        break
      default:
        this.exceptionHandler.errorHandle('IS_NOT_422_SERVER_ERROR_BASECONTROLLER', response)
        break
    }
  }
}
