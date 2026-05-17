import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, serialize, OneToMany } from "typeorm";
import { Subcategory } from "./Subcategory.js";

@Entity()
export class Categories{
    @PrimaryGeneratedColumn()
    category_id: number;

    @Column({
        type: "varchar",
        length: 100
    })
    category_name: string;

    @OneToMany(() => Subcategory, (subcategory) => subcategory.categories)
    subcategories: Subcategory[];

}