// middleware/auth.ts
import { NextResponse } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';

export function verifyToken(request: Request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    
    if (!token) {
      return { isValid: false };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return {
      isValid: true,
      userId: (decoded as JwtPayload)?.userId
    };
  } catch (error) {
    return { isValid: false };
  }
}