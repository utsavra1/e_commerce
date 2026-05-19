import { Request, Response, NextFunction } from "express";
import { PlaceOrderInput } from "../schemas/order.ts";
import * as orderService from "../services/order.ts";
import {fetchMyOrders} from "../services/order.ts";

const placeOrder = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const user_id = (req as any).user.user_id;
        const input = req.body as PlaceOrderInput;

        const order = await orderService.placeNewOrder(user_id, input);

        return res.status(201).json({
            message: 'Order placed successfully',
            order,
        });
    } catch (err) {
        next(err);
    }
};

const getMyOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user_id = (req as any).user.user_id;
        const result = await orderService.fetchMyOrders(user_id);

        return res.status(200).json(result);        
    } catch (err) {
        next(err);
    }
};

const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user_id = (req as any).user.user_id;
    const order_id = parseInt(req.params['order_id'] as string, 10);
    const role = (req as any).user.role;

    if (isNaN(order_id)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    const order = await orderService.fetchOrderById(order_id, user_id, role);

    return res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await orderService.fetchAllOrders();
        return res.status(200).json(orders);
    } catch (err) {
        next(err);
    }
};

export {placeOrder, getMyOrder, getOrderById, getAllOrders};
