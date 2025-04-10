import { Role } from 'src/common/enums/roles.enum';

export interface JwtPayload {
  sub: string;
  role: Role;
}
