import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  BeforeRemove,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

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
