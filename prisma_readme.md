# Prisma 7 - SQL Server Setup Guide

## 📋 สารบัญ
- [การติดตั้ง](#การติดตั้ง)
- [การตั้งค่า](#การตั้งค่า)
- [Prisma CLI Commands](#prisma-cli-commands)
- [การใช้งาน Prisma Client](#การใช้งาน-prisma-client)
- [ตัวอย่างโค้ด](#ตัวอย่างโค้ด)

---

## 🚀 การติดตั้ง

### 1. ติดตั้ง Prisma และ Prisma Client

```bash
npm install prisma @prisma/client
# หรือ
yarn add prisma @prisma/client
# หรือ
pnpm add prisma @prisma/client
```

**Dev Dependencies (แนะนำ):**
```bash
npm install -D prisma
npm install @prisma/client
```

---

## ⚙️ การตั้งค่า

### 2. สร้างไฟล์ Prisma Schema

สำหรับ **SQL Server** ให้แก้ไขไฟล์ `prisma/schema.prisma`:

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlserver"
}
```

### 3. ตั้งค่า Connection String

สร้างไฟล์ `.env` และเพิ่ม connection string:

```env
# .env

# SQL Server Connection String
DATABASE_URL="sqlserver://HOST:PORT;database=DATABASE_NAME;user=USERNAME;password=PASSWORD;encrypt=true;trustServerCertificate=true"

# ตัวอย่าง
DATABASE_URL="sqlserver://192.168.2.62:1433;database=dev_pos;user=devdevdev;password=Qazwsxedc#2;encrypt=true;trustServerCertificate=true"
```

**Connection String Parameters:**
- `HOST:PORT` - ที่อยู่เซิร์ฟเวอร์และพอร์ต (default: 1433)
- `database` - ชื่อฐานข้อมูล
- `user` - ชื่อผู้ใช้
- `password` - รหัสผ่าน
- `encrypt=true` - เปิดใช้งาน TLS/SSL
- `trustServerCertificate=true` - ยอมรับ self-signed certificate

### 4. ตั้งค่า Prisma Config (Prisma 7)

ไฟล์ `prisma.config.ts` จะถูกสร้างอัตโนมัติ:

```typescript
// prisma.config.ts

import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
```

---

## 🛠️ Prisma CLI Commands

### การจัดการ Schema

#### `prisma init`
สร้างโปรเจค Prisma ใหม่
```bash
npx prisma init
```

#### `prisma db pull`
ดึง schema จากฐานข้อมูลที่มีอยู่ (Introspection)
```bash
npx prisma db pull
```
- ใช้เมื่อต้องการ sync schema จากฐานข้อมูลที่มีตารางอยู่แล้ว
- จะสร้าง models ใน `schema.prisma` อัตโนมัติ

#### `prisma db push`
Push schema ไปยังฐานข้อมูล (สำหรับ development)
```bash
npx prisma db push
```
- ใช้ใน development เพื่อ sync schema กับฐานข้อมูลอย่างรวดเร็ว
- **ไม่สร้างไฟล์ migration**

#### `prisma migrate dev`
สร้างและรัน migration (สำหรับ development)
```bash
npx prisma migrate dev --name init
npx prisma migrate dev --name add_user_table
```
- สร้างไฟล์ migration ใหม่
- Apply migration ไปยังฐานข้อมูล
- Generate Prisma Client อัตโนมัติ

#### `prisma migrate deploy`
Deploy migrations (สำหรับ production)
```bash
npx prisma migrate deploy
```
- Apply pending migrations
- ไม่สร้าง migration ใหม่

#### `prisma migrate reset`
รีเซ็ตฐานข้อมูล (⚠️ ลบข้อมูลทั้งหมด)
```bash
npx prisma migrate reset
```
- Drop database
- สร้างใหม่และ apply migrations ทั้งหมด
- Run seed script (ถ้ามี)

#### `prisma migrate status`
ตรวจสอบสถานะ migrations
```bash
npx prisma migrate status
```

### การจัดการ Prisma Client

#### `prisma generate`
สร้าง/อัพเดท Prisma Client
```bash
npx prisma generate
```
- รันทุกครั้งหลังแก้ไข `schema.prisma`
- สร้าง TypeScript types อัตโนมัติ

### เครื่องมือช่วย

#### `prisma studio`
เปิด GUI สำหรับจัดการข้อมูล
```bash
npx prisma studio
```
- เปิดที่ `http://localhost:5555`
- ดู แก้ไข เพิ่ม ลบข้อมูลผ่าน UI

#### `prisma format`
จัดรูปแบบไฟล์ schema
```bash
npx prisma format
```

#### `prisma validate`
ตรวจสอบความถูกต้องของ schema
```bash
npx prisma validate
```

#### `prisma version`
ตรวจสอบเวอร์ชัน
```bash
npx prisma version
```

---

## 💻 การใช้งาน Prisma Client

### สร้าง Prisma Client Instance

```typescript
/**
 * lib/prisma.ts
 * 
 * สร้าง singleton instance ของ Prisma Client
 * ป้องกันการสร้าง instance ซ้ำใน development mode (hot reload)
 */

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query', 'error', 'warn'],
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma
```

### การใช้งานใน Next.js 15 App Router

#### Server Component

```typescript
/**
 * app/users/page.tsx
 * 
 * ตัวอย่างการใช้ Prisma ใน Server Component
 */

import { prisma } from '@/lib/prisma'

export default async function UsersPage() {
  // ✅ Query ข้อมูลโดยตรง - ไม่ต้องสร้าง API route
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  )
}
```

#### Server Action

```typescript
/**
 * app/actions/user.ts
 * 
 * ตัวอย่าง Server Actions สำหรับจัดการข้อมูล
 */

'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

/**
 * สร้างผู้ใช้ใหม่
 * @param formData - ข้อมูลจากฟอร์ม
 * @returns ผู้ใช้ที่สร้างใหม่
 */
export async function createUser(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string

  const user = await prisma.user.create({
    data: {
      name,
      email,
    },
  })

  revalidatePath('/users')
  return user
}

/**
 * อัพเดทข้อมูลผู้ใช้
 * @param id - ID ของผู้ใช้
 * @param data - ข้อมูลที่ต้องการอัพเดท
 */
export async function updateUser(id: string, data: { name?: string; email?: string }) {
  const user = await prisma.user.update({
    where: { id },
    data,
  })

  revalidatePath('/users')
  return user
}

/**
 * ลบผู้ใช้
 * @param id - ID ของผู้ใช้ที่ต้องการลบ
 */
export async function deleteUser(id: string) {
  await prisma.user.delete({
    where: { id },
  })

  revalidatePath('/users')
}
```

#### API Route

```typescript
/**
 * app/api/users/route.ts
 * 
 * ตัวอย่าง API Route Handler
 */

import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

/**
 * GET /api/users
 * ดึงรายการผู้ใช้ทั้งหมด
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') ?? '1')
    const limit = parseInt(searchParams.get('limit') ?? '10')
    const skip = (page - 1) * limit

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count(),
    ])

    return NextResponse.json({
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/users
 * สร้างผู้ใช้ใหม่
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
      },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
```

---

## 📝 ตัวอย่างโค้ด

### CRUD Operations

```typescript
import { prisma } from '@/lib/prisma'

/**
 * CREATE - สร้างข้อมูลใหม่
 */
const user = await prisma.user.create({
  data: {
    name: 'John Doe',
    email: 'john@example.com',
    posts: {
      create: [
        { title: 'Post 1', content: 'Content 1' },
        { title: 'Post 2', content: 'Content 2' },
      ],
    },
  },
  include: {
    posts: true,
  },
})

/**
 * READ - อ่านข้อมูล
 */

// ค้นหาหลายรายการ
const users = await prisma.user.findMany({
  where: {
    email: {
      contains: '@example.com',
    },
  },
  orderBy: {
    createdAt: 'desc',
  },
  take: 10,
  skip: 0,
})

// ค้นหารายการเดียว
const user = await prisma.user.findUnique({
  where: { id: '123' },
  include: {
    posts: true,
    profile: true,
  },
})

// ค้นหารายการแรก
const firstUser = await prisma.user.findFirst({
  where: {
    email: {
      endsWith: '@example.com',
    },
  },
})

/**
 * UPDATE - แก้ไขข้อมูล
 */

// แก้ไขรายการเดียว
const updatedUser = await prisma.user.update({
  where: { id: '123' },
  data: {
    name: 'Jane Doe',
    email: 'jane@example.com',
  },
})

// แก้ไขหลายรายการ
const updateMany = await prisma.user.updateMany({
  where: {
    email: {
      contains: '@oldomain.com',
    },
  },
  data: {
    email: {
      set: '', // อัพเดทด้วยค่าที่คำนวณ
    },
  },
})

/**
 * DELETE - ลบข้อมูล
 */

// ลบรายการเดียว
const deletedUser = await prisma.user.delete({
  where: { id: '123' },
})

// ลบหลายรายการ
const deleteMany = await prisma.user.deleteMany({
  where: {
    createdAt: {
      lt: new Date('2024-01-01'),
    },
  },
})
```

### Advanced Queries

```typescript
/**
 * การ Join ตาราง (Relations)
 */
const userWithPosts = await prisma.user.findUnique({
  where: { id: '123' },
  include: {
    posts: {
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    },
    profile: true,
  },
})

/**
 * Aggregation
 */
const stats = await prisma.post.aggregate({
  _count: true,
  _avg: { views: true },
  _sum: { views: true },
  _min: { createdAt: true },
  _max: { createdAt: true },
})

/**
 * Group By
 */
const postsByAuthor = await prisma.post.groupBy({
  by: ['authorId'],
  _count: {
    id: true,
  },
  _avg: {
    views: true,
  },
  having: {
    views: {
      _avg: {
        gt: 100,
      },
    },
  },
})

/**
 * Transaction
 */
const [user, post] = await prisma.$transaction([
  prisma.user.create({
    data: { name: 'John', email: 'john@example.com' },
  }),
  prisma.post.create({
    data: { title: 'First Post', content: 'Content' },
  }),
])

// Interactive Transaction
const result = await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({
    data: { name: 'John', email: 'john@example.com' },
  })

  const post = await tx.post.create({
    data: {
      title: 'First Post',
      content: 'Content',
      authorId: user.id,
    },
  })

  return { user, post }
})

/**
 * Raw SQL
 */
const users = await prisma.$queryRaw`
  SELECT * FROM User WHERE email LIKE ${'%@example.com'}
`

const result = await prisma.$executeRaw`
  UPDATE User SET name = ${'New Name'} WHERE id = ${'123'}
`
```

---

## 🎯 Best Practices

### 1. Environment Variables
```env
# Development
DATABASE_URL="sqlserver://localhost:1433;database=dev_db;user=sa;password=password;encrypt=true;trustServerCertificate=true"

# Production
DATABASE_URL="sqlserver://prod-server:1433;database=prod_db;user=produser;password=strongpassword;encrypt=true"
```

### 2. Error Handling
```typescript
import { Prisma } from '@prisma/client'

try {
  await prisma.user.create({ data: { email: 'test@test.com' } })
} catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002: Unique constraint violation
    if (error.code === 'P2002') {
      console.log('Email already exists')
    }
  }
  throw error
}
```

### 3. Connection Pooling
```typescript
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})
```

### 4. Soft Delete Pattern
```prisma
model User {
  id        String    @id @default(cuid())
  email     String    @unique
  name      String?
  deletedAt DateTime?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

```typescript
// Middleware สำหรับ Soft Delete
prisma.$use(async (params, next) => {
  if (params.model === 'User') {
    if (params.action === 'delete') {
      params.action = 'update'
      params.args['data'] = { deletedAt: new Date() }
    }
    if (params.action === 'findMany' || params.action === 'findFirst') {
      params.args.where = { ...params.args.where, deletedAt: null }
    }
  }
  return next(params)
})
```

---

## 📚 เอกสารอ้างอิง

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma SQL Server](https://www.prisma.io/docs/concepts/database-connectors/sql-server)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [Next.js + Prisma](https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices)

---

## ⚡ Quick Commands Reference

```bash
# Setup
npx prisma init                          # เริ่มต้นโปรเจค
npx prisma generate                      # สร้าง Prisma Client

# Database
npx prisma db pull                       # ดึง schema จาก DB
npx prisma db push                       # Push schema ไป DB

# Migrations
npx prisma migrate dev --name <name>     # สร้าง migration (dev)
npx prisma migrate deploy                # Deploy migrations (prod)
npx prisma migrate status                # ตรวจสอบสถานะ
npx prisma migrate reset                 # รีเซ็ต DB

# Tools
npx prisma studio                        # เปิด GUI
npx prisma format                        # จัดรูปแบบ schema
npx prisma validate                      # ตรวจสอบ schema
npx prisma version                       # เช็คเวอร์ชัน
```

---

**เวอร์ชัน:** Prisma 7.1.0  
**อัพเดทล่าสุด:** December 6, 2025
