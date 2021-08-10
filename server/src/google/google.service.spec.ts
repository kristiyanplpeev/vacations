import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../model/user.entity';
import { GoogleController } from './google.controller';
import { GoogleService } from './google.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

describe('GoogleService', () => {
  let service: GoogleService;

  const mockUser = {
    user: {
      id: '749da264-0641-4d80-b6be-fe1c38ae2f93',
      googleId: '106956791077954804246',
      email: 'kristiyan.peev@atscale.com',
      firstName: 'Kristiyan',
      lastName: 'Peev',
      picture:
        'https://lh3.googleusercontent.com/a-/AOh14Gi-slkOaKm_iev-o1xIbJGHLfsP65VslZm1JyJh=s96-c',
    },
  };

  const mockUserRepository = {
    findOne: jest.fn((something) => Promise.resolve(mockUser.user)),
    create: jest.fn((something) => Promise.resolve(undefined)),
    save: jest.fn((something) => Promise.resolve(mockUser.user)),
  };

  const mockJWTRepository = {
    sign: jest.fn((payload) => 'token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secretOrPrivateKey: process.env.SECRETKEY || 'secretKey',
        }),
      ],
      controllers: [GoogleController],
      providers: [
        GoogleService,
        JwtStrategy,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<GoogleService>(GoogleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return info about user', async () => {
      const spy = jest.spyOn(service, 'validateUser');
      const result = await service.validateUser(mockUser.user);
      expect(spy).toHaveBeenCalled();
      expect(result).toEqual(mockUser.user);
    });
  });
  describe('createUser', () => {
    it('should return info about user', async () => {
      const spy = jest.spyOn(service, 'createUser');
      const result = await service.createUser(mockUser.user);
      expect(spy).toHaveBeenCalled();
      expect(result).toEqual(mockUser.user);
    });
  });
  describe('findUser', () => {
    it('should return info about user', async () => {
      const spy = jest.spyOn(service, 'findUser');
      const result = await service.findUser(mockUser.user.googleId);
      expect(spy).toHaveBeenCalled();
      expect(result).toEqual(mockUser.user);
    });
  });
  describe('login', () => {
    it('should return access token', () => {
      const spy = jest.spyOn(service, 'login');
      const result = service.login(mockUser.user);
      expect(spy).toHaveBeenCalled();
      expect(result).toHaveProperty('access_token');
    });
  });
});
