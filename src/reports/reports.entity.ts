import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  AfterLoad,
  AfterRemove,
} from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column()
  mileage: number;

  @Column()
  longitude: number;

  @Column()
  latitude: number;

  @AfterInsert()
  logInsert() {
    console.log('Inserted report with id: ', this.id);
  }

  @AfterLoad()
  logLoad() {
    console.log('Loaded report with id: ', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated report with id: ', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed report with id: ', this.id);
  }
}
