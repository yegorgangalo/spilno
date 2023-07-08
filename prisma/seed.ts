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

        // const html = `<p>Login: gangaloyegor@gmail.com</br>Password: Spilno2023</p>`

        // const isSentEmail = await sendMail({ subject: 'Дані для входу в Спільно. Unicef', toEmail: 'gangaloyegor@gmail.com', html })

        const data = {
            manager: { ...manager, email: managerAccount.email, /* isSentEmail */ },
        }
        return { data }
    })

    console.log('seed transaction=', transaction);

    // const alice = await prisma.account.upsert({
    //   where: { email: 'alice@prisma.io' },
    //   update: {},
    //   create: {
    //     email: 'alice@prisma.io',
    //     name: 'Alice',
    //     posts: {
    //       create: {
    //         title: 'Check out Prisma with Next.js',
    //         content: 'https://www.prisma.io/nextjs',
    //         published: true,
    //       },
    //     },
    //   },
    // })

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