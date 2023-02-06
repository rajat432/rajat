import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Event extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text")
  name: string;

  @Column({ type: "mediumtext" })
  description: string;

  @Column()
  location: string;

  @Column("datetime")
  date: Date;

  @Column("datetime")
  startTime: Date;

  @Column("datetime")
  endTime: Date;

  @Column({ default: 0 })
  price: number;

  @Column()
  maxSeats: number;

  @ManyToOne(() => User, (user) => user.events, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
