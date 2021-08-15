import mongoose from 'mongoose'
import dayjs from 'dayjs'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

interface InUser extends mongoose.Document {
  email: string
  pw: string
  name: string
  aka_name: string
  phone: string
  create_at: Date
  address: {
    address_number: number
    address_detail: string
    address_name: string
  }
}

const address = new mongoose.Schema({
  name: { type: String },
  address_number: { type: String },
  address_detail: { type: String },
  _id: false,
})

export const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    pw: { type: String, required: true },
    aka_name: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: Number, required: true },
    create_at: { type: Date, required: true, default: dayjs().toDate() },
    address: { type: address, _id: false },
  },
  {
    versionKey: false,
  }
)

export const userValidator = schema.create({
  id: schema.string.optional(),
  email: schema.string({}, [rules.email()]),
  pw: schema.string({}, [rules.minLength(8), rules.maxLength(30)]),
  aka_name: schema.string({}, [rules.minLength(2), rules.maxLength(30)]),
  name: schema.string({}, [rules.minLength(2), rules.maxLength(30)]),
  phone: schema.string({}, [rules.mobile()]),
  address: schema.object.optional().members({
    name: schema.string({}, [rules.minLength(2), rules.maxLength(30)]),
    address_detail: schema.string({}, [rules.minLength(2), rules.maxLength(30)]),
    address_number: schema.string({}, [rules.minLength(4), rules.maxLength(6)]),
  }),
})

export const User = mongoose.model<InUser>('user', userSchema, 'user')
