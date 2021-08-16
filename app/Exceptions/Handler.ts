import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger)
  }

  public async errorHandle(error: any, response) {
    Logger.error(error)

    switch (error.code) {
      // 요청을 JSON으로 하지 않거나 잘못된 문법으로 요청한 경우
      case 'E_MALFORMED_JSON':
        return response.status(400).send(error.messages)

      // http 경로가 잘못된 경우
      case 'E_ROUTE_NOT_FOUND':
      case 'E_MISSING_ROUTE':
      case 'E_MISSING_ROUTE_ACTION':
        return response.status(404).send(error.messages)

      // http 메소드 잘못된경우
      case 'E_UNDEFINED_METHOD':
        return response.status(405).send(error.messages)

      // 데이터 베이스 관련 에러 발생
      case 'E_MISSING_MODEL_FACTORY':
      case 'E_INVALID_MODEL_STATE':
      case 'E_UNSAVED_MODEL_INSTANCE':
      case 'E_INVALID_RELATION_INSTANCE':
      case 'E_INVALID_RELATION_METHOD':
      case 'E_INVALID_SCHEMA_FILE':
      case 'E_INVALID_MODEL_TRAIT':
        return response.status(409).send(error.messages)

      // 요청시 파라미터가 잘못된 경우
      case 'E_MISSING_PARAMETER':
      case 'E_VALIDATION_FAILURE':
      case 'E_INVALID_PARAMETER':
        return response.status(422).send(error.messages)

      // 알 수 없는 에러
      default:
        return response.status(500).send(error.messages)
    }
  }
}
