import "reflect-metadata";
import { DataSource } from "typeorm";
import { User, Role } from "./entites/User.js";
import { Categories } from "./entites/Categories.js";
import { Subcategory } from "./entites/Subcategory.js";
import { Product } from "./entites/Product.js";
import { Cart } from "./entites/Cart.js";
import { Cartitem } from "./entites/Cartitem.js";
import { Order } from "./entites/Order.js";
import { Orderitem } from "./entites/Orderitem.js";
import { Review } from "./entites/Review.js";
import { Poster } from "./entites/Poster.js";
import { Address } from "./entites/Address.js";
import { env } from './config/env.ts';
import bcrypt from 'bcrypt';

const AppDataSource = new DataSource({
    type: "postgres",
    ...(env.db.url ? { url: env.db.url } : {
        host: env.db.host,
        port: env.db.port,
        username: env.db.username,
        password: env.db.password,
        database: env.db.name,
    }),
    ssl: env.db.url ? { rejectUnauthorized: false } : false,
    entities: [User, Categories, Subcategory, Product, Cart, Cartitem, Order, Orderitem, Review, Poster, Address],
    synchronize: false,
    logging: false
});

async function seed() {
    try {
        await AppDataSource.initialize();
        console.log("Database initialized for seeding...");

        // Drop and recreate schema to handle column changes cleanly
        await AppDataSource.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
        await AppDataSource.query('GRANT ALL ON SCHEMA public TO public;');
        console.log("Database schema reset.");

        // Re-synchronize schema now that it's clean
        await AppDataSource.synchronize();
        console.log("Database schema synchronized.");

        const catRepo = AppDataSource.getRepository(Categories);
        const electronics = catRepo.create({ category_name: "Electronics" });
        const clothing = catRepo.create({ category_name: "Clothing" });
        await catRepo.save([electronics, clothing]);
        console.log("Categories seeded.");

        const subRepo = AppDataSource.getRepository(Subcategory);
        const smartphones = subRepo.create({ subcategory_name: "Smartphones", categories: electronics });
        const laptops = subRepo.create({ subcategory_name: "Laptops", categories: electronics });
        const tshirts = subRepo.create({ subcategory_name: "T-Shirts", categories: clothing });
        await subRepo.save([smartphones, laptops, tshirts]);
        console.log("Subcategories seeded.");

        const prodRepo = AppDataSource.getRepository(Product);
        const iphone = prodRepo.create({
            product_name: "iPhone 15",
            product_description: "Latest Apple smartphone",
            product_price: 999.99,
            stock: 50,
            subcategory: smartphones
        });
        const macbook = prodRepo.create({
            product_name: "MacBook Pro",
            product_description: "Powerful laptop for pros",
            product_price: 1999.99,
            stock: 30,
            subcategory: laptops
        });
        await prodRepo.save([iphone, macbook]);
        console.log("Products seeded.");

        const userRepo = AppDataSource.getRepository(User);
        const hashedPassword = await bcrypt.hash("test123", 10);

        const adminUser = userRepo.create({
            username: "Admin",
            email: "admin@gmail.com",
            password: hashedPassword,
            phone: "9800000000",
            dob: "1990-01-01" as any,
            role: Role.ADMIN,
            is_verified: true
        });

        const regularUser = userRepo.create({
            username: "Utsav",
            email: "Utsavrail15@gmail.com",
            password: hashedPassword,
            phone: "9811111111",
            dob: "1995-01-01" as any,
            role: Role.USER,
            is_verified: true
        });

        await userRepo.save([adminUser, regularUser]);
        console.log("Admin and User accounts seeded.");

        const cartRepo = AppDataSource.getRepository(Cart);
        const cart = cartRepo.create({ user: regularUser });
        await cartRepo.save(cart);
        console.log("Cart seeded.");

        const cartItemRepo = AppDataSource.getRepository(Cartitem);
        const item1 = cartItemRepo.create({ cart: cart, product: iphone, quantity: 1 });
        await cartItemRepo.save(item1);
        console.log("CartItems seeded.");

        const orderRepo = AppDataSource.getRepository(Order);
        const order = orderRepo.create({
            user: regularUser,
            order_description: "First order",
            total_amount: 999.99,
            order_date: new Date() as any
        });
        await orderRepo.save(order);
        console.log("Order seeded.");

        const orderItemRepo = AppDataSource.getRepository(Orderitem);
        const oItem1 = orderItemRepo.create({
            order: order,
            product: iphone,
            quantity: 1,
            price: 999.99
        });
        await orderItemRepo.save(oItem1);
        console.log("OrderItems seeded.");

        const reviewRepo = AppDataSource.getRepository(Review);
        const review = reviewRepo.create({
            user: regularUser,
            product: iphone,
            rating: 5,
            comments: "Amazing phone!"
        });
        await reviewRepo.save(review);
        console.log("Reviews seeded.");

        console.log("Seeding completed successfully!");
    } catch (error) {
        console.error("Error during seeding:", error);
    } finally {
        await AppDataSource.destroy();
    }
}

seed();
