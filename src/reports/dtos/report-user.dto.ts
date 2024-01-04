import { Expose, Transform } from 'class-transformer';
import { User } from 'src/users/users.entity';

export class ReportUserDto {
  @Expose()
  id: number;
  @Expose()
  make: string;
  @Expose()
  model: string;
  @Expose()
  year: number;
  @Expose()
  mileage: number;
  @Expose()
  longitude: number;
  @Expose()
  latitude: number;
  @Expose()
  price: number;
  @Expose()
  approved: boolean;

  @Transform(({ obj }) => ({
    id: obj.userId,
    email: obj.email,
    password: obj.password,
    admin: obj.admin,
  }))
  @Expose()
  user: User;
}
