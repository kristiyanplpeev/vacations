import { Test, TestingModule } from '@nestjs/testing';
import { GoogleService } from './google.service';
import { GoogleController } from './google.controller';

describe('GoogleController', () => {
  let controller: GoogleController;

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
      const spy = jest.spyOn(controller, 'googleAuthRedirect');
      const result = await controller.googleAuthRedirect(mockUser);
      expect(spy).toHaveBeenCalled();
      expect(result).toEqual(mockUser.user);
    });
  });
  describe('loggedUserInfo', () => {
    it('should return acess token', () => {
      const spy = jest.spyOn(controller, 'loggedUserInfo');
      const result = controller.loggedUserInfo(mockUser);
      expect(spy).toHaveBeenCalled();
      expect(result).toHaveProperty('access_token');
    });
  });
});
