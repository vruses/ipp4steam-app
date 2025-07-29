import { PrismaClient } from '@prisma/client'

// const { PrismaClient } = await import('@main/generated/prisma')

const prisma = new PrismaClient()

async function foo() {
  // ... you will write your Prisma Client queries here
  const user = await prisma.user.findMany()
  console.log(user)
}

export function main() {
  foo()
    .then(async () => {
      await prisma.$disconnect()
    })
    .catch(async (e) => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
    })
}
