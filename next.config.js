/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
      HOST_NAME: process.env.HOST_NAME,
      BASE_URL: process.env.BASE_URL,
      DATABASE_URL: process.env.DATABASE_URL,

      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,

      JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,

      SEED_ADMIN_LOGIN: process.env.SEED_ADMIN_LOGIN,
      SEED_ADMIN_PASSWORD: process.env.SEED_ADMIN_PASSWORD,

      ACCESS_KEY_AWS: process.env.ACCESS_KEY_AWS,
      SECRET_KEY_AWS: process.env.SECRET_KEY_AWS,
    },
}

module.exports = nextConfig
