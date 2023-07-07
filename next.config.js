/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
      DATABASE_URL: process.env.DATABASE_URL,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
      NODEMAILER_HOST: process.env.NODEMAILER_HOST,
      NODEMAILER_PORT: process.env.NODEMAILER_PORT,
      NODEMAILER_USER: process.env.NODEMAILER_USER,
      NODEMAILER_PASSWORD: process.env.NODEMAILER_PASSWORD,
      SEED_ADMIN_LOGIN: process.env.SEED_ADMIN_LOGIN,
      SEED_ADMIN_PASSWORD: process.env.SEED_ADMIN_PASSWORD,
    },
}

module.exports = nextConfig
