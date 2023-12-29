import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './users.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    fakeUsersService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as unknown as User),
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('create user with salted and hashed password', async () => {
      const user = await service.signup('test@test.com', '123');
      const [salt, hash] = user.password.split('.');

      expect(user.password).not.toEqual('123');
      expect(salt).toBeDefined();
      expect(hash).toBeDefined();
    });

    it('throws if the email is already in use', (done) => {
      fakeUsersService.find = () =>
        Promise.resolve([
          {
            id: '1',
            email: 'test@test.com',
            password: '123',
          } as unknown as User,
        ]);

      service
        .signup('test@test.com', '123')
        .then()
        .catch(() => done());
    });
  });
});
