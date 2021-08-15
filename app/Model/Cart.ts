import mongoose from 'mongoose'
import dayjs from 'dayjs'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

interface InCart extends mongoose.Document {
  user_id: string
  product_id: string
  count: number
  create_at: Date
}

export const cartSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    product_id: { type: String, required: true },
    count: { type: Number, required: true },
    create_at: { type: Date, required: true, default: dayjs().toDate() },
  },
  {
    versionKey: false,
  }
)

export const cartValidator = schema.create({
  id: schema.string.optional(),
  user_id: schema.string({}, [rules.minLength(10), rules.maxLength(30)]),
  product_id: schema.string({}, [rules.minLength(10), rules.maxLength(30)]),
  count: schema.number([rules.range(1, 999999999)]),
})

export const Cart = mongoose.model<InCart>('cart', cartSchema, 'cart')
