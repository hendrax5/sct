import { z } from 'zod'

// Auth schemas
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const RegisterSchema = LoginSchema.extend({
  name: z.string().min(2),
})

// Product schemas
export const ProductSchema = z.object({
  sku: z.string().min(1),
  name: z.string().min(1).max(255),
  description: z.string().min(10),
  price: z.number().int().positive(),
  stock: z.number().int().nonnegative(),
  categoryId: z.string(),
})

// Order schemas
export const CreateOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
  })),
  shippingAddressId: z.string(),
  paymentMethod: z.enum(['XENDIT', 'TRANSFER']),
})

export type LoginInput = z.infer<typeof LoginSchema>
export type RegisterInput = z.infer<typeof RegisterSchema>
export type ProductInput = z.infer<typeof ProductSchema>
export type CreateOrderInput = z.infer<typeof CreateOrderSchema>
