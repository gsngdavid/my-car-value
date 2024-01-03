import { Report } from 'src/reports/reports.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  BeforeRemove,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  admin: boolean;

  // =============== Relationships ================

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  // ================== Hooks =======================

  @AfterInsert()
  logInsert() {
    console.log('Inserted a user with id: ', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated a user with id: ', this.id);
  }

  @BeforeRemove()
  logRemove() {
    console.log('Removed a user with id: ', this.id);
  }
}
