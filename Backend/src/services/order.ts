import { Order } from "../entites/Order.ts";
import { AppDataSource } from "../config/database.ts";
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

const placeNewOrder = async (user_id: number, input: { 
    order_description: string, 
    payment_method: 'esewa' | 'cod',
    province: string,
    district: string,
    city: string,
    street_address: string 
}) => {
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
        payment_status: 'pending',
        payment_method: input.payment_method,
        province: input.province,       
        district: input.district,         
        city: input.city,                 
        street_address: input.street_address,
        user: { user_id }
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
        });

        if (item.product.stock <= 5){
        getIO().to('admin_room').emit(SOCKET_EVENTS.LOW_STOCK_ALERT, {
            message: `Low stock alert for ${item.product.product_name} has only ${item.product.stock} left`,
            product_id: item.product.product_id,
            stock: item.product.stock
        });
    }
    }
    await cartitemRepo.remove(cart.cartitem);
    const user = await userRepo.findOne({ where: { user_id } });


  const orderSummary: any = {
    order_id: order.order_id,
    order_description: order.order_description,
    total_amount: order.total_amount,
    payment_method: order.payment_method,
    province: order.province,
    district: order.district,
    city: order.city,
    street_address: order.street_address,
    orderitem: cart.cartitem.map((item) => ({
      product_name: item.product.product_name,
      quantity: item.quantity,
      price: Number(item.product.product_price),
      subtotal: Number(item.product.product_price) * item.quantity,
    })),
  };
  
  // Notify admin about the order (works for both eSewa and COD)
  getIO().to('admin_room').emit(SOCKET_EVENTS.NEW_ORDER, {
    message: `New order #${order.order_id} placed (${order.payment_method})`,
    ...orderSummary,
  });

  return orderSummary;
};

const fetchMyOrders = async(user_id: number) => {
    const orderRepo = AppDataSource.getRepository(Order);
    const order = await orderRepo.find({
        where: {user: {user_id}},
        order: {order_date: 'DESC'},
    });

    return {
    total_orders: order.length,
    orders: order.map((order) => ({
      order_id: order.order_id,
      order_description: order.order_description,
      total_amount: order.total_amount,
      order_date: order.order_date,
      payment_method: order.payment_method,
      payment_status: order.payment_status,
      province: order.province,
      district: order.district,
      city: order.city,
      street_address: order.street_address,
    })),
  };
};

const fetchOrderById = async(order_id: number, user_id: number, role?: string) =>{
    const orderRepo = AppDataSource.getRepository(Order);
    const findOptions: any = {
      where: { order_id },
      relations: ['orderitem', 'orderitem.product', 'user'],
    };

    if (role !== 'admin') {
      findOptions.where.user = { user_id };
    }

    const order = await orderRepo.findOne(findOptions);

    if (!order) {
        throw createError('Order not found', 404);
    }

    return{
        order_id: order.order_id,
        order_description: order.order_description,
        order_date: order.order_date,
        total_amount: order.total_amount,
        payment_method: order.payment_method,
        payment_status: order.payment_status,
        province: order.province,
        district: order.district,
        city: order.city,
        street_address: order.street_address,
        total_items: order.orderitem.length,
        orderitem: order.orderitem.map((item) => ({
            order_item_id: item.order_item_id,
            product: {
                product_name: item.product.product_name
            },
            quantity: item.quantity,
            price: item.price,           // price snapshot at time of purchase
            subtotal: Number(item.price) * item.quantity,
        })),
        user: {
            user_id: order.user.user_id,
            username: order.user.username,
            email: order.user.email
        }
    };
};

const fetchAllOrders = async () => {
    const orderRepo = AppDataSource.getRepository(Order);
    return await orderRepo.find({
        relations: ['user', 'orderitem', 'orderitem.product'],
        order: { order_date: 'DESC' }
    });
};

const emitOrderStatusUpdate = (user_id: number, order_id: number, status: string) => {
    getIO().to(`user_${user_id}`).emit(SOCKET_EVENTS.ORDER_STATUS_UPDATE, {
        message: `Your order #${order_id} status updated to: ${status}`,
        order_id,
        status,
    });
};  

export {fetchMyOrders, fetchOrderById, placeNewOrder, emitOrderStatusUpdate, fetchAllOrders};