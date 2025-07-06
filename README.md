---

# 🚀 Next.js Fullstack Boilerplate

Boilerplate ini menggunakan Next.js dengan dukungan fullstack, built-in auth, TypeScript, dan Drizzle ORM untuk integrasi database PostgreSQL. Package manager yang digunakan adalah `pnpm`.

## 📦 Requirements

- **Node.js**: `v20.17.0`  
- **pnpm**: `v9.9.0`

---

## 🛠️ Instalasi

### 🧲 Clone Repository

```bash
git clone
cd
```

### 📦 Install Dependencies

```bash
pnpm install
```

### ⚙️ Setup Environment

Salin file `.env.example` dan ubah namanya menjadi `.env`:

```bash
cp .env.example .env
```

Kemudian **generate nilai-nilai environment variable BETTER_AUTH_SECRET** menggunakan panduan dari:

👉 [https://www.better-auth.com/docs/installation](https://www.better-auth.com/docs/installation)

Setelah itu **paste PostgreSQL URL** kamu ke `.env`:

```env
POSTGRES_URL=postgresql://username:password@host:port/database
```

---

## ⚙️ Integrasi Backend dengan Drizzle ORM

Langkah-langkah untuk menambahkan model dan integrasi database:

### ➕ Tambah Model Baru

Buat file baru di folder `_server/model/*.ts`.  
Contoh: `_server/model/people.ts`

```ts
import { pgTable, text, varchar } from 'drizzle-orm/pg-core'

const people = pgTable('people', {
  guid: text('guid')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  first_name: varchar('first_name', { length: 255 }).notNull(),
  last_name: varchar('last_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 255 }).notNull(),
  address: varchar('address', { length: 255 }).notNull(),
  city: varchar('city', { length: 255 }).notNull(),
  state: varchar('state', { length: 255 }).notNull(),
  country: varchar('country', { length: 255 }).notNull(),
  zip: varchar('zip', { length: 255 }).notNull(),
})

export { people }
```

### 📌 Registrasi Model

Edit file `_server/db.ts`:

```ts
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import dotenv from 'dotenv'

import { checkEnvVariables } from './lib/envChecker'
import * as peoples from './model/people'

dotenv.config()
checkEnvVariables()

export const client = postgres(process.env.POSTGRES_URL as string)
export const db = drizzle(client, {
  schema: {
    ...peoples,
  },
})
```

### 🛠️ Generate Migrasi

```bash
pnpm db:generate
```

### 🚀 Jalankan Migrasi ke PostgreSQL

```bash
pnpm db:migrate
```

---

## 🚧 Menjalankan Proyek

### 💻 Development

```bash
pnpm dev
```

Akses di: [http://localhost:3000](http://localhost:3000)

### 🛠️ Build untuk Produksi

```bash
pnpm build
```

### 🚀 Start Aplikasi (Produksi)

```bash
pnpm start
```

---
# POS-OTP-WACHYU
