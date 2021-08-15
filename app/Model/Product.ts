import mongoose from 'mongoose'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import dayjs from 'dayjs'

interface InProduct extends mongoose.Document {
  title: string
  seller: object
  price: number
  content: string
  phone: string
  remain_count: number
  count: number
  create_at: Date
  seller_id: string
  option: {
    name: number
    price: string
  }
}

const option = new mongoose.Schema({
  name: { type: String },
  price: { type: Number },
  _id: false,
})

export const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    count: { type: Number, required: true },
    remain_count: { type: Number, required: true },
    content: { type: String, required: true },
    seller_id: { type: String, required: true },
    phone: { type: String, required: true },
    option: { type: option, required: true, _id: false },
    create_at: { type: Date, required: true, default: dayjs().toDate() },
  },
  {
    versionKey: false,
  }
)

export const productValidator = schema.create({
  id: schema.string.optional(),
  title: schema.string({ escape: true }, [rules.minLength(1)]),
  price: schema.number([rules.range(1, 999999999)]),
  count: schema.number([rules.range(1, 999999999)]),
  remain_count: schema.number.optional([rules.range(1, 999999999)]),
  content: schema.string({ escape: true }, [rules.minLength(1)]),
  seller_id: schema.string({}, [rules.minLength(1)]),
  phone: schema.string({}, [rules.mobile()]),
  option: schema.object.optional().members({
    name: schema.string({}, [rules.minLength(2), rules.maxLength(30)]),
    price: schema.number([rules.range(1, 999999999)]),
  }),
})

export const Product = mongoose.model<InProduct>('product', productSchema, 'product')
