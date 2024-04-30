import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

type JwtPayload = {
  sub: string;
  email: string;
  userId: number;
};

export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET,
      passReqToCallback: true,
    });
  }

  validate(req: any, payload: JwtPayload) {
    const accessToken = req.get('Authorization').replace('Bearer', '').trim();
    console.log(accessToken);

    return { ...payload, accessToken };
  }
}
