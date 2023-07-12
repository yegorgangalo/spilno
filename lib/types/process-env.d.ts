declare namespace NodeJS {
    export interface ProcessEnv {
      HOST_NAME: string
      BASE_URL: string
      DATABASE_URL: string
      NEXTAUTH_SECRET: string
      NEXTAUTH_URL: string
      JWT_SECRET_KEY: string
      SEED_ADMIN_LOGIN: string
      SEED_ADMIN_PASSWORD: string
      ACCESS_KEY_AWS: string
      SECRET_KEY_AWS: string
    }
}
