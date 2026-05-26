import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, serialize, OneToMany, ManyToOne } from "typeorm";
import { Cart } from "./Cart.js";
import type { Product } from "./Product.js";

@Entity()
export class Cartitem{
    @PrimaryGeneratedColumn()
    cart_item_id: number;

    @Column({
        type: "int"
    })
    quantity: number;

    @ManyToOne(() => Cart, (cart) => cart.cartitem)
    cart: Cart;

    @ManyToOne("Product", (product: Product) => product.cartitem)
    product: Product;

}