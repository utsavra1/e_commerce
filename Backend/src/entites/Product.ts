import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import type { Subcategory } from "./Subcategory.js";
import { Cartitem } from "./Cartitem.js";
import type { Order } from "./Order.js";
import { Orderitem } from "./Orderitem.js";
import { Review } from "./Review.js";
import type { Poster } from "./Poster.ts";

@Entity()
export class Product{
    @PrimaryGeneratedColumn()
    product_id: number;

    @Column({
        type: "varchar",
        length: 100
    })
    product_name: string;

    @Column({
        type: "varchar",
        length: 200
    })
    product_description: string;

    @Column({
        type: "decimal"
    })
    product_price: number;

    @Column()
    stock: number;

    @ManyToOne("Subcategory", (subcategory: Subcategory) => subcategory.product)
    subcategory: Subcategory;

    @OneToMany(() => Cartitem, (cartitem) => cartitem.product)
    cartitem: Cartitem[];

    @OneToMany(() => Orderitem, (orderitem) => orderitem.product)
    orderitem: Orderitem[];

    @OneToMany(() => Review, (review) => review.product)
    review: Review[];

    @OneToMany("Poster", (poster: Poster) => poster.product)
    posters: Poster[];


}