import { z } from 'zod'

const BaseAuth = z.object({
  guid: z.string(),
  name: z.string().min(1, { message: 'Name must not be empty' }),
  email: z.string().email({ message: 'Invalid email format' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
  created_at: z.string(),
  updated_at: z.string(),
})

export const Login = BaseAuth.omit({
  email: true,
})
  .pick({
    password: true,
  })
  .and(
    z.object({
      email: z.string().optional(),
      user_agent: z.string().optional().default(''),
    }),
  )

export const Register = BaseAuth.omit({
  guid: true,
  created_at: true,
  updated_at: true,
})
  .and(
    z.object({
      password_confirm: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
    }),
  )
  .superRefine(({ password_confirm, password }, ctx) => {
    if (password_confirm !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Password does not match',
        path: ['password_confirm'],
      })
    }
  })

export const roles = z.object({
  guid: z.string(),
  name: z.string(),
  permissions: z.array(
    z.object({
      guid: z.string(),
      name: z.string(),
    }),
  ),
})

export const Auth = BaseAuth.omit({
  password: true,
  created_at: true,
  updated_at: true,
}).and(
  z.object({
    phone_number: z.string().optional(),
    roles: z.array(roles),
    verified_at: z.string().optional(),
    activated_at: z.string().optional(),
    access_token: z.string(),
    refresh_token: z.string(),
  }),
)

export const ForgotPassword = z.object({
  email: z.string().email({ message: 'Invalid email format' }),
})

export const ResetPassword = z
  .object({
    token: z.string(),
    email: z.string().email({ message: 'Invalid email format' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
    password_confirmation: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
  })
  .superRefine(({ password_confirmation, password }, ctx) => {
    if (password_confirmation !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Password does not match',
        path: ['password_confirmation'],
      })
    }
  })

export const ChangePassword = z
  .object({
    old_password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
    new_password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
    confirm_password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
  })
  .superRefine(({ confirm_password, new_password }, ctx) => {
    if (confirm_password !== new_password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Password does not match',
        path: ['confirm_password'],
      })
    }
  })

export type ResetPassword = z.infer<typeof ResetPassword>
export type Auth = z.infer<typeof Auth>
export type Login = z.infer<typeof Login>
export type Register = z.infer<typeof Register>

export type ForgotPassword = z.infer<typeof ForgotPassword>
export type ChangePassword = z.infer<typeof ChangePassword>
