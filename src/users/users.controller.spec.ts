import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './users.entity';
import exp from 'constants';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: string) =>
        Promise.resolve({
          id,
          email: 'test@test.com',
          password: '123',
        } as unknown as User),
    };
    fakeAuthService = {
      signIn: (email: string, password: string) =>
        Promise.resolve({ id: '1', email, password } as unknown as User),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    it('should return found user', async () => {
      const user = await controller.findOne('1');
      expect(user).toBeDefined();
    });

    it('throws if user is not found', (done) => {
      fakeUsersService.findOne = () => Promise.resolve(null);
      controller
        .findOne('1')
        .then()
        .catch(() => done());
    });
  });

  describe('signIn', () => {
    it('should set session and return user', async () => {
      const session = { userId: null };
      const user = await controller.signIn(
        { email: 'test@test.com', password: '123' },
        session,
      );

      expect(user).toBeDefined();
      expect(session.userId).toEqual(user.id);
    });

    it('throws when incorrect credentials are provided', (done) => {
      fakeAuthService.signIn = () => Promise.reject();
      controller
        .signIn({ email: 'test@test.com', password: '123' }, {})
        .then()
        .catch(() => done());
    });
  });
});
