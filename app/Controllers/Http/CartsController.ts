import BaseController from '../Http/BaseController'
import dayjs from 'dayjs'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Cart, cartValidator } from '../../Model/Cart'

export default class CartsController extends BaseController {
  public async create({ request, response }: HttpContextContract) {
    try {
      await request
        .validate({ schema: cartValidator })
        .then(() => {
          const { user_id, product_id, count } = request.requestBody
          const cart = new Cart({
            user_id,
            product_id,
            count,
            create_at: dayjs().toDate(),
          })
          cart.save()
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
      const cart = await Cart.findById(request.requestData.id)
      if (!cart) {
        this.error422(0, response)
      }
      response.status(200).json(cart)
    } catch (error) {
      this.error(error, response)
    }
  }

  public async getList({ response }: HttpContextContract) {
    try {
      const cart = await Cart.find()
      if (!cart) {
        this.error422(0, response)
      }
      response.status(200).json(cart)
    } catch (error) {
      this.error(error, response)
    }
  }

  public async getListUser({ response, params }: HttpContextContract) {
    try {
      const cart = await Cart.aggregate([
        {
          $match: { user_id: params.user_id },
        },
        {
          $addFields: {
            product_oid: { $toObjectId: '$product_id' },
          },
        },
        {
          $lookup: {
            from: 'product',
            localField: 'product_oid',
            foreignField: '_id',
            as: 'product',
          },
        },
      ])
      response.status(200).json(cart)
    } catch (error) {
      this.error(error, response)
    }
  }

  public async update({ response, request }: HttpContextContract) {
    try {
      await request
        .validate({ schema: cartValidator })
        .then(() => {
          const { name, aka_name, email, phone, pw, address, id } = request.requestData
          const cart = Cart.findById(id)
          if (!cart) {
            this.error422(0, response)
          }
          cart.update({
            name: name,
            aka_name: aka_name,
            email: email,
            phone: phone,
            pw: pw,
            address: address,
          })
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
      await Cart.remove({_id : request.requestData.id})
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
