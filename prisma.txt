npm install ts-node -D

package.json:
"scripts": {
    "build": "qwik build",
    "build.client": "vite build",
    "build.preview": "vite build --ssr src/entry.preview.tsx",
    "build.types": "tsc --incremental --noEmit",
    "deploy": "echo 'Run \"npm run qwik add\" to install a server adapter'",
    "dev": "vite --mode ssr",
    "dev.debug": "node --inspect-brk ./node_modules/vite/bin/vite.js --mode ssr --force",
    "fmt": "prettier --write .",
    "fmt.check": "prettier --check .",
    "lint": "eslint \"src/**/*.ts*\"",
    "postinstall": "prisma generate",
    "preview": "qwik build preview && vite preview --open",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:migrate:prod": "prisma migrate deploy",
    "start": "vite --open --mode ssr",
    "qwik": "qwik"
  },
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  },

D:\myProj\React\qwik-voting> npx prisma migrate dev
Environment variables loaded from .env
Prisma schema loaded from prisma\schema.prisma
Datasource "db": SQLite database "dev.db" at "file:./dev.db"

SQLite database dev.db created at file:./dev.db

√ Enter a name for the new migration: ... init
Applying migration `20230504023946_init`

The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20230504023946_init/
    └─ migration.sql

Your database is now in sync with your schema.

✔ Generated Prisma Client (4.13.0 | library) to .\node_modules\@prisma\client in 109ms


PS D:\myProj\React\qwik-voting> npx prisma generate
Environment variables loaded from .env
Prisma schema loaded from prisma\schema.prisma

✔ Generated Prisma Client (4.13.0 | library) to .\node_modules\@prisma\client in 68ms
You can now start using Prisma Client in your code. Reference: https://pris.ly/d/client
```
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
```
PS D:\myProj\React\qwik-voting> npx prisma studio
Environment variables loaded from .env
Prisma schema loaded from prisma\schema.prisma
Prisma Studio is up on http://localhost:5555

npx prisma migrate reset
Environment variables loaded from .env
Prisma schema loaded from prisma\schema.prisma
Datasource "db": SQLite database "dev.db" at "file:./dev.db"

√ Are you sure you want to reset your database? All data will be lost. ... yes

Applying migration `20230504023946_init`

Database reset successful

The following migration(s) have been applied:

migrations/
  └─ 20230504023946_init/
    └─ migration.sql

✔ Generated Prisma Client (4.13.0 | library) to .\node_modules\@prisma\client in 66ms

Running seed command `ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts` ...

The seed command has been executed.
