import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { User, userValidator } from '../../Model/User'

import BaseController from '../Http/BaseController'
import dayjs from 'dayjs'

export default class UsersController extends BaseController {
  public async create({ request, response }: HttpContextContract) {
    try {
      await request
        .validate({ schema: userValidator })
        .then(() => {
          const { name, aka_name, email, phone, pw, address } = request['requestData']
          const user = new User({
            name,
            aka_name,
            email,
            phone,
            pw,
            address,
            create_at: dayjs().toDate(),
          })
          user.save()
          response.status(201).json({ success: true })
        })
        .catch((error) => {
          this.error(error, response)
        })
    } catch (error) {
      this.error(error, response)
    }
  }

  public async getOne({ response, request }: HttpContextContract) {
    try {
      const user = await User.findById(request['requestData']['id'])
      if (!user) {
        this.error422(0, response)
      }
      response.status(200).json(user)
    } catch (error) {
      this.error(error, response)
    }
  }

  public async getList({ response }: HttpContextContract) {
    try {
      const user = await User.find()
      if (!user) {
        this.error422(0, response)
      }
      response.status(200).json(user)
    } catch (error) {
      this.error(error, response)
    }
  }

  public async update({ response, request }: HttpContextContract) {
    try {
      await request
        .validate({ schema: userValidator })
        .then(() => {
          const { name, aka_name, email, phone, pw, address, id } = request['requestData']
          const user = User.findById(id)
          if (!user) {
            this.error422(0, response)
          }
          user.update({
            name: name,
            aka_name: aka_name,
            email: email,
            phone: phone,
            pw: pw,
            address: address,
          })
          console.log('user', user)
          response.status(201).json({ success: true })
        })
        .catch((error) => {
          this.error(error, response)
        })
    } catch (error) {
      this.error(error, response)
    }
  }

  public async delOne({ response, request }: HttpContextContract) {
    try {
      await User.remove({ _id: request['requestData']['id'] })
        .then(() => {
          response.status(204).json('')
        })
        .catch((error) => {
          this.error(error, response)
        })
    } catch (error) {
      this.error(error, response)
    }
  }
}
