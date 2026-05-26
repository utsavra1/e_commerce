import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User.js";

@Entity()
export class Address {
    @PrimaryGeneratedColumn()
    address_id: number;

    @Column({ type: "varchar", length: 50 })
    label: string; // "Home", "Work", etc.

    @Column({ type: "varchar", length: 100 })
    province: string;

    @Column({ type: "varchar", length: 100 })
    district: string;

    @Column({ type: "varchar", length: 100 })
    city: string;

    @Column({ type: "varchar", length: 255 })
    street_address: string;

    @ManyToOne(() => User, (user) => user.user_id)
    user: User;
}
