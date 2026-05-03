import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, OneToMany, CreateDateColumn } from "typeorm";
import type { Order } from "./Order.js";
import type { Product } from "./Product.js";
@Entity()
export class Orderitem{
    @PrimaryGeneratedColumn()
    order_item_id: number;

    @Column({
        type: "decimal"
    })
    price: number;

    @Column()
    quantity: number;
    
    @ManyToOne("Order", (order: Order) => order.orderitem)
    order: Order;

    @ManyToOne("Product", (product: Product) => product.orderitem)
    product: Product;
}