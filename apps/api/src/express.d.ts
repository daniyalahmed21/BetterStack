declare namespace Express {
    export interface Request {
      userId?: string;
      session?: any;
    }
 }