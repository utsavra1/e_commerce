import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany,  } from "typeorm"; 
import type { User } from "./User.js";
import { Cartitem } from "./Cartitem.js";

@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    cart_id: number;

    @OneToOne("User")
    @JoinColumn()
    user: User;

    @OneToMany(() => Cartitem, (cartitem) => cartitem.cart)
    cartitem: Cartitem[];
}