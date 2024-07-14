/* eslint-disable prettier/prettier */
import * as dotenv from 'dotenv';
dotenv.config();
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
//import { ConfigService } from '@nestjs/config';
import { UserInfo } from 'src/models/userInfoModel';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY
,
    });

  }

  async validate(payload: UserInfo) {
    console.log({payload})
    return {
      id: payload.id,
      name: payload.name,
      role: payload.role,
    };
  }
}
