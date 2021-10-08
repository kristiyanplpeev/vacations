import { Test, TestingModule } from '@nestjs/testing';
import { GoogleService } from './google.service';
import { GoogleController } from './google.controller';
import { mockedUser } from '../common/holidaysMockedData';

describe('GoogleController', () => {
  let controller: GoogleController;

  const mockUser = {
    user: mockedUser,
  };
  const mockGoogleService = {
    validateUser: jest.fn((user) => Promise.resolve(user)),
    login: jest.fn((user) => ({
      access_token: 'token',
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoogleController],
      providers: [GoogleService],
    })
      .overrideProvider(GoogleService)
      .useValue(mockGoogleService)
      .compile();

    controller = module.get<GoogleController>(GoogleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('googleAuthRedirect', () => {
    it('should return user details', async () => {
      const result = await controller.googleAuthRedirect(mockUser);
      expect(result).toEqual(mockUser.user);
    });
  });
  describe('loggedUserInfo', () => {
    it('should return acess token', () => {
      const result = controller.loggedUserInfo(mockUser);
      expect(result).toHaveProperty('access_token');
    });
  });
});
