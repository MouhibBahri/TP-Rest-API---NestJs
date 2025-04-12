import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { Next } from 'mysql2/typings/mysql/lib/parsers/typeCast';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader=req.headers['auth-user'];
    if(!authHeader) {
      return res.status(401).json({message:'Unauthorized'});
    }
    try{
      const token=Array.isArray(authHeader)?authHeader[0]: authHeader;
      const jwtSecret='Banana'; 
      if(!jwtSecret) {
        return res.status(500).json({message:'Server configuration error'});
      }
      const decodedToken=verify(token,'Banana');
      if(decodedToken && decodedToken['userId']){
        req['userId']=decodedToken['userId'];
        next();
      }else{
        return res.status(401).json({message:'invalid token : userId not found'});

      }
    }catch(e){
      return res.status(401).json({message:'vous ne pouvez pas acceder a la ressource'});

    }
  }
}