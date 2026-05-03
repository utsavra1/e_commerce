import { Request, Response } from "express";
import { Cart } from "../entites/Cart.ts";
import { Cartitem } from "../entites/Cartitem.ts";
import { Product } from "../entites/Product.ts";
import { AppDataSource } from "../app.ts";



const addToCart = async (req: Request, res: Response) =>{
    try {
        const {product_id, quantity} = req.body;
        const user_id = (req as any).user.user_id;

        const productRepo = AppDataSource.getRepository(Product);
        const product = await productRepo.findOne({
            where: {product_id: product_id}
        })

        if(!product){
            return res.status(400).json('Product not available');
        }

        if(product.stock < quantity){
            return res.status(400).json(`Only ${product.stock} stock available of the product`);
        }

        const cartRepo = AppDataSource.getRepository(Cart);
        let cart = await cartRepo.findOne({
            where: {user: {user_id}}
        });

        if(!cart){
            cart = cartRepo.create({user: {user_id}});
            await cartRepo.save(cart);
        }

        //checking if product is already in cart 

        const cartitemRepo = AppDataSource.getRepository(Cartitem);
        let cartitem = await cartitemRepo.findOne({
            where: {
                cart: {cart_id: cart?.cart_id},
                product: {product_id},
            }
        });

        if(cartitem){
            cartitem.quantity += quantity;
            await cartitemRepo.save(cartitem);
        } else{
            cartitem = cartitemRepo.create({quantity, cart, product });
            await cartitemRepo.save(cartitem);
        }

        return res.status(200).json({
        message: 'Product added to cart successfully',
         item: {
            product_name: product.product_name,
            quantity: cartitem.quantity,
            price: product.product_price,
            },
         });
    } catch (err) {
        return res.status(500).json({message: 'Server Error', error: err});
    };

};

const getMyCart = async (req: Request, res: Response) => {
    try {

        const user_id = (req as any).user.user_id;

        const cartRepo = AppDataSource.getRepository(Cart);
        const cart = await cartRepo.findOne({
            where: {user: {user_id}},
            relations: ['cartitem', 'cartitem.product'],
        });

        if (!cart) {
        return res.status(404).json({ message: 'Cart is empty' });
        }

        const total = cart.cartitem.reduce((sum, item) => {
            return sum + Number(item.product.product_price) * item.quantity;
        }, 0);

        return res.status(200).json({
            cart_id: cart.cart_id,
            total_item: cart.cartitem.length,
            total_price: total,
            items: cart.cartitem.map((item) =>({
                cart_item_id: item.cart_item_id,
                product_id: item.product.product_id,
                product_name: item.product.product_name,
                price: item.product.product_price,
                quantity: item.quantity,
                subtotal: Number(item.product.product_price) * item.quantity,
            })),
        });
    } catch (err) {
        return res.status(500).json({message: 'Server Error', error: err});
    }
};



export {getMyCart, addToCart};


