import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import {Order} from './Order.js'
import { Review } from "./Review.js";

export enum Role{
    ADMIN = "admin",
    USER = "user"
}
@Entity()
export class User{
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column({
        type: "varchar",
        length: 255
    })
    username: string;

    @Column({
        type: "varchar",
        length: 150,
        unique: true
    })
    email: string;

    @Column({
        type: "varchar",
        length: 255
    })
    password: string;

    @Column({
        type: "varchar",
        unique: true
    })
    phone: string;

    @Column({
        type: "date"
    })
    dob: string;

    @Column({ 
        type: "boolean",
        default: false 
    })
    is_verified: boolean;

    @Column({ type: "varchar", nullable: true })
    otp: string | null;

    @Column({ type: "timestamp", nullable: true })
    otp_expiry: Date | null;

   @CreateDateColumn()
    created_at: number;

    @Column({
        type: "enum",
        enum: Role,
        default: Role.USER
    })
    role: Role

    @OneToMany(() => Order, (order) => order.user)
    order: Order[];

    @OneToMany(() => Review, (review) => review.user)
    review: Review[];
}