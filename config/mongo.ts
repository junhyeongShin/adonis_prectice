import Env from '@ioc:Adonis/Core/Env'
export const mongoConfig = {
  dev_host: Env.get('MONGO_HOST', 'localhost'),
  pro_host: Env.get('MONGO_HOST', 'localhost'),
  port: Env.get('MONGO_PORT', '27017'),
  user: Env.get('MONGO_USER', ''),
  pass: Env.get('MONGO_PASS', ''),
  db: Env.get('MONGO_DATABASE', 'shakerr'),
}
export type MongoDbAuthProviderConfig = {
  driver: 'mongo'
}
