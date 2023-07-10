const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

const SALT_ROUNDS = 6

const bcryptPassword = (password: string) => {
    return bcrypt.hash(password, SALT_ROUNDS)
  }

async function runSeedDb() {
    const transaction = await prisma.$transaction(async (ctx: typeof PrismaClient) => {
        const managerAccount = await ctx.account.create({
            data: {
                email: process.env.SEED_ADMIN_LOGIN as string,
                password: await bcryptPassword(process.env.SEED_ADMIN_PASSWORD as string),
                role: 'ADMIN',
            }
        })

        const manager = await ctx.manager.create({
            data: {
                firstName: 'Микола',
                lastName: 'Mихальчук',
                phone: '+380636004135',
                location: 'Київ',
                isActive: true,
                accountId: managerAccount.id,
            }
        })

        const data = {
            manager: { ...manager, email: managerAccount.email },
        }
        return { data }
    })

    console.log('seed transaction=', transaction);
  }
  runSeedDb()
    .then(async () => {
      await prisma.$disconnect()
    })
    .catch(async (e) => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
    })