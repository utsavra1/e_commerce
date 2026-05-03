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

    @Column()
    username: string;

    @Column({
        type: "varchar",
        length: 150,
        unique: true
    })
    email: string;

    @Column()
    password: string;

    @Column({
        type: "varchar",
        unique: true
    })
    phone: string;

    @Column({
        type: "date"
    })
    dob: number;

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