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

const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5433,
    username: "postgres",
    password: "Ali5ha",
    database: 'estore',
    entities: [User, Categories, Subcategory, Product, Cart, Cartitem, Order, Orderitem, Review],
    synchronize: true,
    logging: false
});

async function seed() {
    try {
        await AppDataSource.initialize();
        console.log("Database initialized for seeding...");

        // Clear existing data with CASCADE to handle foreign key constraints
        await AppDataSource.query('TRUNCATE TABLE "review", "orderitem", "order", "cartitem", "cart", "user", "product", "subcategory", "categories" CASCADE');
        console.log("Existing data cleared.");

        // 1. Seed Categories
        const catRepo = AppDataSource.getRepository(Categories);
        const electronics = catRepo.create({ category_name: "Electronics" });
        const clothing = catRepo.create({ category_name: "Clothing" });
        await catRepo.save([electronics, clothing]);
        console.log("Categories seeded.");

        // 2. Seed Subcategories
        const subRepo = AppDataSource.getRepository(Subcategory);
        const smartphones = subRepo.create({ subcategory_name: "Smartphones", categories: electronics });
        const laptops = subRepo.create({ subcategory_name: "Laptops", categories: electronics });
        const tshirts = subRepo.create({ subcategory_name: "T-Shirts", categories: clothing });
        await subRepo.save([smartphones, laptops, tshirts]);
        console.log("Subcategories seeded.");

        // 3. Seed Products
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

        // 4. Seed User
        const userRepo = AppDataSource.getRepository(User);
        const user = userRepo.create({
            username: "john_doe",
            email: "john@example.com",
            password: "hashed_password_123",
            phone: "1234567890",
            dob: "1990-01-01" as any,
            role: Role.USER
        });
        await userRepo.save(user);
        console.log("User seeded.");

        // 5. Seed Cart
        const cartRepo = AppDataSource.getRepository(Cart);
        const cart = cartRepo.create({ user: user });
        await cartRepo.save(cart);
        console.log("Cart seeded.");

        // 6. Seed CartItems
        const cartItemRepo = AppDataSource.getRepository(Cartitem);
        const item1 = cartItemRepo.create({ cart: cart, product: iphone, quantity: 1 });
        await cartItemRepo.save(item1);
        console.log("CartItems seeded.");

        // 7. Seed Order
        const orderRepo = AppDataSource.getRepository(Order);
        const order = orderRepo.create({
            user: user,
            order_description: "First order",
            total_amount: 999.99,
            order_date: new Date() as any
        });
        await orderRepo.save(order);
        console.log("Order seeded.");

        // 8. Seed OrderItems
        const orderItemRepo = AppDataSource.getRepository(Orderitem);
        const oItem1 = orderItemRepo.create({
            order: order,
            product: iphone,
            quantity: 1,
            price: 999.99
        });
        await orderItemRepo.save(oItem1);
        console.log("OrderItems seeded.");

        // 9. Seed Reviews
        const reviewRepo = AppDataSource.getRepository(Review);
        const review = reviewRepo.create({
            user: user,
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
