import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken';

import authConfig from '@config/auth'
import AppError from '@shared/errors/AppError'

interface TokenPayload {
  iat: string;
  exp: string;
  sub: string;
}

export default function ensureAuthenticated(request: Request, response: Response, next: NextFunction): void {
  //Validaçao do token JWT

  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT token is missing!', 401);
  }

  // Bearer iklsfujgdhkbsfd

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret)

    const { sub } = decoded as TokenPayload;

    request.user = {
      id: sub,
    }

    return next();
  } catch {
    throw new AppError("Invalid JWT token", 401)
  }
}
