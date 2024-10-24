declare namespace NodeJS {
  interface ProcessEnv {
    JWT_SECRET: string;
    PORT: number;
    DATABASE_NAME: string;
    JWT_EXPIRES_IN: string;
    JWT_COOKIE_EXPIRES_IN: number;
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
