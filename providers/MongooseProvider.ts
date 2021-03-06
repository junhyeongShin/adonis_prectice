import mongoose from 'mongoose'
import { mongoConfig } from 'Config/mongo'

mongoose.Promise = global.Promise

export default class DatabaseConnector {
  constructor() {}

  public async connect() {
    try {
      // const dbUrl: string = mongoConfig.dev_host + '/' + mongoConfig.db
      const dbUrl: string = 'mongodb://localhost:27017/shakerr'
      await mongoose.connect(
        dbUrl,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useFindAndModify: false,
        },
        (error) => {
          if (error) {
            console.error('❌ Local DB Connect error :   ', error)
          } else {
            console.log(`✅${mongoose.connection.name} DB CONNECTED`)
          }
        }
      )
    } catch (error) {
      console.error('Local DB Connect error : ', error)
    }
  }
}
