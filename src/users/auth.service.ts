import { Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    const users = await this.usersService.find(email);
    if (users.length !== 0) throw new Error('Email is already in use');

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const formattedHash = salt + '.' + hash.toString('hex');

    return this.usersService.create(email, formattedHash);
  }

  async signIn(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) throw new Error('Wrong email or password');

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (hash.toString('hex') !== storedHash)
      throw new Error('Wrong email or password');

    return user;
  }
}
