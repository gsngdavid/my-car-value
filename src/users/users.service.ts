import { Injectable } from '@nestjs/common';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }

  findOne(id: string) {
    if (!id) throw new Error('User not found');
    return this.repo.findOne({ where: { id } });
  }

  find(email: string) {
    return this.repo.find({ where: { email } });
  }

  async updated(id: string, updates: Partial<User>) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new Error('Not user found!');

    Object.assign(user, updates);
    return this.repo.save(user);
  }

  async remove(id: string) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new Error('User not found!');

    return this.repo.remove(user);
  }
}
