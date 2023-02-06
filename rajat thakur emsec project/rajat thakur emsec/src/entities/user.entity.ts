import {
  Entity,
  Column,
  Unique,
  BeforeInsert,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
} from "typeorm";
import * as bcrypt from "bcryptjs";
import { Exclude } from "class-transformer";
import { Event } from "./event.entity";

enum genderType {
  male = "male",
  female = "female",
  trans = "trans",
}

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Unique("email", ["email"])
  @Column({ length: 320, nullable: false })
  email: string;

  @Exclude()
  @Column({ nullable: false })
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    type: "enum",
    enum: ["male", "female"],
    default: "male",
  })
  gender: genderType;

  @OneToMany(() => Event, (event) => event.user, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    eager: true,
    cascade: true,
  })
  @JoinColumn({ name: "events" })
  events: Event[];

  @BeforeInsert()
  async hashPassword() {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
