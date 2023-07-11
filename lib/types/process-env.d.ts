declare namespace NodeJS {
    export interface ProcessEnv {
      BASE_URL: string
      DATABASE_URL: string
      NEXTAUTH_SECRET: string
      NEXTAUTH_URL: string
      JWT_SECRET_KEY: string
      NODEMAILER_HOST: string
      NODEMAILER_PORT: string
      NODEMAILER_USER: string
      NODEMAILER_PASSWORD: string
      SEED_ADMIN_LOGIN: string
      SEED_ADMIN_PASSWORD: string
      ACCESS_KEY_AWS: string
      SECRET_KEY_AWS: string
    }
}
