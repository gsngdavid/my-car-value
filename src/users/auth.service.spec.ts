import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './users.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  const users: User[] = [];

  beforeEach(async () => {
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = { id: new Date().toISOString(), email, password } as User;
        users.push(user);
        return Promise.resolve(user);
      },
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
      const user = await service.signup('signup@test.com', '123');
      const [salt, hash] = user.password.split('.');

      expect(user.password).not.toEqual('123');
      expect(salt).toBeDefined();
      expect(hash).toBeDefined();
    });

    it('throws if the email is already in use', (done) => {
      // This should work fine for the first time signing up with signup2@test.com
      service.signup('signup2@test.com', '123').then(() => {
        // This should throw since the email is now already in use
        service
          .signup('signup2@test.com', '123')
          .then()
          .catch(() => done());
      });
    });
  });

  describe('signIn', () => {
    it('throws if the user is not found', (done) => {
      service
        .signIn('404@test.com', '123')
        .then((user) => console.log(user))
        .catch(() => done());
    });

    it('throws if incorrect password is provided', (done) => {
      service.signup('incorrectPassword@test.com', '123').then(() => {
        service
          .signIn('incorrectPassword@test.com', '12345')
          .then()
          .catch(() => done());
      });
    });

    it('should return a user if a correct password is provided', async () => {
      await service.signup('correctPassword@test.com', '123');

      const user = await service.signIn('correctPassword@test.com', '123');
      expect(user).toBeDefined();
    });
  });
});
