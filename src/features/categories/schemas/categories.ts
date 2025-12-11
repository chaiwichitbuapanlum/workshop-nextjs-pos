import { z } from 'zod'

// Define
const MIN_NAME_LENGTH = 2

// Define Error
const ERROR_MESSAGE = {
    name: `Name must be at least ${MIN_NAME_LENGTH} characters long.`
}

// Main Schema
export const categorySchema = z.object({
    name: z.string().min(MIN_NAME_LENGTH, { message: ERROR_MESSAGE.name })
})