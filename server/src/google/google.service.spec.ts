import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Userdb } from '../model/user.entity';
import { GoogleController } from './google.controller';
import { GoogleService } from './google.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { mockedUser, userFromdb } from '../common/holidaysMockedData';

describe('GoogleService', () => {
  let service: GoogleService;

  const mockUserRepository = {
    findOne: jest.fn(() => Promise.resolve(userFromdb(mockedUser))),
    create: jest.fn(() => Promise.resolve(undefined)),
    save: jest.fn(() => Promise.resolve(userFromdb(mockedUser))),
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
          provide: getRepositoryToken(Userdb),
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
      const result = await service.validateUser(mockedUser);
      expect(spy).toHaveBeenCalled();
      expect(result).toEqual(mockedUser);
    });
  });
  describe('createUser', () => {
    it('should return info about user', async () => {
      const spy = jest.spyOn(service, 'createUser');
      const result = await service.createUser(mockedUser);
      expect(spy).toHaveBeenCalled();
      expect(result).toEqual(mockedUser);
    });
  });
  describe('login', () => {
    it('should return access token', () => {
      const spy = jest.spyOn(service, 'login');
      const result = service.login(mockedUser);
      expect(spy).toHaveBeenCalled();
      expect(result).toHaveProperty('access_token');
    });
  });
});
