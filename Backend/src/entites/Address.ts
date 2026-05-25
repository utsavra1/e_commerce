import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User.js";

@Entity()
export class Address {
    @PrimaryGeneratedColumn()
    address_id: number;

    @Column()
    label: string; // "Home", "Work", etc.

    @Column()
    province: string;

    @Column()
    district: string;

    @Column()
    city: string;

    @Column()
    street_address: string;

    @ManyToOne(() => User, (user) => user.user_id)
    user: User;
}
