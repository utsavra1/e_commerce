import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, serialize, ManyToOne, OneToMany } from "typeorm";
import type { Categories } from "./Categories.js";
import { Product } from "./Product.js";

@Entity()
export class Subcategory{
    @PrimaryGeneratedColumn()
    subcategory_id: number;

    @Column({
        type: "varchar",
        length: 255
    })
    subcategory_name: string;

    @ManyToOne("Categories", (categories: Categories) => categories.subcategories)
    categories: Categories;

    @OneToMany(() => Product, (product) => product.subcategory)
    product: Product[];

}