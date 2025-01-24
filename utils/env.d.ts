declare namespace NodeJS {
  interface ProcessEnv {
    JWT_SECRET: string;
    PORT: number;

    DATABASE_STRING_CONNECTION: string;
    DATABASE_NAME: string;
    DATABASE_USER_NAME: string;
    DATABASE_PASSWORD: string;

    JWT_EXPIRES_IN: string;
    JWT_COOKIE_EXPIRES_IN: number;
    EMAIL_FROM: string;
    EMAIL_PASSWORD: string;
    NODE_ENV: string;
  }
}

declare namespace Express {
  export interface Request {
    user?: any; // O define el tipo exacto del usuario si lo tienes
    file?: any;
    enterprise?: any;
  }
}
