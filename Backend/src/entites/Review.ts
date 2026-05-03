import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import type { User } from "./User.js";
import type { Product } from "./Product.js";
@Entity()
export class Review{
    @PrimaryGeneratedColumn()
    review_id: number;

    @Column()
    rating: number;

    @Column({
        type: "varchar",
        length: 200
    })
    comments: string;

    @ManyToOne("User", (user: User) => user.review)
    user: User;

    @ManyToOne("Product", (product: Product) => product.review)
    product: Product;
    
}