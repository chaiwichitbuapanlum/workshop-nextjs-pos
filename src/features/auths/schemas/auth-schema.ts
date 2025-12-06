import { z } from 'zod'

// Define Contants
const MIN_NAME_LENGTH = 3
const MIN_PASSWORD_LENGTH = 8
const SPECIAL_CHARS = '!@#$%^&*(),.?":{}|<>'


// Define Error Message
const ERROR_MESSAGES = {
    name: `ชื่อต้องมีความยาวอย่างน้อย ${MIN_NAME_LENGTH} ตัวอักษร`,
    email: {
        format: 'กรุณาใส่อีเมลที่ถูกต้อง',
        domain: 'อีกเมลล์ต้องเป็น Gmail, Hotmail, หรือ Outlook เท่านั้น',
    },
    password: {
        length: `รหัสผ่านต้องมีความยาวอย่างน้อย ${MIN_PASSWORD_LENGTH} ตัวอักษร`,
        uppercase: 'รหัสผ่านต้องมีตัวอักษรพิมพ์ใหญ่ อย่างน้อยหนึ่งตัว',
        lowercase: 'รหัสผ่านต้องมีตัวอักษรพิมพ์เล็ก อย่างน้อยหนึ่งตัว',
        number: 'รหัสผ่านต้องมีตัวเลข อย่างน้อยหนึ่งตัว',
        special: `รหัสผ่านต้องมีอักขระพิเศษ อย่างน้อยหนึ่งตัว เช่น ${SPECIAL_CHARS}`,
    },
    confirmPassword: 'รหัสผ่านไม่ตรงกัน',

}

// Define Valid Email Domains
const VALID_EMAIL = ['gmail.com', 'hotmail.com', 'outlook.com', 'eveandboy.com']


// Check email
const isValidEmailDomain = (email: string) => {
    const domain = email ? email.split('@')[1].toLocaleLowerCase() : ''
    return VALID_EMAIL.includes(domain) // true, false
}

// Password Schema
const passwordSchema = z.string()
    .min(MIN_PASSWORD_LENGTH, { message: ERROR_MESSAGES.password.length })
    .regex(/[A-Z]/, { message: ERROR_MESSAGES.password.uppercase })
    .regex(/[a-z]/, { message: ERROR_MESSAGES.password.lowercase })
    .regex(/[0-9]/, { message: ERROR_MESSAGES.password.number })
    .regex(new RegExp(`[${SPECIAL_CHARS}]`), { message: ERROR_MESSAGES.password.special })



// Main Signup Schema
export const signupSchema = z.object({
    name: z.string()
        .optional()
        .refine(
            (name) => !name || name.trim().length >= MIN_NAME_LENGTH,
            { message: ERROR_MESSAGES.name } 
        ),
    email: z.string()
        .email({ message: ERROR_MESSAGES.email.format })
        .refine(
            (email) => isValidEmailDomain(email), { message: ERROR_MESSAGES.email.domain }
        ),
    password: passwordSchema,
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: ERROR_MESSAGES.confirmPassword,
    path: ['confirmPassword'],
})