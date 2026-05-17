import { Order } from "../entites/Order.ts";
import { AppDataSource } from "../app.ts";
import { PlaceOrderInput } from "../schemas/order.ts";
import { Cart } from "../entites/Cart.ts";
import { User } from "../entites/User.ts";
import { Orderitem } from "../entites/Orderitem.ts";
import { Cartitem } from "../entites/Cartitem.ts";
import { Product } from "../entites/Product.ts";
import { getIO } from '../socket/socket.ts';
import { SOCKET_EVENTS } from '../socket/socket.event.ts';
import { createError } from "../utils/error.ts";
import { sendEmail } from "../utils/mailer.ts";

const placeNewOrder = async (user_id: number, input: PlaceOrderInput) => {
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
        throw createError('Your cart is empty', 404);
    }

    for(const item of cart.cartitem){
        if(item.product.stock < item.quantity){
            throw createError(`Insufficient stock for ${item.product.product_name}. Only ${item.product.stock} left`, 404);
        }
    }

    const total_amount = cart.cartitem.reduce((sum, item) => {
            return sum + Number(item.product.product_price) * item.quantity;
    }, 0)
    

    const order = await orderRepo.create({
        order_description: input.order_description,
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

        // using socket when the qantity changes

        getIO().emit(SOCKET_EVENTS.STOCK_UPDATE, {
            product_id: item.product.product_id,
            product_name: item.product.product_name,
            new_stock: item.product.stock,
        })
    }

    await cartitemRepo.delete(cart.cartitem);
    const user = await userRepo.findOne({ where: { user_id } });


    const orderSummary = {
    order_id: order.order_id,
    order_description: order.order_description,
    total_amount: order.total_amount,
    items: cart.cartitem.map((item) => ({
      product_name: item.product.product_name,
      quantity: item.quantity,
      price: Number(item.product.product_price),
      subtotal: Number(item.product.product_price) * item.quantity,
    })),
  };

  if(user?.email){
    sendEmail(user.email, orderSummary).catch(err => console.error(err));
  }

  // socket to notify admin about order in real time
  getIO().to('admin_room').emit(SOCKET_EVENTS.NEW_ORDER), {
    message: `New order #${order.order_id} placed`,
    ...orderSummary,
  }
  return orderSummary;

};

const fetchMyOrders = async(user_id: number) => {
    const orderRepo = AppDataSource.getRepository(Order);
    const order = await orderRepo.find({
        where: {user: {user_id}},
        order: {order_date: 'DESC'},
    });

    if(order.length === 0){
        throw createError('No Order Found', 404);
    }

    return {
    total_orders: order.length,
    orders: order.map((order) => ({
      order_id: order.order_id,
      order_description: order.order_description,
      total_amount: order.total_amount,
      order_date: order.order_date,
    })),
  };
};

const fetchOrderById = async(order_id: number, user_id: number) =>{
    const orderRepo = AppDataSource.getRepository(Order);
    const order = await orderRepo.findOne({
      where: {
        order_id,
        user: { user_id },
      },
      relations: ['orderitem', 'orderitem.product'],
    });

    if (!order) {
        throw createError('Order not found', 404);
    }

    return{
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
    };
};

const emitOrderStatusUpdate = (user_id: number, order_id: number, status: string) => {
    getIO().to(`user_${user_id} `).emit(SOCKET_EVENTS.ORDER_STATUS_UPDATE), {
        message: `Your order #${order_id} status updated to: ${status}`,
        order_id,
        status,
    };
};  

export {fetchMyOrders, fetchOrderById, placeNewOrder, emitOrderStatusUpdate};