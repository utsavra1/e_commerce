import { Request, Response, NextFunction } from "express";
import { Order } from "../entites/Order.ts";
import { AppDataSource } from "../app.ts";
import { PlaceOrderInput } from "../schemas/order.ts";
import { Cart } from "../entites/Cart.ts";
import { User } from "../entites/User.ts";
import { Orderitem } from "../entites/Orderitem.ts";
import { Cartitem } from "../entites/Cartitem.ts";
import { Product } from "../entites/Product.ts";


const placeOrder = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const user_id = (req as any).user.user_id;
        const { order_description } = req.body as PlaceOrderInput;

        const orderRepo = AppDataSource.getRepository(Order);
        const cartRepo = AppDataSource.getRepository(Cart);
        const userRepo = AppDataSource.getRepository(User);
        const orderitemRepo = AppDataSource.getRepository(Orderitem);
        const cartitemRepo = AppDataSource.getRepository(Cartitem);
        const productRepo = AppDataSource.getRepository(Product);

        const cart = await cartRepo.findOne({
            where: {user :{user_id}},
            relations: ['cartitem', 'cartitem.product'],
        });

        if(!cart || cart.cartitem.length === 0){
            return res.status(400).json({ message: 'Your cart is empty' });
        }

        for(const item of cart.cartitem){
            if(item.product.stock < item.quantity){
                return res.status(400).json({
                message: `Insufficient stock for ${item.product.product_name}. Only ${item.product.stock} left`,
                });
            }
        }

        const total_amount = cart.cartitem.reduce((sum, item) => {
                return sum + Number(item.product.product_price) * item.quantity;
        }, 0)
        

        const order = await orderRepo.create({
            order_description,
            total_amount,
            user: {user_id}
        });

        await orderRepo.save(order);

        for(const item of cart.cartitem){
            const orderitem = await orderitemRepo.create({
                price: Number(item.product.product_price),
                quantity: item.quantity,
                order,
                product: item.product,
            });
            await orderitemRepo.save(orderitem);

            item.product.stock -= item.quantity;
            await productRepo.save(item.product);
        }

        await cartitemRepo.delete(cart.cartitem);

        return res.status(201).json({
            message: 'Order placed successfully',
            order: {
                order_id: order.order_id,
                order_description: order.order_description,
                total_amount: order.total_amount,
                items: cart.cartitem.map((item) => ({
                    product_name: item.product.product_name,
                    quantity: item.quantity,
                    price: Number(item.product.product_price),
                    subtotal: Number(item.product.product_price) * item.quantity,
                })),
            },
        });
    } catch (err) {
        next(err);
    }
};

const getMyOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const user_id = (req as any).user.user_id;
        const orderRepo = AppDataSource.getRepository(Order);
        const order = await orderRepo.find({
            where: {user: {user_id}},
            order: {order_date: 'DESC'},
        });

        if(order.length === 0){
            return res.status(404).json({ message: 'No orders found' });
        }

        return res.status(200).json({
            total_orders: order.length,
            orders: order.map((order) => ({
                order_id: order.order_id,
                order_description: order.order_description,
                total_amount: order.total_amount,
                order_date: order.order_date,
            })),
        });        
    } catch (err) {
        next(err);
    }
};

const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user_id = (req as any).user.user_id;
    const order_id = parseInt(req.params['order_id'] as string, 10);

    if (isNaN(order_id)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    const orderRepo = AppDataSource.getRepository(Order);
    const order = await orderRepo.findOne({
      where: {
        order_id,
        user: { user_id }, // ✅ security check — order must belong to this user
      },
      relations: ['orderitem', 'orderitem.product'],
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.status(200).json({
      order_id: order.order_id,
      order_description: order.order_description,
      order_date: order.order_date,
      total_amount: order.total_amount,
      total_items: order.orderitem.length,
      items: order.orderitem.map((item) => ({
        order_item_id: item.order_item_id,
        product_name: item.product.product_name,
        quantity: item.quantity,
        price: item.price,           // price snapshot at time of purchase
        subtotal: Number(item.price) * item.quantity,
      })),
    });
  } catch (err) {
    next(err);
  }
};

export {placeOrder, getMyOrder, getOrderById};
