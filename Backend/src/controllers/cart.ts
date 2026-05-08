import { Request, Response, NextFunction } from "express";
import { AddToCartInput, UpdateCartInput } from "../schemas/cart.ts";
import * as cartService from "../services/cart.ts";

const addToCart = async (req: Request, res: Response, next: NextFunction) =>{
    try {
        const input = req.body as AddToCartInput;
        const user_id = (req as any).user.user_id;

        const item = await cartService.addItemToCart(user_id, input);

        return res.status(200).json({
            message: 'Product added to cart successfully',
            item,
         });
    } catch (err) {
        next(err);
    };

};

const getMyCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user_id = (req as any).user.user_id;
        const cart = await cartService.fetchMyCart(user_id);

        return res.status(200).json(cart);
    } catch (err) {
        next(err);
    }
};

const removeFromCart = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const user_id = (req as any).user.user_id;
        const cart_item_id = parseInt(req.params['cart_item_id'] as string, 10);

        if(isNaN(cart_item_id)){
            return res.status(400).json({message: 'Invalid cart item ID'});
        }

        await cartService.removeItemFromCart(user_id, cart_item_id);

        return res.status(200).json({ message: 'Item removed from cart successfully' });
    } catch (err) {
        next(err);
    }
}

const updateCart = async(req: Request, res: Response, next: NextFunction) =>{
    try {
        const user_id = (req as any).user.user_id;
        const cart_item_id = parseInt(req.params['cart_item_id'] as string, 10);
        const input = req.body as UpdateCartInput;

        if (isNaN(cart_item_id)) {
            return res.status(400).json({ message: 'Invalid cart item ID' });
        }

        const item = await cartService.updateCartItemQuantity(user_id, cart_item_id, input);

        return res.status(200).json({
            message: 'Cart item updated successfully',
            item,
        });

    } catch (err) {
        next(err);
    }
}


export {getMyCart, addToCart, removeFromCart, updateCart};
