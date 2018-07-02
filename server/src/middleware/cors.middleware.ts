// @ts-ignore
import { Injectable, NestMiddleware, ExpressMiddleware } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  // @ts-ignore
  resolve(): ExpressMiddleware {
    return (req: Request, res, _next) => {
      res.header('Access-Control-Allow-Origin', req.header('Origin'));
      res.header('Access-Control-Allow-Headers', 'content-type');
      res.header('Access-Control-Allow-Methods', 'POST');

      // Feel free to ddos this ;)
    };
  }
}
