import { SetMetadata } from '@nestjs/common';
import { RolesEnum } from '../../common/constants';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Array<RolesEnum>) => SetMetadata(ROLES_KEY, roles);