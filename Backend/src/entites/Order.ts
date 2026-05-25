import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, OneToMany, CreateDateColumn } from "typeorm";
import type { User } from "./User.js";
import { Orderitem } from "./Orderitem.js";
@Entity()
export class Order{
    @PrimaryGeneratedColumn()
    order_id: number;

    @CreateDateColumn({
        type: "date", 
    })
    order_date: number;

    @Column({
        type: "varchar",
        length: 200
    })
    order_description: string;

    @Column({
        type: "decimal"
    })
    total_amount: number;

    @Column({ type: "varchar", nullable: true })
    province: string;

    @Column({ type: "varchar", nullable: true })
    district: string;

    @Column({ type: "varchar", nullable: true })
    city: string;

    @Column({ type: "varchar", nullable: true })
    street_address: string; 

    @ManyToOne("User", (user: User) => user.order)
    user: User;

    @OneToMany(() => Orderitem, (orderitem) => orderitem.order)
    orderitem: Orderitem[];

    @Column({
    type: "enum",
    enum: ["pending", "paid", "failed"],
    default: "pending"
    })
    payment_status: string;

    @Column({
        type: "varchar",
        nullable: true
    })
    transaction_uuid: string;

   
    @Column({ type: 'enum', enum: ['esewa', 'cod'], default: 'esewa' })
    payment_method: string;
}