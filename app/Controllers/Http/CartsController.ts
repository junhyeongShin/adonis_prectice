import BaseController from '../Http/BaseController'
import dayjs from 'dayjs'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Cart, cartValidator } from '../../Model/Cart'
import { Product } from '../../Model/Product'

export default class CartsController extends BaseController {
  public async create({ request, response }: HttpContextContract) {
    try {
      await request
        .validate({ schema: cartValidator })
        .then(() => {
          const { user_id, product_id, count } = request['requestData']
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
      const cart = await Cart.findById(request['requestData']['id'])
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
          $match: { user_id: params.id },
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
        {
          $addFields: {
            user_oid: {
              $toObjectId: '$user_id',
            },
          },
        },
        {
          $lookup: {
            from: 'user',
            localField: 'user_oid',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: {
            path: '$product',
          },
        },
        {
          $unwind: {
            path: '$user',
          },
        },
        {
          $project: {
            user_id: '$user_id',
            product_id: '$product_id',
            price: '$product.price',
            address: '$user.address',
            count: '$count',
          },
        },
      ])
      response.status(200).json(cart)
    } catch (error) {
      console.log(error)
      this.error(error, response)
    }
  }

  public async update({ response, request }: HttpContextContract) {
    try {
      await request
        .validate({ schema: cartValidator })
        .then(() => {
          const { name, aka_name, email, phone, pw, address, id } = request['requestData']
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

  public async increaseCount({ response, params, num }) {
    try {
      await Cart.findByIdAndUpdate(params.id, {
        $inc: { count: num },
      }).then(() => {
        console.log(params)
        response.status(201).json({ success: true })
      })
    } catch (error) {
      this.error(error, response)
    }
  }

  public async delOne({ response, request }: HttpContextContract) {
    try {
      await Cart.remove({ _id: request['requestData']['id'] })
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

  public async buyCart({ response, params }: HttpContextContract) {
    try {
      console.log(params.id)
      const cart = await Cart.aggregate([
        {
          $match: { user_id: params.id },
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
        {
          $addFields: {
            user_oid: {
              $toObjectId: '$user_id',
            },
          },
        },
        {
          $lookup: {
            from: 'user',
            localField: 'user_oid',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: {
            path: '$product',
          },
        },
        {
          $unwind: {
            path: '$user',
          },
        },
        {
          $project: {
            user_id: '$user_id',
            product_id: '$product_id',
            price: '$product.price',
            address: '$user.address',
            count: '$count',
          },
        },
      ])

      for (let i = 0; i < cart.length; i++) {
        let product = Product.findById(cart[i]['product_id'])

        if (cart[i]['count'] > product['count']) {
          response.status(409).json({ success: false })
          break
        }
      }
      //TODO:어떤걸 해야할지 생각해보자.
      //1. 유저의 정보가 필요한가?
      //2. 다른 api로 전송해줘야 하니까 필요하다
      //3. 아니다 그거는 그때 다시 유저의 정보를 가져 오는게 편하다.
      response.status(200).json({ success: true })
    } catch (error) {
      this.error(error, response)
    }
  }
}
