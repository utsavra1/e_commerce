import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import type { Product } from "./Product.ts";

@Entity()
export class Poster {
    @PrimaryGeneratedColumn()
    poster_id: number;

    @Column({
        type: "varchar",
        length: 255
    })
    url: string;

    @Column({
        type: "boolean",
        default: false
    })
    is_main: boolean;

    @ManyToOne("Product", (product: Product) => product.posters)
    product: Product;
}
