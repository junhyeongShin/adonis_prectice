import dayjs from 'dayjs'
import BaseController from '../Http/BaseController'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Product, productValidator } from '../../Model/Product'

export default class ProductsController extends BaseController {
  public async create({ request, response }: HttpContextContract) {
    try {
      await request
        .validate({ schema: productValidator })
        .then(() => {
          const { title, price, content, count, phone, seller_id, option } = request.requestBody
          const product = new Product({
            title,
            price,
            content,
            count,
            phone,
            seller_id,
            option,
            create_at: dayjs().toDate(),
          })
          product.remain_count = count
          product.save()
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
      const product = await Product.findById(request.requestData.id)
      if (!product) {
        this.error422(0, response)
      }
      response.status(200).json(product)
    } catch (error) {
      this.error(error, response)
    }
  }

  public async getList({ response }: HttpContextContract) {
    try {
      const product = await Product.find()
      if (!product) {
        this.error422(0, response)
      }
      response.status(200).json(product)
    } catch (error) {
      this.error(error, response)
    }
  }

  public async getListPrice({ response, params }: HttpContextContract) {
    try {
      if (!params.sort) this.error422(0, response)
      const product = await Product.find().sort({ price: params.sort })
      response.status(200).json(product)
    } catch (error) {
      this.error(error, response)
    }
  }

  public async update({ response, request }: HttpContextContract) {
    try {
      await request
        .validate({ schema: productValidator })
        .then(() => {
          const { title, price, content, remain_count, count, seller_id, option, id } = request.requestBody
          const product = Product.findById(id)
          if (!product) {
            this.error422(0, response)
          }
          product.update(
            {
              _id: id,
            },
            {
              title: title,
              price: price,
              content: content,
              remain_count: remain_count,
              count: count,
              seller_id: seller_id,
              option: option,
            }
          )
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
      await Product.remove({_id : request.requestData.id})
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
